/**
 * @module ModularCommand
 * @description A module for creating and managing modular commands in a easy way for me.
 * @license MIT
 */

/**
 * Imports
 */

import {
    ApplicationCommandOptionType as OptionType,
    LocalizationMap,
    ButtonStyle,
    Locale,
} from 'discord.js';

import ModularModal from './modularmodal.js';
import ModularButton from './modularbutton.js';
import { ButtonExecuteFunction, CommandExecuteFunction, CommandOption, ComponentExecuteFunction, ModalExecuteFunction, PermissionCheckFunction } from './types.js';




/**
 * Interface
 */

/**
 * @description Represents a command option for a modular command.
 */


/**
 * Variables
 */

const ALLOWED_OPTION_TYPE = [
    OptionType.String,
    OptionType.Boolean,
    OptionType.Integer,
    OptionType.Number,
    OptionType.User,
    OptionType.Channel,
];



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
export default class ModularCommand {
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
    public localizationPhrases?: Record<Locale, string>;
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
     * @param {Record<Locale, string>} localizationPhrases The localization phrases.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setLocalizationPhrases(localizationPhrases: Record<Locale, string>): this {
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