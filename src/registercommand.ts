/**
 * @license     MIT
 * @file        src/registercommand.ts
 * @author      vicentefelipechile
 * @description This module provides functionality to register modular commands for a Discord bot using Discord.js.
 *              It constructs command data objects, sets up execution contexts for various interaction types,
 *              and handles localization, permissions, NSFW checks, and cooldowns.
 */

// =================================================================================================
// Imports
// =================================================================================================

import {
    ApplicationCommandOptionType as OptionType,
    ChatInputCommandInteraction,
    MessageComponentInteraction,
    ModalSubmitInteraction,
    ButtonInteraction,
    StringSelectMenuInteraction,
    SlashCommandBuilder,
    Locale,
    MessageFlags,
    Interaction,
    SlashCommandSubcommandBuilder,
} from "discord.js";

import isUserInCooldown, { cooldownRegister, cooldownSetUser } from "./cooldown";
import { LOCALE_FORBIDDEN, LOCALE_NSFW, LOCALE_DELAY } from "./locales";
import { CommandArgumentValue, CommandData, CommandOption } from "./types";
import ModularCommand from "./modularcommand";

// =================================================================================================
// Helper Functions
// =================================================================================================

type LocalizationMap = Record<string, Record<string, string>>;
type LocalizationPhrases = Record<string, string>;

/**
 * @description Gets localized description for a subcommand.
 * Supports multiple languages and falls back to default description if not found.
 * @param {ModularCommand} command The command instance.
 * @param {string} subCommandName The name of the subcommand.
 * @param {string} defaultDescription The default description.
 * @param {string} locale The locale to use (defaults to EnglishUS).
 * @returns {string} The localized description.
 */
function getLocalizedSubCommandDescription(
    command: ModularCommand,
    subCommandName: string,
    defaultDescription: string,
    locale: string = Locale.EnglishUS
): string {
    if (!command.subCommandLocalizations) return defaultDescription;

    const localizations = command.subCommandLocalizations as Record<string, Record<string, string>>;
    const key = `${subCommandName}.description`;

    // Try to get the localization for the requested locale
    const targetLocalizations = localizations[locale];
    if (targetLocalizations?.[key]) {
        return targetLocalizations[key];
    }

    // Fall back to English if the requested locale is not found
    const enLocalizations = localizations[Locale.EnglishUS];
    if (enLocalizations?.[key]) {
        return enLocalizations[key];
    } else {
        throw new Error(`Missing localization for subcommand '${subCommandName}' in command '${command.name}'`);
    }
}

/**
 * @description Gets localized description for a subcommand option.
 * Supports multiple languages and falls back to default description if not found.
 * @param {ModularCommand} command The command instance.
 * @param {string} subCommandName The name of the subcommand.
 * @param {string} optionName The name of the option.
 * @param {string} defaultDescription The default description.
 * @param {string} locale The locale to use (defaults to EnglishUS).
 * @returns {string} The localized description.
 */
function getLocalizedOptionDescription(
    command: ModularCommand,
    subCommandName: string,
    optionName: string,
    defaultDescription: string,
    locale: string = Locale.EnglishUS
): string {
    if (!command.subCommandLocalizations) return defaultDescription;

    const localizations = command.subCommandLocalizations as Record<string, Record<string, string>>;
    const key = `${subCommandName}.${optionName}.description`;

    // Try to get the localization for the requested locale
    const targetLocalizations = localizations[locale];
    if (targetLocalizations?.[key]) {
        return targetLocalizations[key];
    }

    // Fall back to English if the requested locale is not found
    const enLocalizations = localizations[Locale.EnglishUS];
    if (enLocalizations?.[key]) {
        return enLocalizations[key];
    } else {
        throw new Error(`Missing localization for option '${optionName}' in subcommand '${subCommandName}' for command '${command.name}'`);
    }
}

/**
 * @description Creates an option builder function with common configuration.
 * Supports multi-language descriptions through LocalizationMap.
 * @param {CommandOption} opt The option configuration.
 * @param {string} description The resolved description.
 * @returns {Function} The option builder function.
 */
function createOptionBuilder(opt: CommandOption, description: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (option: any) => {
        option.setName(opt.name)
            .setDescription(description)
            .setRequired(opt.required || false)
            .setDescriptionLocalizations(typeof opt.description === 'object' ? opt.description : {});

        if (opt.choices && opt.choices.length > 0) {
            option.addChoices(...opt.choices);
        }
        return option;
    };
}

/**
 * @description Adds an option to a command or subcommand builder based on its type.
 * @param {any} builder The command or subcommand builder.
 * @param {CommandOption} opt The option to add.
 * @param {Function} optionBuilder The option builder function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addOptionToBuilder(builder: any, opt: CommandOption, optionBuilder: (option: any) => any): void {
    switch (opt.type) {
        case OptionType.String: builder.addStringOption(optionBuilder); break;
        case OptionType.Boolean: builder.addBooleanOption(optionBuilder); break;
        case OptionType.Integer: builder.addIntegerOption(optionBuilder); break;
        case OptionType.Number: builder.addNumberOption(optionBuilder); break;
        case OptionType.User: builder.addUserOption(optionBuilder); break;
        case OptionType.Role: builder.addRoleOption(optionBuilder); break;
        case OptionType.Channel: builder.addChannelOption(optionBuilder); break;
        default: throw new Error(`Unsupported option type: ${opt.type}`);
    }
}

/**
 * @description Processes and adds subcommands to a command builder.
 * @param {SlashCommandBuilder} commandBuilder The command builder.
 * @param {ModularCommand} command The command instance.
 * @param {Record<string, OptionType>} options The options record to populate.
 */
function processSubCommands(commandBuilder: SlashCommandBuilder, command: ModularCommand, options: Record<string, OptionType>): void {
    if (!command.subCommands || command.subCommands.length === 0) return;

    command.subCommands.forEach(subCmd => {
        commandBuilder.addSubcommand((subcommand: SlashCommandSubcommandBuilder) => {
            if (typeof subCmd.name !== 'string' || subCmd.name.trim() === '') {
                throw new Error("A subcommand is missing a name.");
            }

            // Get localized description for subcommand
            const subCmdDescription = getLocalizedSubCommandDescription(command, subCmd.name, subCmd.description);

            if (typeof subCmdDescription !== 'string' || subCmdDescription.trim() === '') {
                throw new Error(`Subcommand '${subCmd.name}' is missing a description.`);
            }

            subcommand
                .setName(subCmd.name)
                .setDescription(subCmdDescription);

            // Add options to the subcommand
            if (subCmd.options) {
                subCmd.options.forEach(opt => {
                    // Get base description
                    let description = typeof opt.description === 'string'
                        ? opt.description
                        : (opt.description[Locale.EnglishUS] || `The description for ${opt.name} in English.`);

                    // Apply subcommand-specific localization
                    description = getLocalizedOptionDescription(command, subCmd.name, opt.name, description);

                    if (!description) {
                        throw new Error(`Option '${opt.name}' in subcommand '${subCmd.name}' is missing a description.`);
                    }

                    options[opt.name] = opt.type;

                    const optionBuilder = createOptionBuilder(opt, description);
                    addOptionToBuilder(subcommand, opt, optionBuilder);
                });
            }

            return subcommand;
        });
    });
}

/**
 * @description Processes and adds regular options to a command builder.
 * @param {SlashCommandBuilder} commandBuilder The command builder.
 * @param {ModularCommand} command The command instance.
 * @param {Record<string, OptionType>} options The options record to populate.
 */
function processRegularOptions(commandBuilder: SlashCommandBuilder, command: ModularCommand, options: Record<string, OptionType>): void {
    command.options.forEach(opt => {
        const description = typeof opt.description === 'string'
            ? opt.description
            : (opt.description[Locale.EnglishUS] || `The description for ${opt.name} in English.`);

        if (!description) {
            throw new Error(`Option '${opt.name}' is missing a description.`);
        }

        options[opt.name] = opt.type;

        const optionBuilder = createOptionBuilder(opt, description);
        addOptionToBuilder(commandBuilder, opt, optionBuilder);
    });
}

/**
 * @description Gets the appropriate localization object for a command based on the interaction's locale.
 * Falls back to EnglishUS if the target locale is not available.
 * @param {ModularCommand} command The command instance.
 * @param {Interaction} interaction The interaction object to get the locale from.
 * @returns {LocalizationPhrases} The resolved locale object.
 * @throws {Error} If the EnglishUS localization is missing when at least one localization is defined.
 */
function getCommandLocale(command: ModularCommand, interaction: Interaction | MessageComponentInteraction): LocalizationPhrases {
    const localeTable = command.localizationPhrases as LocalizationMap;

    if (!localeTable || Object.keys(localeTable).length === 0) {
        return {};
    }

    if (!localeTable[Locale.EnglishUS]) {
        throw new Error(`Missing localization for EnglishUS in command ${command.name}`);
    }

    let phrases = localeTable[interaction.locale];

    if (!phrases) {
        phrases = localeTable[Locale.EnglishUS];
    }

    return phrases;
}


// =================================================================================================
// Execution Context Constructors
// =================================================================================================

/**
 * @description Creates the execution function for chat input (slash) commands.
 * @param {ModularCommand} command The command to create the executor for.
 * @param {Record<string, OptionType>} options The parsed options for argument retrieval.
 * @returns {Function} The async function that will handle the interaction.
 */
function createChatInputExecutor(command: ModularCommand, options: Record<string, OptionType>) {
    return async (interaction: ChatInputCommandInteraction): Promise<void> => {
        // Permission & NSFW Checks
        let hasPermission = true;
        if (command.permissionCheck !== undefined) {
            hasPermission = await command.permissionCheck(interaction);
        }

        if (!hasPermission) {
            await interaction.reply({ content: LOCALE_FORBIDDEN[interaction.locale], flags: MessageFlags.Ephemeral });
            return;
        }

        if (command.isNSFW && (!interaction.channel || !('nsfw' in interaction.channel) || !interaction.channel.nsfw)) {
            await interaction.reply({ content: LOCALE_NSFW[interaction.locale], flags: MessageFlags.Ephemeral });
            return;
        }

        // Cooldown Check
        const { inCooldown, waitTime } = isUserInCooldown(command.name, interaction.user.id);
        if (inCooldown) {
            await interaction.reply({ content: LOCALE_DELAY[interaction.locale].formatTime(waitTime), flags: MessageFlags.Ephemeral });
            return;
        }
        cooldownSetUser(command.name, interaction.user.id);

        // Argument Parsing
        const args: Record<string, CommandArgumentValue> = {};

        // Check if this command has subcommands and get the current subcommand
        let currentSubcommand = null;
        if (command.subCommands && command.subCommands.length > 0) {
            try {
                currentSubcommand = interaction.options.getSubcommand();
            } catch {
                throw new Error(`Subcommand not found for command ${command.name}.`);
            }
        }

        for (const optionName of Object.keys(options)) {
            switch (options[optionName]) {
                case OptionType.String: args[optionName] = interaction.options.getString(optionName, false); break;
                case OptionType.Boolean: args[optionName] = interaction.options.getBoolean(optionName, false); break;
                case OptionType.Integer: args[optionName] = interaction.options.getInteger(optionName, false); break;
                case OptionType.Number: args[optionName] = interaction.options.getNumber(optionName, false); break;
                case OptionType.User: args[optionName] = interaction.options.getUser(optionName, false); break;
                case OptionType.Role: args[optionName] = interaction.options.getRole(optionName, false); break;
                case OptionType.Channel: args[optionName] = interaction.options.getChannel(optionName, false) as CommandArgumentValue; break;
                default: throw new Error(`Unsupported option type: ${options[optionName]}`);
            }
        }

        // Add the current subcommand to args if it exists
        if (currentSubcommand) {
            args['subcommand'] = currentSubcommand;
        }

        const locale = getCommandLocale(command, interaction);

        // Execute Handler
        await command.execute({ interaction, args, command, locale });
    };
}

/**
 * @description Creates the execution function for message components.
 * @param {ModularCommand} command The command to create the executor for.
 * @returns {Function|undefined} The async function or undefined if not needed.
 */
function createComponentExecutor(command: ModularCommand) {
    const executor = command.componentExecute;
    if (executor === undefined) return undefined;

    return async (interaction: MessageComponentInteraction): Promise<void> => {
        if (!interaction.customId.startsWith(command.componentId || '')) return;

        await executor({
            interaction,
            command,
            locale: getCommandLocale(command, interaction),
        });
    };
}

/**
 * @description Creates the execution function for modal submissions.
 * @param {ModularCommand} command The command to create the executor for.
 * @returns {Function|undefined} The async function or undefined if not needed.
 */
function createModalExecutor(command: ModularCommand) {
    if (command.modals.size === 0) return undefined;

    return async (interaction: ModalSubmitInteraction): Promise<void> => {
        const modalObject = command.modals.get(interaction.customId.split('_')[1]);
        if (!modalObject) return;

        const args: Record<string, string> = {};
        for (const [id] of modalObject.modalInputs.entries()) {
            args[id] = interaction.fields.getTextInputValue(id);
        }

        await modalObject.execute({
            interaction,
            args,
            command,
            locale: getCommandLocale(command, interaction),
        });
    };
}

/**
 * @description Creates the execution function for button interactions.
 * @param {ModularCommand} command The command to create the executor for.
 * @returns {Function|undefined} The async function or undefined if not needed.
 */
function createButtonExecutor(command: ModularCommand) {
    if (command.buttons.size === 0) return undefined;

    return async (interaction: ButtonInteraction): Promise<void> => {
        const buttonObject = command.buttons.get(interaction.customId.split('_')[1]);
        if (!buttonObject) return;

        // Check if the button is allowed to be used by others
        if (buttonObject.allowOthers === false) {
            const interactionData = interaction.message.interactionMetadata;
            if (interactionData !== null && interactionData.user.id !== interaction.user.id) {
                await interaction.reply({ content: LOCALE_FORBIDDEN[interaction.locale], flags: MessageFlags.Ephemeral });
                return;
            }
        }

        await buttonObject.execute({
            interaction,
            command,
            locale: getCommandLocale(command, interaction),
            message: interaction.message,
        });
    };
}

/**
 * @description Creates the execution function for select menu interactions.
 * @param {ModularCommand} command The command to create the executor for.
 * @returns {Function|undefined} The async function or undefined if not needed.
 */
function createSelectMenuExecutor(command: ModularCommand) {
    if (command.selectMenus.size === 0) return undefined;

    return async (interaction: StringSelectMenuInteraction): Promise<void> => {
        const menuObject = command.selectMenus.get(interaction.customId.split('_')[1]);
        if (!menuObject) return;

        if (!menuObject.allowOthers && interaction.user.id !== interaction.message.author.id) {
            await interaction.reply({ content: LOCALE_FORBIDDEN[interaction.locale], flags: MessageFlags.Ephemeral });
            return;
        }

        // The user's selected option value is abstracted into `selected`.
        await menuObject.execute({
            interaction,
            command,
            locale: getCommandLocale(command, interaction),
            message: interaction.message,
            selected: interaction.values[0],
        });
    };
}


// =================================================================================================
// Main Registration Function
// =================================================================================================

/**
 * @description Registers an array of modular commands, building their final `CommandData` objects.
 * This function processes the command definitions, sets up command builders, and assigns the execution logic.
 * @param {ModularCommand[] | ModularCommand} commands An array of or a single ModularCommand instance.
 * @returns {CommandData[]} An array of command data objects ready for the Discord.js client.
 */
export default function RegisterCommand(commands: ModularCommand[] | ModularCommand): CommandData[] {
    commands = Array.isArray(commands) ? commands : [commands];

    return commands.map(command => {
        if (typeof command.name !== 'string' || command.name.trim() === '') {
            throw new Error("A command is missing a name.");
        }

        if (typeof command.description !== 'string' || command.description.trim() === '') {
            throw new Error(`Command "${command.name}" is missing a description.`);
        }

        // Build SlashCommand Data
        const commandBuilder = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .setDescriptionLocalizations(command.descriptionLocalizations || null);

        cooldownRegister(command.name, command.cooldown);

        const options: Record<string, OptionType> = {};

        // Process subcommands or regular options
        if (command.subCommands && command.subCommands.length > 0) {
            processSubCommands(commandBuilder, command, options);
        } else {
            processRegularOptions(commandBuilder, command, options);
        }

        // Assign Handlers using Constructors
        return {
            data: commandBuilder,
            execute: createChatInputExecutor(command, options),
            componentExecute: createComponentExecutor(command),
            modalExecute: createModalExecutor(command),
            buttonExecute: createButtonExecutor(command),
            selectMenuExecute: createSelectMenuExecutor(command),
            cooldown: command.cooldown,
        };
    });
}