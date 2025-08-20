/**
 * @module ModularModal
 * @description A module for creating and managing modals in a easy way for me.
 * @license MIT
 */

/**
 * Imports
 */

import { ActionRowBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { ModularCommand } from "./modularcommand";

/**
 * Types
 */

type ModalExecuteFunction = (params: {
    interaction: ModalSubmitInteraction;
    args: Record<string, string>;
    command: ModularCommand;
    locale: Record<string, any>;
}) => Promise<void>;


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
     * Returns the modal custom ID.
     * @returns {string} The modal custom ID.
     */
    getCustomId(): string {
        return this.customId;
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
 * Exports
 */

export default ModularModal;
