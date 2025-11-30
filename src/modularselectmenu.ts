/**
 * @license     MIT
 * @file        src/modularselectmenu.ts
 * @author      vicentefelipechile
 * @description Represents a modular select menu that can be dynamically created and managed.
 */

// =================================================================================================
// Imports
// =================================================================================================

import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { LocaleKey, SelectMenuExecuteFunction } from "./types";
import ModularCommand from "./modularcommand";

// =================================================================================================
// ModularSelectMenu Class
// =================================================================================================

/**
 * @class ModularSelectMenu
 * @description Represents a modular select menu that can be dynamically created and managed.
 */
export default class ModularSelectMenu {
    /** The Discord.js StringSelectMenuBuilder instance. */
    public selectMenuObject: StringSelectMenuBuilder;
    /** The unique custom ID for the select menu, formatted as `${command.name}_${selectMenuId}`. */
    public customId: string;
    /** The base ID for the select menu, used for localization. */
    public selectMenuId: string;
    /** A map to store the option components of the select menu. */
    public options: Map<string, StringSelectMenuOptionBuilder>;
    /** The command instance to which this select menu belongs. */
    public command: ModularCommand;
    /** The function to execute when the select menu is interacted with. */
    public execute: SelectMenuExecuteFunction = async () => { };
    /** Whether the select menu should be interacted by all users. */
    public allowOthers: boolean = false;

    /**
     * @description Creates a new ModularSelectMenu instance.
     * @param {string} selectMenuId The base ID for the select menu.
     * @param {ModularCommand} command The command that this select menu is associated with.
     */
    constructor(selectMenuId: string, command: ModularCommand) {
        if (!selectMenuId || typeof selectMenuId !== "string") {
            throw new Error("Select Menu ID must be a non-empty string.");
        }

        if (!command.name || typeof command.name !== "string") {
            throw new Error("ModularCommand must have a valid name.");
        }

        this.selectMenuId = selectMenuId;
        this.command = command;
        this.customId = `${command.name}_${selectMenuId}`;
        this.selectMenuObject = new StringSelectMenuBuilder().setCustomId(this.customId);
        this.options = new Map();
    }

    /**
     * @description Retrieves the underlying StringSelectMenuBuilder instance.
     * @returns {StringSelectMenuBuilder} The StringSelectMenuBuilder instance.
     */
    getSelectMenu(): StringSelectMenuBuilder {
        return this.selectMenuObject;
    }

    /**
     * @description Retrieves the custom ID of the select menu.
     * @returns {string} The custom ID of the select menu.
     */
    getCustomId(): string {
        return this.customId;
    }

    /**
     * @description Sets the execution function for the select menu's submission event.
     * @param {SelectMenuExecuteFunction} executeFunction The function to run when the select menu is used.
     * @returns {this} The current ModularSelectMenu instance for method chaining.
     */
    setExecute(executeFunction: SelectMenuExecuteFunction): this {
        if (!executeFunction || typeof executeFunction !== "function") {
            throw new Error("Execute function must be a valid function.");
        }

        this.execute = executeFunction;
        return this;
    }

    /**
     * @description Creates a new option for the select menu.
     * The label and description should be set in your localization files.
     * @param {string} value The unique value for this option.
     * @returns {StringSelectMenuOptionBuilder} The created option instance for further configuration (e.g., `setDefault`).
     */
    addOption(value: string): StringSelectMenuOptionBuilder {
        if (!value || typeof value !== "string") {
            throw new Error("Option value must be a non-empty string.");
        }

        const option = new StringSelectMenuOptionBuilder().setValue(value);
        this.options.set(value, option);
        return option;
    }

    /**
     * @description Builds the final select menu object, applying localized placeholder, labels, and descriptions.
     * @param {LocaleKey} locale The localization object containing translated texts.
     * @returns {StringSelectMenuBuilder} The fully constructed select menu object ready to be sent to a user.
     */
    build(locale: LocaleKey): StringSelectMenuBuilder {
        if (!locale || typeof locale !== "object") {
            throw new Error("Locale must be a valid object.");
        }

        const placeholderKey = `${this.command.name}.${this.selectMenuId}.placeholder`;
        if (locale[placeholderKey]) {
            this.selectMenuObject.setPlaceholder(locale[placeholderKey]);
        }

        const builtOptions: StringSelectMenuOptionBuilder[] = [];
        this.options.forEach((optionBuilder, value) => {
            const labelKey = `${this.command.name}.${this.selectMenuId}.${value}.label`;
            const descriptionKey = `${this.command.name}.${this.selectMenuId}.${value}.description`;

            // Set label from locale, fallback to the value if not found
            optionBuilder.setLabel(locale[labelKey] || value);

            if (locale[descriptionKey]) {
                optionBuilder.setDescription(locale[descriptionKey]);
            }
            builtOptions.push(optionBuilder);
        });

        if (builtOptions.length > 0) {
            this.selectMenuObject.setOptions(builtOptions);
        }

        return this.selectMenuObject;
    }

    /**
     * @description Sets whether the select menu should be interacted by all users.
     * @returns {this} The current ModularSelectMenu instance for method chaining.
     */
    setAllowOthers(): this {
        this.allowOthers = true;
        return this;
    }

    /**
     * @description Retrieves the allowOthers property of the select menu.
     * @returns {boolean} The allowOthers property of the select menu.
     */
    setOnlyAuthor(): this {
        this.allowOthers = false;
        return this;
    }
}
