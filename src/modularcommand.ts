/**
 * @module ModularCommand
 * @description A module for creating and managing modular commands in a easy way for me.
 * @license MIT
 */

/**
 * Imports
 */

import {
    ApplicationCommandOptionType,
    MessageComponentInteraction,
    ChatInputCommandInteraction,
    ModalSubmitInteraction,
    SlashCommandBuilder,
    ButtonBuilder,
    Locale,
    MessageFlags,
    Message,
    ButtonStyle,
    Channel,
    User,
    Role,
    GuildMember,
    LocalizationMap,
    APIApplicationCommandOptionChoice,
    CommandInteraction,
    ButtonInteraction,
} from 'discord.js';

import { LOCALE_FORBIDDEN, LOCALE_DELAY, LOCALE_NSFW } from './locales.js';
import { FormatSecondsLocale } from './locales.js';
import ModularModal from './modularmodal.js';


/**
 * Types
 */

type ArgType = string | number | boolean | User | Channel | Role | GuildMember;

type CommandExecuteFunction = (params: {
    interaction: ChatInputCommandInteraction;
    command: ModularCommand;
    locale: Record<string, any>;
    args?: Record<string, ArgType>;
}) => Promise<void>;

type ComponentExecuteFunction = (params: {
    interaction: MessageComponentInteraction;
    locale: Record<string, any>;
    command: ModularCommand;
}) => Promise<void>;

type ButtonExecuteFunction = (params: {
    interaction: ButtonInteraction;
    command: ModularCommand;
    locale: Record<string, any>;
    message: Message;
}) => Promise<void>;

type ModalExecuteFunction = (params: {
    interaction: ModalSubmitInteraction;
    command: ModularCommand;
    locale: Record<string, any>;
    args: Record<string, string>;
}) => Promise<void>;

type PermissionCheckFunction = (params: { interaction: CommandInteraction }) => boolean | Promise<boolean>;

/**
 * @description Registered Command as object to be used outside the modular command system.
 * @example
 * const PingCommand = new ModularCommand('ping');
 *
 * PingCommand.setExecute(({interaction}) => {
 *     interaction.reply('Pong!');
 * });
 *
 * const cmds = RegisterCommand([PingCommand])
 * const cmd = cmds[0];
 * console.log(cmd.execute); // [Function: execute]
 */
type CommandData = {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    componentExecute?: (interaction: MessageComponentInteraction) => Promise<void>;
    modalExecute?: (interaction: ModalSubmitInteraction) => Promise<void>;
    buttonExecute?: (interaction: ButtonInteraction) => Promise<void>;
    cooldown: number;
};

/**
 * Interface
 */

/**
 * @description Represents a command option for a modular command.
 */
interface CommandOption {
    name: string;
    type: ApplicationCommandOptionType;
    description: Record<Locale, string> | string;
    required?: boolean;
    choices?: APIApplicationCommandOptionChoice[];
}

/**
 * Variables
 */

const ALLOWED_OPTION_TYPE = [
    ApplicationCommandOptionType.String,
    ApplicationCommandOptionType.Boolean,
    ApplicationCommandOptionType.Integer,
    ApplicationCommandOptionType.Number,
    ApplicationCommandOptionType.User,
    ApplicationCommandOptionType.Channel,
];

const COOLDOWNS_MAP = new Map<string, Map<string, number>>();


/**
 * @class ModularButton
 * @description Represents a modular button that can be registered with Discord.js.
 * It allows for dynamic button creation and execution.
 */

class ModularButton {
    public buttonObject: ButtonBuilder;
    public customId: string;
    public style: ButtonStyle;
    public execute: ButtonExecuteFunction = async () => { };

    /**
     * Creates a new button for the command.
     * @param {string} customId The custom ID for the button.
     * @param {ButtonStyle} style The style of the button.
     */
    constructor(customId: string, style: ButtonStyle) {
        this.buttonObject = new ButtonBuilder();
        this.buttonObject.setCustomId(customId);
        this.buttonObject.setStyle(style);

        this.customId = customId;
        this.style = style;
    }

    /**
     * Sets the execute function for the button.
     * @param {ButtonExecuteFunction} executeFunction The function to execute.
     * @return {ModularButton} The button instance for chaining.
     */
    setExecute(executeFunction: ButtonExecuteFunction): this {
        this.execute = executeFunction;
        return this;
    }
}


/**
 * @description Represents a modular command that can be registered with Discord.js.
 * It allows for dynamic command creation and execution.
 * @example
 * const { ModularCommand, RegisterCommand } = require('js-discord-modularcommand');
 * 
 * const PingCommand = new ModularCommand('ping');
 * PingCommand.setDescription('Sends a ping message.');
 * PingCommand.setExecute(async ({interaction}) => {
 *     await interaction.reply('Pong!');
 * });
 *
 * PingCommand.setPermissionCheck(({ interaction }) => {
 *     return interaction.member.permissions.has(PermissionFlagsBits.Administrator);
 * });
 *
 * module.exports = RegisterCommand([
 *     PingCommand
 * ]);
 */
class ModularCommand {
    public name: string;
    public description: string;
    public execute: CommandExecuteFunction;
    public buttonExecute?: ButtonExecuteFunction;
    public componentExecute?: ComponentExecuteFunction;
    public modalExecute?: ModalExecuteFunction;
    public options: CommandOption[];
    public optionsLocalizations: Record<string, Record<Locale, string>>;
    public customIdHandlers: Record<string, CommandExecuteFunction>;
    public cooldown: number;
    public modals: Map<string, ModularModal>;
    public buttons: Map<string, ModularButton>;
    public buttonsArray: ModularButton[];
    public isNSFW: boolean;
    public descriptionLocalizations?: LocalizationMap;
    public localizationPhrases?: Record<Locale, any>;
    public permissionCheck?: PermissionCheckFunction;
    public componentId?: string;

    constructor(name: string) {
        this.name = name;
        this.description = '';
        this.execute = async () => {};
        this.componentExecute = undefined;
        this.modalExecute = undefined;
        this.options = [];
        this.optionsLocalizations = {};
        this.customIdHandlers = {};
        this.cooldown = 3;
        this.modals = new Map();
        this.buttons = new Map();
        this.buttonsArray = [];
        this.isNSFW = false;
    }

    /**
     * Sets the description of the command.
     * @param {string} description The description.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setDescription(description: string): this {
        this.description = description;
        return this;
    }

    /**
     * Sets the description localizations for the command.
     * @param {LocalizationMap} localizations The description localizations.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setLocalizationsDescription(localizations: LocalizationMap): this {
        this.description = localizations[Locale.EnglishUS] || this.description;
        this.descriptionLocalizations = localizations;
        return this;
    }

    setLocalizationOptions(localizations: Record<string, Record<Locale, string>>): this {
        this.optionsLocalizations = localizations;
        return this;
    }

    /**
     * Sets the localization phrases for the command.
     * @param {Record<Locale, any>} localizationPhrases The localization phrases.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setLocalizationPhrases(localizationPhrases: Record<Locale, any>): this {
        this.localizationPhrases = localizationPhrases;
        return this;
    }

    /**
     * Sets the execute function for the command.
     * @param {CommandExecuteFunction} executeFunction The function to execute.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setExecute(executeFunction: CommandExecuteFunction): this {
        this.execute = executeFunction;
        return this;
    }

    /**
     * Sets the component execute function for the command.
     * @param {string} componentId The base ID for the components.
     * @param {ComponentExecuteFunction} executeFunction The function to execute for component interactions.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setComponentExecute(componentId: string, executeFunction: ComponentExecuteFunction): this {
        this.componentId = componentId;
        this.componentExecute = executeFunction;
        return this;
    }

    /**
     * Set the minimun permissions required to execute the command.
     * @param {PermissionCheckFunction} permissionCheckFunction The function to check permissions.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setPermissionCheck(permissionCheckFunction: PermissionCheckFunction): this {
        this.permissionCheck = permissionCheckFunction;
        return this;
    }

    /**
     * Sets the cooldown for the command.
     * @param {number} cooldown The cooldown in seconds.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setCooldown(cooldown: number): this {
        this.cooldown = cooldown;
        return this;
    }

    /**
     * Gets the component ID for the command.
     * @returns {string | undefined} The component ID.
     */
    getComponentId(): string | undefined {
        return this.componentId;
    }

    /**
     * Adds an option to the command.
     * @param {CommandOption} option The option for the command option.
     * @returns {ModularCommand} The command instance for chaining.
     */
    addOption(option: CommandOption): this {
        if (!ALLOWED_OPTION_TYPE.includes(option.type)) {
            throw new Error(`Invalid option type: ${option.type}. Allowed types are: ${ALLOWED_OPTION_TYPE.join(', ')}`);
        }

        this.options.push(option);

        return this;
    }

    /**
     * Adds a custom ID handler for the command.
     * @param {string} customId The custom ID to match.
     * @param {CommandInteraction<CacheType>} handlerFunction The function to execute when the custom ID matches.
     * @returns {ModularCommand} The command instance for chaining.
     */
    addCustomIDHandler(customId: string, handlerFunction: CommandExecuteFunction): this {
        this.customIdHandlers[customId] = handlerFunction;
        return this;
    }

    /**
     * Creates a new modal for the command.
     * @param {string} modalId The ID for the modal.
     * @returns {ModularModal} The created modal instance.
     */
    addModal(modalId: string): ModularModal {
        const modal = new ModularModal(modalId, this);
        this.modals.set(modalId, modal);
        return modal;
    }

    /**
     * Creates a new button for the command.
     * @param {string} customId The custom ID for the button.
     * @param {ButtonStyle} style The style of the button.
     * @return {ModularButton} The created button instance.
     */
    addButton(customId: string, style: ButtonStyle): ModularButton {
        const button = new ModularButton(customId, style);
        this.buttons.set(customId, button);
        this.buttonsArray.push(button);
        return button;
    }
}

/**
 * Registers an array of modular commands.
 * @param {ModularCommand[]} commands An array of ModularCommand instances.
 * @returns {CommandData[]} An array of command data objects ready for Discord.js client.
 */
const RegisterCommand = (commands: ModularCommand[]): CommandData[] => {
    return commands.map(command => {
        const commandBuilder = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .setDescriptionLocalizations(command.descriptionLocalizations || null);

        COOLDOWNS_MAP.set(command.name, new Map<string, number>());

        const options: Record<string, ApplicationCommandOptionType> = {};

        command.options.forEach(opt => {
            const description =
                typeof opt.description === 'string' ?
                opt.description :
                (opt.description[Locale.EnglishUS] || `The description for ${opt.name} in English.`);
    
            const descriptionsLocalizations = typeof opt.description === 'object' ? opt.description : {};

            if (!description) {
                throw new Error(`Option '${opt.name}' is missing a description.`);
            }

            options[opt.name] = opt.type;

            const optionBuilder = (option: any) => {
                option.setName(opt.name)
                    .setDescription(description)
                    .setRequired(opt.required || false)
                    .setDescriptionLocalizations(descriptionsLocalizations);

                if (opt.choices && opt.choices.length > 0) {
                    option.addChoices(...opt.choices);
                }

                return option;
            };

            switch (opt.type) {
                case ApplicationCommandOptionType.String: commandBuilder.addStringOption(optionBuilder); break;
                case ApplicationCommandOptionType.Boolean: commandBuilder.addBooleanOption(optionBuilder); break;
                case ApplicationCommandOptionType.Integer: commandBuilder.addIntegerOption(optionBuilder); break;
                case ApplicationCommandOptionType.Number: commandBuilder.addNumberOption(optionBuilder); break;
                case ApplicationCommandOptionType.User: commandBuilder.addUserOption(optionBuilder); break;
                case ApplicationCommandOptionType.Channel: commandBuilder.addChannelOption(optionBuilder); break;
                default:
                    throw new Error(`Unsupported option type: ${opt.type}`);
            }
        });

        const executeBuilder = async (interaction: ChatInputCommandInteraction): Promise<void> => {
            // User has permissions
            if (command.permissionCheck && !command.permissionCheck({interaction})) {
                await interaction.reply({
                    content: LOCALE_FORBIDDEN[interaction.locale],
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            // User is using a NSFW command in a non-NSFW channel
            if (command.isNSFW && (!interaction.channel || !('nsfw' in interaction.channel) || !interaction.channel.nsfw)) {
                await interaction.reply({
                    content: LOCALE_NSFW[interaction.locale],
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            // User is in a cooldown
            const lastTime = COOLDOWNS_MAP.get(command.name)?.get(interaction.user.id);
            if (lastTime) {
                const cooldownDuration = (Date.now() / 1000) - lastTime;
                if (cooldownDuration < command.cooldown) {
                    await interaction.reply({
                        content: FormatSecondsLocale(LOCALE_DELAY[interaction.locale], command.cooldown - cooldownDuration),
                        flags: MessageFlags.Ephemeral,
                    });
                    return;
                }
                COOLDOWNS_MAP.get(command.name)?.set(interaction.user.id, Date.now() / 1000);
            }

            const args: Record<string, any> = {};

            for (const option of Object.keys(options)) {
                switch (options[option]) {
                    case ApplicationCommandOptionType.String: args[option] = interaction.options.getString(option, false); break;
                    case ApplicationCommandOptionType.Boolean: args[option] = interaction.options.getBoolean(option, false); break;
                    case ApplicationCommandOptionType.Integer: args[option] = interaction.options.getInteger(option, false); break;
                    case ApplicationCommandOptionType.Number: args[option] = interaction.options.getNumber(option, false); break;
                    case ApplicationCommandOptionType.User: args[option] = interaction.options.getUser(option, false); break;
                    case ApplicationCommandOptionType.Channel: args[option] = interaction.options.getChannel(option, false); break;
                    default:
                        throw new Error(`Unsupported option type: ${options[option]}`);
                }
            }

            const localeTarget = (command.localizationPhrases && command.localizationPhrases[interaction.locale])
                ? interaction.locale
                : Locale.EnglishUS;
            const localeTable = command.localizationPhrases;

            // If the value Locale.EnglishUS doesn't exist, throw an error
            if (!localeTable || !localeTable[Locale.EnglishUS]) {
                throw new Error(`Missing localization for EnglishUS in command ${command.name}`);
            }

            const customId: string = (interaction as any).customId;
            if (customId && command.customIdHandlers[customId]) {
                await command.customIdHandlers[customId]({
                    interaction,
                    args,
                    command,
                    locale: localeTable ? localeTable[localeTarget] : {},
                });
            } else {
                await command.execute({
                    interaction,
                    args,
                    command,
                    locale: localeTable ? localeTable[localeTarget] : {},
                });
            }
        };

        const componentExecuteBuilder = async (interaction: MessageComponentInteraction): Promise<void> => {
            if (!command.componentExecute) return;
            if (!interaction.customId.startsWith(command.getComponentId()!)) return;

            const localeTarget = (command.localizationPhrases && command.localizationPhrases[interaction.locale])
                ? interaction.locale
                : Locale.EnglishUS;
            const localeTable = command.localizationPhrases;

            await command.componentExecute({
                interaction,
                command,
                locale: localeTable ? localeTable[localeTarget] : {},
            });
        };

        const modalExecuteBuilder = async (interaction: ModalSubmitInteraction): Promise<void> => {
            const modalId = interaction.customId;
            const modalObject = command.modals.get(modalId);
            if (!modalObject) return;

            const args: Record<string, string> = {};
            for (const [id] of modalObject.modalInputs.entries()) {
                args[id] = interaction.fields.getTextInputValue(id);
            }

            const localeTarget = (command.localizationPhrases && command.localizationPhrases[interaction.locale])
                ? interaction.locale
                : Locale.EnglishUS;
            const localeTable = command.localizationPhrases;

            // If the value Locale.EnglishUS doesn't exist, throw an error
            if (!localeTable || !localeTable[Locale.EnglishUS]) {
                throw new Error(`Missing localization for EnglishUS in command ${command.name}`);
            }

            await modalObject.execute({
                interaction,
                args,
                command,
                locale: localeTable ? localeTable[localeTarget] : {},
            });
        };

        const buttonExecuteBuilder = async (interaction: ButtonInteraction): Promise<void> => {
            const buttonId = interaction.customId;
            const buttonObject = command.buttons.get(buttonId);
            if (!buttonObject) return;

            const localeTarget = (command.localizationPhrases && command.localizationPhrases[interaction.locale])
                ? interaction.locale
                : Locale.EnglishUS;
            const localeTable = command.localizationPhrases;

            await buttonObject.execute({
                interaction,
                command,
                locale: localeTable ? localeTable[localeTarget] : {},
                message: interaction.message,
            });
        };

        return {
            data: commandBuilder,
            execute: executeBuilder,
            componentExecute: command.componentExecute ? componentExecuteBuilder : undefined,
            modalExecute: command.modals.size > 0 ? modalExecuteBuilder : undefined,
            buttonExecute: command.buttons.size > 0 ? buttonExecuteBuilder : undefined,
            cooldown: command.cooldown,
        };
    });
};

export default ModularCommand;
export {
    RegisterCommand,
    ModularCommand,
    ModularButton,
    CommandData,
};
