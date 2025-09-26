/**
 * @file Contains the structure and logic for creating modular select menus.
 * @author vicentefelipechile
 * @license MIT
 */

import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { LocaleKey, SelectMenuExecuteFunction } from "./types";
import ModularCommand from "./modularcommand";

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
    public execute: SelectMenuExecuteFunction = async () => {};

    /**
     * @description Creates a new ModularSelectMenu instance.
     * @param {string} selectMenuId The base ID for the select menu.
     * @param {ModularCommand} command The command that this select menu is associated with.
     */
    constructor(selectMenuId: string, command: ModularCommand) {
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
}
