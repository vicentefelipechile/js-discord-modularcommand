/**
 * @file Contains the structure for creating reusable button components.
 * @author vicentefelipechile
 * @license MIT
 */

import { ButtonBuilder, ButtonStyle } from "discord.js";
import { ButtonExecuteFunction } from "./types";

// =================================================================================================
// Main Class
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
    /** The visual style of the button. */
    public style: ButtonStyle;
    /** Use other mechanisms to handle button interactions. */
    public execute: ButtonExecuteFunction = async () => { };

    /**
     * @description Creates a new ModularButton instance.
     * @param {string} customId The custom ID for the button. This should be unique within the context of a message.
     */
    constructor(customId: string) {
        this.buttonObject = new ButtonBuilder()
            .setCustomId(customId)

        this.customId = customId;
        this.style = ButtonStyle.Primary;
    }

    /**
     * @deprecated This method is deprecated and will be removed in future versions.
     * Use other mechanisms to handle button interactions.
     * @description Sets the execution function for the button's click event.
     * @param {ButtonExecuteFunction} executeFunction The function to run when the button is interacted with.
     * @returns {this} The current ModularButton instance for method chaining.
     */
    setExecute(executeFunction: ButtonExecuteFunction): this {
        this.execute = executeFunction;
        return this;
    }
}