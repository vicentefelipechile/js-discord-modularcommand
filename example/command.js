/**
 * Modular Command Example
 * @description This is an example of a modular command using the js-discord-modularcommand library,
 * @license MIT
 */

/**
 * Imports
 */

const { Locale } = require('discord.js');
const { ModularCommand, RegisterCommand } = require('../src/index');


/**
 * Localization
 */

const LOCALIZATION = {
    [Locale.EnglishUS]: {
        'description': 'Replies with Pong!',
        'reply': 'Pong!',
    },
    [Locale.SpanishLATAM]: {
        'description': 'Responde con Pong!',
        'reply': '¡Pong!',
    },
}


/**
 * Command
 */

const command = new ModularCommand('pong');

command.setDescription(LOCALIZATION[Locale.EnglishUS]['description']);

command.setExecute(async ({ interaction, locale }) => {
    await interaction.reply({
        content: locale['reply'],
    });
});

/**
 * Export
 */

module.exports = RegisterCommand([command]);