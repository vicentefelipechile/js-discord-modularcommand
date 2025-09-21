/**
 * @file Contains the logic for handling Discord bot interactions.
 * @author vicentefelipechile
 * @license MIT
 */

import { BaseInteraction, Collection, CommandInteraction, MessageComponentInteraction, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { LOCALE_ERROR } from "./locales";
import { ClientWithCommands } from "./types";

// =================================================================================================
// Interfaces and Types
// =================================================================================================

/**
 * @interface InteractionHandlerArgs
 * @description Defines the arguments for the custom interaction handler function.
 */
interface InteractionHandlerArgs {
    /** The interaction received from Discord. */
    interaction: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction;
}

/**
 * @type InteractionHandler
 * @description A function signature for a custom interaction handler.
 * @returns {Promise<boolean | undefined>} A promise that resolves to `false` to stop the default handler, or `true`/`undefined` to continue.
 */
type InteractionHandler = (args: InteractionHandlerArgs) => Promise<boolean | undefined>;

// =================================================================================================
// Main Handler Function
// =================================================================================================

/**
 * @description Creates a modular command handler function for the Discord client.
 * @param {ClientWithCommands} client The Discord client instance with a commands collection.
 * @param {InteractionHandler} customHandler A custom function to handle interactions before the default logic.
 * @returns {(interaction: BaseInteraction) = Promise<void>} The main interaction handler function.
 */

export default function ModularCommandHandler(client: ClientWithCommands, customHandler: InteractionHandler): (interaction: BaseInteraction) => Promise<void> {
    if (!client.commands) {
        throw new Error(`Client is missing the 'commands' collection.`);
    }
    if (!(client.commands instanceof Collection)) {
        throw new Error(`Client.commands is not an instance of Discord.js Collection.`);
    }

    const handler = async (interaction: BaseInteraction): Promise<void> => {
        if (!interaction.isChatInputCommand() && !interaction.isMessageComponent() && !interaction.isModalSubmit()) {
            return;
        }

        if (typeof customHandler === "function") {
            const response = await customHandler({ interaction });
            if (response === false) return;
        }

        let commandName: string;
        if (interaction.isChatInputCommand()) {
            commandName = interaction.commandName;
        } else if (interaction.customId) {
            commandName = interaction.customId.split('_')[0];
        } else {
            const errorMessage = LOCALE_ERROR[interaction.locale];
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: errorMessage, flags: MessageFlags.Ephemeral });
            }
            console.error(`Interaction does not have a commandName or customId: ${interaction.id}`);
            return;
        }

        const command = client.commands.get(commandName);
        if (command === undefined) {
            console.error(`No command found for interaction: ${interaction.id} with command name: ${commandName}`);
            return;
        }

        try {
            if (interaction.isChatInputCommand()) {
                await command.execute(interaction);
            } else if (interaction.isButton() && command.buttonExecute) {
                await command.buttonExecute(interaction);
            } else if (interaction.isMessageComponent() && command.componentExecute) {
                await command.componentExecute(interaction);
            } else if (interaction.isModalSubmit() && command.modalExecute) {
                await command.modalExecute(interaction);
            }
        } catch (error) {
            const errorMessage = LOCALE_ERROR[interaction.locale];
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: errorMessage, flags: MessageFlags.Ephemeral });
            }
            console.error(`Error handling interaction: ${interaction.id}`, error);
        }
    };

    return handler;
}