/**
 * @file Contains the logic for registering modular commands and building their Discord.js data structures.
 * @author vicentefelipechile
 * @license MIT
 */

import {
    ApplicationCommandOptionType as OptionType,
    ChatInputCommandInteraction,
    MessageComponentInteraction,
    ModalSubmitInteraction,
    ButtonInteraction,
    SlashCommandBuilder,
    Locale,
    MessageFlags,
    Interaction,
} from "discord.js";

import isUserInCooldown, { cooldownRegister, cooldownSetUser } from "./cooldown";
import { LOCALE_FORBIDDEN, LOCALE_NSFW, LOCALE_DELAY } from "./locales";
import { CommandArgumentValue, CommandData } from "./types";
import ModularCommand from "./modularcommand";

// =================================================================================================
// Helper Functions
// =================================================================================================

type LocalizationMap = Record<string, Record<string, string>>;
type LocalizationPhrases = Record<string, string>;

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
        if (command.permissionCheck && !command.permissionCheck({ interaction })) {
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
        for (const optionName of Object.keys(options)) {
            switch (options[optionName]) {
                case OptionType.String: args[optionName] = interaction.options.getString(optionName, false); break;
                case OptionType.Boolean: args[optionName] = interaction.options.getBoolean(optionName, false); break;
                case OptionType.Integer: args[optionName] = interaction.options.getInteger(optionName, false); break;
                case OptionType.Number: args[optionName] = interaction.options.getNumber(optionName, false); break;
                case OptionType.User: args[optionName] = interaction.options.getUser(optionName, false); break;
                default: throw new Error(`Unsupported option type: ${options[optionName]}`);
            }
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

        await buttonObject.execute({
            interaction,
            command,
            locale: getCommandLocale(command, interaction),
            message: interaction.message,
        });
    };
}


// =================================================================================================
// Main Registration Function
// =================================================================================================

/**
 * @description Registers an array of modular commands, building their final `CommandData` objects.
 * This function processes the command definitions, sets up command builders, and assigns the execution logic.
 * @param {ModularCommand[]} commands An array of ModularCommand instances.
 * @returns {CommandData[]} An array of command data objects ready for the Discord.js client.
 */
export default function RegisterCommand(commands: ModularCommand[] | ModularCommand): CommandData[] {
    commands = Array.isArray(commands) ? commands : [commands];
    
    return commands.map(command => {
        if (command.name === undefined) throw new Error("A command is missing a name.");
        if (command.description === undefined) throw new Error(`Command "${command.name}" is missing a description.`);

        // Build SlashCommand Data
        const commandBuilder = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .setDescriptionLocalizations(command.descriptionLocalizations || null);

        cooldownRegister(command.name, command.cooldown);

        const options: Record<string, OptionType> = {};

        command.options.forEach(opt => {
            const description =
                typeof opt.description === 'string'
                    ? opt.description
                    : (opt.description[Locale.EnglishUS] || `The description for ${opt.name} in English.`);
            
            if (!description) {
                throw new Error(`Option '${opt.name}' is missing a description.`);
            }

            options[opt.name] = opt.type;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const optionBuilder = (option: any) => {
                option.setName(opt.name)
                    .setDescription(description)
                    .setRequired(opt.required || false)
                    .setDescriptionLocalizations(typeof opt.description === 'object' ? opt.description : {});

                if (opt.choices && opt.choices.length > 0) {
                    option.addChoices(...opt.choices);
                }
                return option;
            };

            switch (opt.type) {
                case OptionType.String: commandBuilder.addStringOption(optionBuilder); break;
                case OptionType.Boolean: commandBuilder.addBooleanOption(optionBuilder); break;
                case OptionType.Integer: commandBuilder.addIntegerOption(optionBuilder); break;
                case OptionType.Number: commandBuilder.addNumberOption(optionBuilder); break;
                case OptionType.User: commandBuilder.addUserOption(optionBuilder); break;
                default: throw new Error(`Unsupported option type: ${opt.type}`);
            }
        });

        // Assign Handlers using Constructors
        return {
            data: commandBuilder,
            execute: createChatInputExecutor(command, options),
            componentExecute: createComponentExecutor(command),
            modalExecute: createModalExecutor(command),
            buttonExecute: createButtonExecutor(command),
            cooldown: command.cooldown,
        };
    });
}