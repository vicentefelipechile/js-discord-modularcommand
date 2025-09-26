/**
 * @file        selectmenu.js
 * @author      vicentefelipechile
 * @version     1.1.0
 * @license     MIT
 * @description Example of a modular command that sends an interactive select menu.
 * This script demonstrates how to create a command that replies with a select menu,
 * handle the selection, and use localization for all its text components.
 */

// -----------------------------------------------------------------------------
// IMPORTS SECTION
// -----------------------------------------------------------------------------

// Import necessary classes and builders.
const { ActionRowBuilder } = require("@discordjs/builders");
const { Locale, MessageFlags } = require("discord.js");
// Assuming ModularCommand and RegisterCommand are in a local library path
// For a published package, it would be: require("js-discord-modularcommand");
const { ModularCommand, RegisterCommand } = require("../index.js"); // Adjust this path if necessary

// -----------------------------------------------------------------------------
// COMMAND INITIALIZATION
// -----------------------------------------------------------------------------

// Create a new instance of ModularCommand for the 'selectmenu' command.
const selectMenuCommand = new ModularCommand('selectmenu');

// -----------------------------------------------------------------------------
// MAIN COMMAND CONFIGURATION
// -----------------------------------------------------------------------------

// Set the default description for the command.
selectMenuCommand.setDescription('Sends a select menu!');

// -----------------------------------------------------------------------------
// LOCALIZATION CONFIGURATION
// -----------------------------------------------------------------------------

// Set localized descriptions for the command itself.
selectMenuCommand.setLocalizationDescription({
    [Locale.EnglishUS]: 'Test select menu',
    [Locale.SpanishLATAM]: 'Menú de selección de prueba',
});

// Define a dictionary of phrases for all text.
// The library uses a specific key structure to automatically populate the fields:
// • Placeholder: 'COMMAND_NAME.SELECT_MENU_ID.placeholder'
// • Option Label: 'COMMAND_NAME.SELECT_MENU_ID.OPTION_VALUE.label'
// • Option Description: 'COMMAND_NAME.SELECT_MENU_ID.OPTION_VALUE.description'
selectMenuCommand.setLocalizationPhrases({
    [Locale.EnglishUS]: {
        'reply.content': 'Choose your favorite starter Pokémon:',
        'reply.selection': 'Excellent choice! You selected {selection}.',
        'starter.placeholder': 'Make a selection!',
        'starter.bulbasaur.label': 'Bulbasaur',
        'starter.bulbasaur.description': 'The dual-type Grass/Poison Seed Pokémon.',
        'starter.charmander.label': 'Charmander',
        'starter.charmander.description': 'The Fire-type Lizard Pokémon.',
        'starter.squirtle.label': 'Squirtle',
        'starter.squirtle.description': 'The Water-type Tiny Turtle Pokémon.',
    },
    [Locale.SpanishLATAM]: {
        'reply.content': 'Elige tu Pokémon inicial favorito:',
        'reply.selection': '¡Excelente elección! Seleccionaste a {selection}.',
        'starter.placeholder': '¡Haz una selección!',
        'starter.bulbasaur.label': 'Bulbasaur',
        'starter.bulbasaur.description': 'El Pokémon Semilla de tipo dual Planta/Veneno.',
        'starter.charmander.label': 'Charmander',
        'starter.charmander.description': 'El Pokémon Lagartija de tipo Fuego.',
        'starter.squirtle.label': 'Squirtle',
        'starter.squirtle.description': 'El Pokémon Tortuguita de tipo Agua.',
    }
});

// -----------------------------------------------------------------------------
// SELECT MENU DEFINITION & HANDLER
// -----------------------------------------------------------------------------

// Create a new select menu instance with the ID 'starter'.
const starterSelect = selectMenuCommand.addSelectMenu('starter'); // 'starter' is the custom ID

// Add the options. The value is used to identify the option internally and in the locale keys.
starterSelect.addOption('bulbasaur');
starterSelect.addOption('charmander');
starterSelect.addOption('squirtle');

// Set the function to execute when a user interacts with this select menu.
// The 'selected' parameter now directly gives you the chosen option's value.
starterSelect.setExecute(async ({ interaction, selected, locale }) => {
    // Get the corresponding localized label for the selected value.
    const selectedLabel = locale[`starter.${selected}.label`];

    // Update the original message to show the user's choice and remove the menu.
    await interaction.update({
        content: locale['reply.selection'].replace('{selection}', selectedLabel),
        components: [] // Pass an empty array to remove the select menu
    });
});

// -----------------------------------------------------------------------------
// EXECUTION LOGIC
// -----------------------------------------------------------------------------

// This function runs when the initial '/selectmenu' command is executed.
// Its purpose is to build and send the message containing the select menu.
selectMenuCommand.setExecute(async ({ interaction, locale }) => {
    // An ActionRow is a container for components like select menus.
    const row = new ActionRowBuilder();

    // The .build(locale) method assembles the select menu with all its options,
    // automatically populating the placeholder, labels, and descriptions
    // from the provided locale phrases.
    const menu = starterSelect.build(locale);
    row.addComponents(menu);

    // Reply to the command interaction with the localized content and the action row.
    await interaction.reply({
        content: locale['reply.content'],
        components: [row],
        flags: MessageFlags.Ephemeral
    });
});

// -----------------------------------------------------------------------------
// COMMAND EXPORT
// -----------------------------------------------------------------------------

// Wrap and export the command to be loaded by the handler.
module.exports = RegisterCommand(selectMenuCommand);

