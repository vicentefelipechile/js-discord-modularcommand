/**
 * @license     MIT
 * @version     2.5.2
 * @file        example/command.js
 * @author      vicentefelipechile
 * @description Example of a 'pong' modular command.
 * This script demonstrates how to create a simple command, set its description,
 * add localizations for different languages, and define its execution logic
 * using the js-discord-modularcommand library.
 */

// =================================================================================================
// IMPORTS SECTION
// =================================================================================================

// Import the necessary classes from the corresponding libraries.
// - ModularCommand: The base class to create our command.
// - RegisterCommand: A helper function to prepare and export the command.
// - Locale: An enum from discord.js to specify languages in a standardized way.
const { ModularCommand, RegisterCommand } = require("js-discord-modularcommand");
const { Locale } = require("discord.js");

// =================================================================================================
// COMMAND INITIALIZATION
// =================================================================================================

// Create a new instance of ModularCommand.
// The string 'pong' is the name the command will have on Discord.
const pong = new ModularCommand('pong');

// =================================================================================================
// MAIN COMMAND CONFIGURATION
// =================================================================================================

// setDescription sets the default description for the command.
// This will be used if the user's Discord client language does not match
// any of the localizations defined below.
pong.setDescription('Replies with Pong!');

// =================================================================================================
// LOCALIZATION CONFIGURATION (INTERNATIONALIZATION)
// =================================================================================================

// setLocalizationPhrases is used to define a set of phrases
// in different languages, useful for more complex responses or menus.
// In this simple example, its use is for demonstration purposes.
pong.setLocalizationPhrases({
    [Locale.EnglishUS]: {
        description: 'Replies with Pong!',
    },
    [Locale.SpanishLATAM]: {
        description: 'Responde con Pong!',
    }
});

// setLocalizationDescription allows defining the command's description
// for different languages. Discord will display the description in the
// user's client language if a match is found.
pong.setLocalizationDescription({
    [Locale.EnglishUS]: 'Replies with Pong!',       // Description in US English.
    [Locale.SpanishLATAM]: 'Responde con Pong!', // Description in Latin American Spanish.
});

// =================================================================================================
// EXECUTION LOGIC
// =================================================================================================

// setExecute defines the function that will run when a user uses the command.
// It receives an object with the 'interaction' property, which contains all
// the information from the Discord command interaction.
pong.setExecute(async ({ interaction }) => {
    // We use interaction.reply() to send a response to the channel.
    // It's a good practice to use 'await' to ensure the reply is sent
    // before the function finishes.
    await interaction.reply('Pong!');
});

// =================================================================================================
// COMMAND EXPORT
// =================================================================================================

// Finally, we wrap our command instance with the RegisterCommand function.
// This prepares and standardizes it to be read and loaded by the main command handler.
module.exports = RegisterCommand(pong);