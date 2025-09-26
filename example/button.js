/**
 * @file        button.js
 * @author      vicentefelipechile
 * @version     2.4.0
 * @license     MIT
 * @description Example of a modular command that sends interactive buttons.
 * This script demonstrates how to create a command that replies with buttons,
 * handle button clicks, and use localization for button labels and responses.
 */

// -----------------------------------------------------------------------------
// IMPORTS SECTION
// -----------------------------------------------------------------------------

// Import necessary classes and builders.
const { ActionRowBuilder } = require("@discordjs/builders");
const { ButtonStyle, Locale } = require("discord.js");
const { ModularCommand, RegisterCommand } = require("js-discord-modularcommand");

// -----------------------------------------------------------------------------
// COMMAND INITIALIZATION
// -----------------------------------------------------------------------------

// Create a new instance of ModularCommand for the 'buttoncommand' command.
const buttonCommand = new ModularCommand('buttoncommand');

// -----------------------------------------------------------------------------
// MAIN COMMAND CONFIGURATION
// -----------------------------------------------------------------------------

// Set the default description for the command.
buttonCommand.setDescription('Sends a button!');

// -----------------------------------------------------------------------------
// LOCALIZATION CONFIGURATION
// -----------------------------------------------------------------------------

// Set localized descriptions for the command itself.
buttonCommand.setLocalizationDescription({
    [Locale.EnglishUS]: 'Test button',
    [Locale.SpanishLATAM]: 'Botón de prueba',
});

// Define a dictionary of phrases for all text content.
// This includes the command reply, button responses, and button labels.
// Using a consistent naming convention like 'component.name.property' is a good practice.
buttonCommand.setLocalizationPhrases({
    [Locale.EnglishUS]: {
        'description': 'Sends a button!',
        'reply.message': 'You clicked the button!',
        'reply.secondmessage': 'You clicked the second button!',
        'buttoncommand.clickme': 'Click me',
        'buttoncommand.anotherbutton': 'Another Button',
    },
    [Locale.SpanishLATAM]: {
        'description': '¡Envía un botón!',
        'reply.message': '¡Has hecho clic en el botón!',
        'reply.secondmessage': '¡Has hecho clic en el segundo botón!',
        'buttoncommand.clickme': 'Haz clic en mí',
        'buttoncommand.anotherbutton': 'Otro botón',
    }
});

// -----------------------------------------------------------------------------
// BUTTON HANDLERS
// -----------------------------------------------------------------------------

// Register a handler for the first button with the custom ID 'clickme'.
// The callback function will be executed when a user clicks this button.
const button1 = buttonCommand.addButton('clickme', async ({ interaction, locale }) => {
    // Reply to the button interaction with a localized message.
    await interaction.reply({
        content: locale['reply.message'],
    });
});

// Register a handler for the second button with the custom ID 'anotherbutton'.
const button2 = buttonCommand.addButton('anotherbutton', async ({ interaction, locale }) => {
    await interaction.reply({
        content: locale['reply.secondmessage'],
    });
});

// Customize the appearance of the buttons.
// .getButton() returns the underlying Discord.js ButtonBuilder instance.
button1.getButton().setStyle(ButtonStyle.Primary);
button2.getButton().setStyle(ButtonStyle.Success);

// -----------------------------------------------------------------------------
// EXECUTION LOGIC
// -----------------------------------------------------------------------------

// This function runs when the initial '/button' command is executed.
buttonCommand.setExecute(async ({ interaction, locale }) => {
    // An ActionRow is a container for components like buttons.
    const row = new ActionRowBuilder();

    // The .build(locale) method creates the Discord.js button component.
    // It automatically sets the customId to 'clickme' and uses the locale
    // to find the appropriate label from the localization phrases (e.g., 'button.clickme.label').
    row.addComponents(button1.build(locale));
    row.addComponents(button2.build(locale));

    // Reply to the command interaction, including the action row with the buttons.
    await interaction.reply({
        content: locale['description'],
        components: [row]
    });
});

// -----------------------------------------------------------------------------
// COMMAND EXPORT
// -----------------------------------------------------------------------------

// Wrap and export the command to be loaded by the handler.
module.exports = RegisterCommand(buttonCommand);