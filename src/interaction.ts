/**
 * @module Interaction
 * @description Function to handle interactions with the bot.
 * @license MIT
 */

/**
 * Imports
 */

import { BaseInteraction, Client, Collection, CommandInteraction, MessageComponentInteraction, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { LOCALE_ERROR } from "./locales";
import { CommandData } from "./modularcommand";

/**
 * Variables
 */

interface InteractionHandlerArgs {
    interaction: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction;
}

type InteractionHandler = (args: InteractionHandlerArgs) => Promise<boolean | undefined>;
type ClientArg = Client & { commands: Collection<string, any> };

/**
 * @param {Client} client
 * @param {Function} customHandler
 * @returns {Function} - A function that handles the interaction.
 */
function ModularCommandHandler(client: ClientArg, customHandler: InteractionHandler): (interaction: BaseInteraction) => Promise<void> {
    // Check if client has commands collection
    if (!client.commands) throw new Error(`Client is missing commands collection`);
    if (!(client.commands instanceof Collection)) throw new Error(`Client.commands is not a Collection`);

    // Define the handler function
    const handler = async (interaction: BaseInteraction) => {
        if (!interaction.isChatInputCommand() && !interaction.isMessageComponent() && !interaction.isModalSubmit()) return;

        const response = await customHandler({ interaction: interaction as CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction });
        if (response === false) return;

        // Continue with the default interaction handling
        let commandName: string;
        if (interaction.isChatInputCommand()) {
            commandName = interaction.commandName;
        } else if (interaction.customId !== undefined) {
            commandName = interaction.customId.split('_')[0];
        } else {
            const errorMessage = LOCALE_ERROR[interaction.locale];
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: errorMessage,
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.reply({
                    content: errorMessage,
                    flags: MessageFlags.Ephemeral
                });
            }

            throw new Error(`Interaction does not have a commandName or customId: ${interaction.id}`);
        }

        const command: CommandData = client.commands.get(commandName);
        if (!command) throw new Error(`No command found for interaction: ${interaction.id} with command name: ${commandName}`);

        try {
            if (interaction.isChatInputCommand()) await command.execute(interaction);
            else if (interaction.isButton() && command.buttonExecute) await command.buttonExecute(interaction);
            else if (interaction.isMessageComponent() && command.componentExecute) await command.componentExecute(interaction);
            else if (interaction.isModalSubmit() && command.modalExecute) await command.modalExecute(interaction);
        } catch (error) {
            const errorMessage = LOCALE_ERROR[interaction.locale];
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: errorMessage,
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.reply({
                    content: errorMessage,
                    flags: MessageFlags.Ephemeral
                });
            }

            console.error(`Error handling interaction: ${interaction.id}`, error);
        }
    };

    // Return the handler function
    return handler;
}

export default ModularCommandHandler;