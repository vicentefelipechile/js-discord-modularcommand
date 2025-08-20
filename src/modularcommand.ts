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
    ActionRowBuilder,
    TextInputBuilder,
    ButtonBuilder,
    ModalBuilder,
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
    TextInputStyle,
} from 'discord.js';

import { LOCALE_FORBIDDEN, LOCALE_DELAY, LOCALE_ERROR, LOCALE_NSFW } from './locales.js';


/**
 * Types
 */

type ArgType = string | number | boolean | User | Channel | Role | GuildMember;

type ExecuteFunction<T extends ChatInputCommandInteraction | MessageComponentInteraction> = (params: {
    interaction: T;
    args?: Record<string, ArgType>;
    command: ModularCommand;
    locale: Record<string, any>;
}) => Promise<void>;

type ButtonExecuteFunction = (params: {
    interaction: MessageComponentInteraction;
    command: ModularCommand;
    locale: Record<string, any>;
    message: Message;
}) => Promise<void>;

type ModalExecuteFunction = (params: {
    interaction: ModalSubmitInteraction;
    args: Record<string, string>;
    command: ModularCommand;
    locale: Record<string, any>;
}) => Promise<void>;

type PermissionCheckFunction = (params: { interaction: ChatInputCommandInteraction }) => boolean | Promise<boolean>;

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
type RegisteredCommand = {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    componentExecute?: (interaction: MessageComponentInteraction) => Promise<void>;
    modalExecute?: (interaction: ModalSubmitInteraction) => Promise<void>;
    buttonExecute?: (interaction: MessageComponentInteraction) => Promise<void>;
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
 * @class ModularModal
 * @description Represents a modular modal that can be registered with Discord.js.
 * It allows for dynamic modal creation and execution.
 */
class ModularModal {
    public modalObject: ModalBuilder;
    public customId: string;
    public modalId: string;
    public modalInputs: Map<string, TextInputBuilder>;
    public command: ModularCommand;
    public execute: ModalExecuteFunction = async () => { };

    /**
     * Creates a new modal for the command.
     * @param {string} modalId The ID for the modal.
     * @param {ModularCommand} command The command that this modal belongs to.
     */
    constructor(modalId: string, command: ModularCommand) {
        const customModalId = `${command.name}_${modalId}`;

        this.modalObject = new ModalBuilder();
        this.modalObject.setCustomId(customModalId);
        this.customId = customModalId;
        this.modalId = modalId;

        this.modalInputs = new Map();
        this.command = command;
    }

    /**
     * Sets the execute function for the modal.
     * @param {ModalExecuteFunction} executeFunction The function to execute.
     * @returns {ModularModal} The modal instance for chaining.
     */
    setExecute(executeFunction: ModalExecuteFunction): this {
        this.execute = executeFunction;
        return this;
    }

    /**
     * Creates a new text input for the modal.
     * @param {string} id The ID for the text input.
     * @param {TextInputStyle} style The style of the text input.
     * @returns {TextInputBuilder} The created text input instance.
     */
    newTextInput(id: string, style: TextInputStyle): TextInputBuilder {
        const textInput = new TextInputBuilder();
        textInput.setCustomId(id);
        textInput.setStyle(style);
        this.modalInputs.set(id, textInput);

        this.modalObject.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(textInput));
        return textInput;
    }

    /**
     * Builds the modal object.
     * @param {Record<string, any>} locale The localization object for the modal.
     * @return {ModalBuilder} The built modal object.
     */
    build(locale: Record<string, any>): ModalBuilder {
        const selfModal = this.modalObject;
        const commandName = this.command.name;

        selfModal.setTitle(locale[`${commandName}.${this.modalId}.title`]);

        this.modalInputs.forEach((input, id) => {
            input.setLabel(locale[`${commandName}.${id}.label`]);
            input.setPlaceholder(locale[`${commandName}.${id}.placeholder`]);
        });

        return selfModal;
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
    public execute: ExecuteFunction<ChatInputCommandInteraction>;
    public componentExecute?: ExecuteFunction<MessageComponentInteraction>;
    public modalExecute?: ModalExecuteFunction;
    public options: CommandOption[];
    public optionsLocalizations: Record<string, Record<Locale, string>>;
    public customIdHandlers: Record<string, ExecuteFunction<ChatInputCommandInteraction>>;
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
     * @param {ExecuteFunction<CommandInteraction>} executeFunction The function to execute.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setExecute(executeFunction: ExecuteFunction<ChatInputCommandInteraction>): this {
        this.execute = executeFunction;
        return this;
    }

    /**
     * Sets the component execute function for the command.
     * @param {string} componentId The base ID for the components.
     * @param {ExecuteFunction<MessageComponentInteraction>} executeFunction The function to execute for component interactions.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setComponentExecute(componentId: string, executeFunction: ExecuteFunction<MessageComponentInteraction>): this {
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
     * @param {ExecuteFunction<CommandInteraction<CacheType>>} handlerFunction The function to execute when the custom ID matches.
     * @returns {ModularCommand} The command instance for chaining.
     */
    addCustomIDHandler(customId: string, handlerFunction: ExecuteFunction<ChatInputCommandInteraction>): this {
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
 * @returns {RegisteredCommand[]} An array of command data objects ready for Discord.js client.
 */
const RegisterCommand = (commands: ModularCommand[]): RegisteredCommand[] => {
    return commands.map(command => {
        const commandBuilder = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .setDescriptionLocalizations(command.descriptionLocalizations || null);

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
            if (command.permissionCheck && !command.permissionCheck({interaction})) {
                await interaction.reply({
                    content: LOCALE_FORBIDDEN[interaction.locale] || LOCALE_FORBIDDEN[Locale.EnglishUS],
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            if (command.isNSFW && (!interaction.channel || !('nsfw' in interaction.channel) || !interaction.channel.nsfw)) {
                await interaction.reply({
                    content: LOCALE_NSFW[interaction.locale] || LOCALE_NSFW[Locale.EnglishUS],
                    flags: MessageFlags.Ephemeral,
                });
                return;
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

            const customId = (interaction as any).customId;
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

            await modalObject.execute({
                interaction,
                args,
                command,
                locale: localeTable ? localeTable[localeTarget] : {},
            });
        };

        const buttonExecuteBuilder = async (interaction: MessageComponentInteraction): Promise<void> => {
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
    ModularModal,
    LOCALE_FORBIDDEN,
    LOCALE_DELAY,
    LOCALE_NSFW,
    LOCALE_ERROR,
};
