/**
 * @file Contains the main class for creating modular commands.
 * @author vicentefelipechile
 * @license MIT
 */

// =================================================================================================
// Imports
// =================================================================================================

import {
    LocalizationMap,
    Locale,
} from 'discord.js';

import ModularModal from './modularmodal.js';
import ModularButton from './modularbutton.js';
import { 
    ButtonExecuteFunction, 
    CommandExecuteFunction, 
    CommandOption, 
    ComponentExecuteFunction, 
    ModalExecuteFunction, 
    PermissionCheckFunction,
} from './types.js';

// =================================================================================================
// Class: ModularCommand
// =================================================================================================

/**
 * @description Represents a modular command that can be registered with Discord.js.
 * It allows for dynamic command creation and execution in a simple way.
 * @example
 * const { ModularCommand, RegisterCommand } = require('js-discord-modularcommand');
 *
 * const PingCommand = new ModularCommand('ping');
 * PingCommand.setDescription('Sends a ping message.');
 * PingCommand.setExecute(async ({interaction}) => {
 *   await interaction.reply('Pong!');
 * });
 *
 * PingCommand.setPermissionCheck(({ interaction }) => {
 *   return interaction.member.permissions.has(PermissionFlagsBits.Administrator);
 * });
 *
 * module.exports = RegisterCommand([
 *   PingCommand
 * ]);
 */
export default class ModularCommand {
    // Core Properties
    /** The name of the command, must be unique. */
    public name: string;
    /** The main description of the command. */
    public description: string;
    /** A map of localizations for the command's description. */
    public descriptionLocalizations?: LocalizationMap;
    /** The options (arguments) that the command accepts. */
    public options: CommandOption[];
    /** An object containing localizations for the names and descriptions of the options. */
    public optionsLocalizations: LocalizationMap;

    // Execution Handlers
    /** The main function that executes when the command is invoked. */
    public execute: CommandExecuteFunction;
    /** (Optional) The function to handle button interactions. */
    public buttonExecute?: ButtonExecuteFunction;
    /** (Optional) The function to handle generic component interactions (like select menus). */
    public componentExecute?: ComponentExecuteFunction;
    /** (Optional) The function to handle modal submissions. */
    public modalExecute?: ModalExecuteFunction;
    /** A record of handlers for specific component custom IDs. */
    public customIdHandlers: Record<string, CommandExecuteFunction | ButtonExecuteFunction | ModalExecuteFunction>;

    // Configuration
    /** The command's cooldown time in seconds. */
    public cooldown: number;
    /** Whether the command is marked as Not Safe For Work (NSFW). */
    public isNSFW: boolean;
    /** (Optional) An object with localized phrases to be used within the command's execution. */
    public localizationPhrases?: LocalizationMap;
    /** (Optional) The function that checks if a user has permission to execute the command. */
    public permissionCheck?: PermissionCheckFunction;
    /** (Optional) The base ID for components associated with this command. */
    public componentId?: string;

    // Component Collections
    /** A map of modals associated with this command, keyed by modal ID. */
    public modals: Map<string, ModularModal>;
    /** A map of buttons associated with this command, keyed by the button's custom ID. */
    public buttons: Map<string, ModularButton>;
    /** An array containing all ModularButton instances for easy access. */
    public buttonsArray: ModularButton[];

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
     * @deprecated Use setLocalizationDescription instead.
     * Sets the description localizations for the command.
     * @param {LocalizationMap} localizations The description localizations map.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setLocalizationsDescription(localizations: LocalizationMap): this {
        return this.setLocalizationDescription(localizations);
    }

    /**
     * Sets the description localizations for the command.
     * @param {LocalizationMap} localizations The description localizations map.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setLocalizationDescription(localizations: LocalizationMap): this {
        this.description = localizations[Locale.EnglishUS] || this.description;
        this.descriptionLocalizations = {
            ...this.descriptionLocalizations,
            ...localizations,
        };
        return this;
    }

    /**
     * Sets the localizations for the command's options.
     * @param {LocalizationMap} localizations An object with the localizations.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setLocalizationOptions(localizations: LocalizationMap): this {
        this.optionsLocalizations = {
            ...this.optionsLocalizations,
            ...localizations,
        };
        return this;
    }

    /**
     * Sets the localization phrases for the command.
     * Accepts a partial record, so not all locales need to be provided.
     * @param {LocalizationMap} localizationPhrases The localization phrases.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setLocalizationPhrases(localizationPhrases: LocalizationMap): this {
        this.localizationPhrases = {
            ...this.localizationPhrases,
            ...localizationPhrases,
        };
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
     * Sets the minimum permissions required to execute the command.
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
     * @param {CommandOption} option The option for the command.
     * @returns {ModularCommand} The command instance for chaining.
     */
    addOption(option: CommandOption): this {
        this.options.push(option);
        return this;
    }

    /**
     * Adds a custom ID handler for the command.
     * @param {string} customId The custom ID to match.
     * @param {CommandExecuteFunction | ButtonExecuteFunction | ModalExecuteFunction} handlerFunction The function to execute when the custom ID matches.
     * @returns {ModularCommand} The command instance for chaining.
     */
    addCustomIDHandler(customId: string, handlerFunction: CommandExecuteFunction | ButtonExecuteFunction | ModalExecuteFunction): this {
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
     * @param {ButtonExecuteFunction} execute The function to execute when the button is clicked.
     * @return {ModularButton} The created button instance.
     */
    addButton(customId: string, execute: ButtonExecuteFunction): ModularButton {
        const button = new ModularButton(customId, this);
        button.setExecute(execute);
        this.buttons.set(customId, button);
        this.buttonsArray.push(button);

        return button;
    }
}