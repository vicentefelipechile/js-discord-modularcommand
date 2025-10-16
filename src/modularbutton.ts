/**
 * @license     MIT
 * @file        src/modularbutton.ts
 * @author      vicentefelipechile
 * @description A class to create and manage reusable button components in a Discord bot using Discord.js.
 */

// =================================================================================================
// Imports
// =================================================================================================

import { ButtonBuilder } from "discord.js";
import { ButtonExecuteFunction, LocaleKey } from "./types";
import ModularCommand from "./modularcommand";

// =================================================================================================
// ModularButton Class
// =================================================================================================

/**
 * @class ModularButton
 * @description A class to create and manage reusable button components.
 */
export default class ModularButton {
    /** The Discord.js ButtonBuilder instance. */
    public buttonObject: ButtonBuilder;
    /** The custom ID for the button, used to identify it in interactions. */
    public customId: string;
    /** The base ID for the button, used for localization. */
    public buttonId: string;
    /** The command instance to which this modal belongs. */
    public command: ModularCommand;
    /** Use other mechanisms to handle button interactions. */
    public execute: ButtonExecuteFunction = async () => { };

    /**
     * @description Creates a new ModularButton instance.
     * @param {string} customId The custom ID for the button. This should be unique within the context of a message.
     */
    constructor(customId: string, command: ModularCommand) {
        if (!customId || typeof customId !== "string") {
            throw new Error("Custom ID must be a non-empty string.");
        }

        if (!command.name || typeof command.name !== "string") {
            throw new Error("ModularCommand must have a valid name.");
        }

        this.buttonObject = new ButtonBuilder()
            .setCustomId(`${command.name}_${customId}`)

        this.command = command;
        this.customId = `${command.name}_${customId}`;
        this.buttonId = customId;
    }

    /**
     * @description Retrieves the underlying ButtonBuilder instance.
     * @returns {ButtonBuilder} The ButtonBuilder instance.
     */
    getButton(): ButtonBuilder {
        return this.buttonObject;
    }

    /**
     * @description Retrieves the custom ID of the button.
     * @returns {string} The custom ID of the button.
     */
    getCustomId(): string {
        return this.customId;
    }

    /**
     * @description Sets the execution function for the button's click event.
     * @param {ButtonExecuteFunction} executeFunction The function to run when the button is interacted with.
     * @returns {this} The current ModularButton instance for method chaining.
     */
    setExecute(executeFunction: ButtonExecuteFunction): this {
        this.execute = executeFunction;
        return this;
    }

    /**
     * @description Builds the button with localized label.
     * @param {LocaleKey} locale The locale object containing localized strings.
     * @returns {ButtonBuilder} The built ButtonBuilder instance with localized label.
     */
    build(locale: LocaleKey): ButtonBuilder {
        if (!locale || typeof locale !== "object") {
            throw new Error("Locale must be a valid object.");
        }

        const labelKey = `${this.command.name}.${this.buttonId}`;
        if (!locale[labelKey]) {
            throw new Error(`Locale key "${labelKey}" not found in the provided locale object.`);
        }

        this.buttonObject.setLabel(locale[labelKey]);

        return this.buttonObject;
    }
}