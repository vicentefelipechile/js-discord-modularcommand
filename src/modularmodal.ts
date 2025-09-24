/**
 * @file Contains the structure and logic for creating modular modals.
 * @author vicentefelipechile
 * @license MIT
 */

import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from "discord.js";
import { LocaleKey, ModalExecuteFunction } from "./types";
import ModularCommand from "./modularcommand";

// =================================================================================================
// Main Class
// =================================================================================================

/**
 * @class ModularModal
 * @description Represents a modular modal that can be dynamically created and managed.
 */
export default class ModularModal {
    /** The Discord.js ModalBuilder instance. */
    public modalObject: ModalBuilder;
    /** The unique custom ID for the modal, formatted as `${command.name}_${modalId}`. */
    public customId: string;
    /** The base ID for the modal, used for localization. */
    public modalId: string;
    /** A map to store the text input components of the modal. */
    public modalInputs: Map<string, TextInputBuilder>;
    /** The command instance to which this modal belongs. */
    public command: ModularCommand;
    /** The function to execute when the modal is submitted. */
    public execute: ModalExecuteFunction = async () => { };

    /**
     * @description Creates a new ModularModal instance.
     * @param {string} modalId The base ID for the modal.
     * @param {ModularCommand} command The command that this modal is associated with.
     */
    constructor(modalId: string, command: ModularCommand) {
        this.customId = `${command.name}_${modalId}`;
        this.modalId = modalId;
        this.command = command;
        this.modalObject = new ModalBuilder().setCustomId(this.customId);
        this.modalInputs = new Map();
    }

    /**
     * @description Sets the execution function for the modal's submission event.
     * @param {ModalExecuteFunction} executeFunction The function to run when the modal is submitted.
     * @returns {this} The current ModularModal instance for method chaining.
     */
    setExecute(executeFunction: ModalExecuteFunction): this {
        this.execute = executeFunction;
        return this;
    }

    /**
     * @description Creates a new text input component and adds it to the modal.
     * @param {string} id The custom ID for the text input.
     * @returns {TextInputBuilder} The created text input instance.
     */
    newTextInput(id: string): TextInputBuilder {
        const textInput = new TextInputBuilder()
            .setCustomId(id);

        this.modalInputs.set(id, textInput);

        const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(textInput);
        this.modalObject.addComponents(actionRow);

        return textInput;
    }

    /**
     * @description Builds the final modal object, applying localized titles and labels.
     * @param {LocaleKey} locale The localization object containing translated texts.
     * @returns {ModalBuilder} The fully constructed modal object ready to be sent to a user.
     */
    build(locale: LocaleKey): ModalBuilder {
        this.modalObject.setTitle(locale[`${this.command.name}.${this.modalId}.title`]);

        this.modalInputs.forEach((input, id) => {
            const labelKey = `${this.command.name}.${id}.label`;
            const placeholderKey = `${this.command.name}.${id}.placeholder`;

            if (locale[labelKey]) {
                input.setLabel(locale[labelKey]);
            }
            if (locale[placeholderKey]) {
                input.setPlaceholder(locale[placeholderKey]);
            }
        });

        return this.modalObject;
    }
}