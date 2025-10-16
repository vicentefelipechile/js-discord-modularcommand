/**
 * @license     MIT
 * @file        src/modularmodal.ts
 * @author      vicentefelipechile
 * @description Represents a modular modal that can be dynamically created and managed.
 */

// =================================================================================================
// Imports
// =================================================================================================

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
        if (!modalId || typeof modalId !== "string") {
            throw new Error("Modal ID must be a non-empty string.");
        }

        if (!command.name || typeof command.name !== "string") {
            throw new Error("ModularCommand must have a valid name.");
        }

        this.customId = `${command.name}_${modalId}`;
        this.modalId = modalId;
        this.command = command;
        this.modalObject = new ModalBuilder().setCustomId(this.customId);
        this.modalInputs = new Map();
    }

    /**
     * @description Retrieves the underlying ModalBuilder instance.
     * @returns {ModalBuilder} The ModalBuilder instance.
     */
    getModal(): ModalBuilder {
        return this.modalObject;
    }

    /**
     * @description Retrieves the custom ID of the modal.
     * @returns {string} The custom ID of the modal.
     */
    getCustomId(): string {
        return this.customId;
    }

    /**
     * @description Sets the execution function for the modal's submission event.
     * @param {ModalExecuteFunction} executeFunction The function to run when the modal is submitted.
     * @returns {this} The current ModularModal instance for method chaining.
     */
    setExecute(executeFunction: ModalExecuteFunction): this {
        if (!executeFunction || typeof executeFunction !== "function") {
            throw new Error("Execute function must be a valid function.");
        }

        this.execute = executeFunction;
        return this;
    }

    /**
     * @description Creates a new text input component and adds it to the modal.
     * @param {string} id The custom ID for the text input.
     * @returns {TextInputBuilder} The created text input instance.
     */
    newTextInput(id: string): TextInputBuilder {
        if (!id || typeof id !== "string") {
            throw new Error("Text input ID must be a non-empty string.");
        }

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
        if (!locale || typeof locale !== "object") {
            throw new Error("Locale must be a valid object.");
        }

        const titleKey = `${this.command.name}.${this.modalId}.title`;
        if (!locale[titleKey]) {
            throw new Error(`Missing locale entry for modal title: ${titleKey}`);
        }

        this.modalObject.setTitle(locale[titleKey]);

        this.modalInputs.forEach((input, id) => {
            const labelKey = `${this.command.name}.${id}.label`;
            const placeholderKey = `${this.command.name}.${id}.placeholder`;

            if (!locale[labelKey]) {
                throw new Error(`Missing locale entry for text input label: ${labelKey}`);
            }

            if (!locale[placeholderKey]) {
                throw new Error(`Missing locale entry for text input placeholder: ${placeholderKey}`);
            }

            input.setLabel(locale[labelKey]);
            input.setPlaceholder(locale[placeholderKey]);
        });

        return this.modalObject;
    }
}