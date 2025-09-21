/**
 * Modular Command Example
 * @description This is an example of a modular command using the js-discord-modularcommand library,
 */

const { ModularCommand, RegisterCommand } = require("js-discord-modularcommand");
const { Locale } = require("discord.js");

const pong = new ModularCommand('pong');

pong.setLocalizationPhrases({
    [Locale.EnglishUS]: {
        description: 'Replies with Pong!',
    },
    [Locale.SpanishLATAM]: {
        description: 'Responde con Pong!',
    }
});

pong.setLocalizationDescription({
    [Locale.EnglishUS]: 'Replies with Pong!',
    [Locale.SpanishLATAM]: 'Responde con Pong!',
});

pong.setDescription('Replies with Pong!');

pong.setExecute(async ({ interaction }) => {
    await interaction.reply('Pong!');
});

module.exports = RegisterCommand(pong)