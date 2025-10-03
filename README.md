# Discord.js Modular Command

[![npm version](https://img.shields.io/npm/v/js-discord-modularcommand.svg?style=flat-square)](https://www.npmjs.com/package/js-discord-modularcommand)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A powerful and elegant library for creating modular, feature-rich slash commands for your [Discord.js](https://discord.js.org/) bot.

`js-discord-modularcommand` simplifies command management by providing a clean, chainable structure for defining commands, handling interactions, and managing localizations. Move away from boilerplate code and focus on what truly matters: your bot's logic.

## Features

-   **Modular by Design:** Structure each command in its own file for a clean and scalable project architecture.
-   **Effortless Localization:** Built-in support for multiple languages for command descriptions, options, and in-command responses.
-   **Interactive Components Made Easy:** Fluent builders for creating and managing Buttons, Modals, and Select Menus with their own handlers, all within the command's context.
-   **Chainable Configuration:** Use a fluent, chainable API to configure every aspect of your command, from descriptions and options to permissions and cooldowns.
-   **Simplified Handlers:** The library abstracts away the complexity of handling different interaction types. You just provide the logic.

## Installation

Install the package using npm or your favorite package manager:

```sh
npm install js-discord-modularcommand
```

## Getting Started

The core of the library is the `ModularCommand` class. You create an instance of it for each command and chain methods to configure it.

Here is a basic example of a `ping` command:

```javascript
// filepath: /commands/ping.js
const { ModularCommand, RegisterCommand } = require('js-discord-modularcommand');
const { Locale } = require('discord.js');

// 1. Create a new command instance
const pingCommand = new ModularCommand('ping');

// 2. Configure the command using chainable methods
pingCommand.setDescription('Replies with Pong!')

// Optional: Set a 5-second cooldown
pingCommand.setCooldown(5)

// Optional: Add localized descriptions for the command itself
pingCommand.setLocalizationDescription({
    [Locale.EnglishUS]: 'Replies with Pong!',
    [Locale.SpanishLATAM]: '¡Responde con Pong!',
})

// Optional: Define response phrases for different languages
pingCommand.setLocalizationPhrases({
    [Locale.EnglishUS]: {
        'pong_reply': 'Pong! 🏓',
    },
    [Locale.SpanishLATAM]: {
        'pong_reply': '¡Pong! 🏓',
    }
})

// 3. Define the execution logic
// The 'locale' object contains the phrases for the user's language
pingCommand.setExecute(async ({ interaction, locale }) => {
    await interaction.reply({
        content: locale['pong_reply']
    });
});

// 4. Export the command for the handler
module.exports = RegisterCommand(pingCommand);
```

## Advanced Usage: Interactive Components

Easily add interactive components to your commands.

### Buttons

Create buttons and attach specific logic to each one.

```javascript
// filepath: /commands/vote.js
const { ModularCommand, RegisterCommand } = require('js-discord-modularcommand');
const { ButtonStyle, Locale, MessageFlags } = require('discord.js');
const { ActionRowBuilder } = require('@discordjs/builders');

const voteCommand = new ModularCommand('votecommand');

voteCommand.setDescription('Starts a simple poll.');

voteCommand.setLocalizationPhrases({
    [Locale.EnglishUS]: {
        'poll_question': 'What is your favorite color?',
        'votecommand.yes': 'Green',
        'votecommand.no': 'Blue',
        'reply.yes': 'You voted for Green!',
        'reply.no': 'You voted for Blue!',
    },
    [Locale.SpanishLATAM]: {
        'poll_question': '¿Cuál es tu color favorito?',
        'votecommand.yes': 'Verde',
        'votecommand.no': 'Azul',
        'reply.yes': '¡Has votado por el Verde!',
        'reply.no': '¡Has votado por el Azul!',
    }
});

// Create and handle the "Yes" button
const yesButton = voteCommand.addButton('yes', async ({ interaction, locale }) => {
    await interaction.reply({
        content: locale['reply.yes'],
        flags: MessageFlags.Ephemeral
    });
});

// Create and handle the "No" button
const noButton = voteCommand.addButton('no', async ({ interaction, locale }) => {
    await interaction.reply({
        content: locale['reply.no'],
        flags: MessageFlags.Ephemeral
    });
});

// Customize the underlying discord.js button
yesButton.getButton().setStyle(ButtonStyle.Success);
noButton.getButton().setStyle(ButtonStyle.Primary);

// Main command execution: sends the message with the buttons
voteCommand.setExecute(async ({ interaction, locale }) => {
    const row = new ActionRowBuilder();

    row.addComponents(
        yesButton.build(locale), // .build(locale) applies the correct localization
        noButton.build(locale)
    );

    await interaction.reply({
        content: locale['poll_question'],
        components: [row]
    });
});

module.exports = RegisterCommand(voteCommand);
```

### Select Menus

Build and handle string select menus seamlessly.

```javascript
// filepath: /commands/starter.js
const { ModularCommand, RegisterCommand } = require('js-discord-modularcommand');
const { ActionRowBuilder } = require('@discordjs/builders');
const { Locale, MessageFlags } = require('discord.js');

const starterCommand = new ModularCommand('starter');

starterCommand.setDescription('Choose your starter Pokémon.')
    
starterCommand.setLocalizationPhrases({
    [Locale.EnglishUS]: {
        'select_prompt': 'Please select your starter:',
        'menuselection.placeholder': 'Make a selection!',
        'menuselection.bulbasaur.label': 'Bulbasaur',
        'menuselection.bulbasaur.description': 'The Seed Pokémon.',
        'menuselection.charmander.label': 'Charmander',
        'menuselection.charmander.description': 'The Lizard Pokémon.',
        'menuselection.squirtle.label': 'Squirtle',
        'menuselection.squirtle.description': 'The Tiny Turtle Pokémon.',
        'response': 'You chose {selection}!',
    },
    [Locale.SpanishLATAM]: {
        'select_prompt': 'Por favor, elige tu inicial:',
        'menuselection.placeholder': '¡Haz una selección!',
        'menuselection.bulbasaur.label': 'Bulbasaur',
        'menuselection.bulbasaur.description': 'El Pokémon Semilla.',
        'menuselection.charmander.label': 'Charmander',
        'menuselection.charmander.description': 'El Pokémon Lagartija.',
        'menuselection.squirtle.label': 'Squirtle',
        'menuselection.squirtle.description': 'El Pokémon Agua.',
        'response': '¡Elegiste a {selection}!',
    }
});

const starterMenu = starterCommand.addSelectMenu('menuselection');

// Value must match the key in localization phrases
starterMenu.addOption('bulbasaur')
starterMenu.addOption('charmander')
starterMenu.addOption('squirtle')

starterMenu.setExecute(async ({ interaction, selected, locale }) => {
    // 'selected' directly gives you the value of the chosen option
    const selectionLabel = locale[`menuselection.${selected}.label`];
    await interaction.update({
        content: locale['response'].replace('{selection}', selectionLabel),
        components: [] // Remove menu after selection
    });
});

starterCommand.setExecute(async ({ interaction, locale }) => {
    const row = new ActionRowBuilder()
    row.addComponents(starterMenu.build(locale));

    await interaction.reply({
        content: locale['select_prompt'],
        components: [row],
        flags: MessageFlags.Ephemeral
    });
});

module.exports = RegisterCommand(starterCommand);
```

### Modals (Pop-up Forms)

Display pop-up forms to collect detailed user input.

```javascript
// filepath: /commands/feedback.js
const { ModularCommand, RegisterCommand } = require('js-discord-modularcommand');
const { TextInputStyle, Locale, MessageFlags } = require('discord.js');

const feedbackCommand = new ModularCommand('feedback');

feedbackCommand.setDescription('Submit feedback about the bot.')

feedbackCommand.setLocalizationPhrases({
    [Locale.EnglishUS]: {
        'form.title': 'Feedback Form',
        'form.subject.label': 'Subject',
        'form.subject.placeholder': 'e.g., Feature Request',
        'form.message.label': 'Message',
        'form.message.placeholder': 'Your detailed feedback here...',
        'success_reply': 'Thank you for your feedback!',
    },
    [Locale.SpanishLATAM]: {
        'form.title': 'Formulario de Comentarios',
        'form.subject.label': 'Asunto',
        'form.subject.placeholder': 'Ej: Solicitud de función',
        'form.message.label': 'Mensaje',
        'form.message.placeholder': 'Tus comentarios detallados aquí...',
        'success_reply': '¡Gracias por tus comentarios!',
    }
});

const feedbackModal = feedbackCommand.addModal('form');

// Define text inputs
const subjectInput = feedbackModal.newTextInput('subject')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .data
    .custom_id;

const messageInput = feedbackModal.newTextInput('message')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .data
    .custom_id;

// This function runs when the user submits the modal
feedbackModal.setExecute(async ({ interaction, args, locale }) => {
    const subject = args[subjectInput];
    const message = args[messageInput];

    // Process the data
    console.log(`New Feedback: ${subject} - ${message}`);
    await interaction.reply({
        content: locale['success_reply'],
        flags: MessageFlags.Ephemeral
    });
});

// This function runs when the /feedback command is used, showing the modal
feedbackCommand.setExecute(async ({ interaction, locale }) => {
    await interaction.showModal(feedbackModal.build(locale));
});

module.exports = RegisterCommand(feedbackCommand);
```

### Subcommands

Create commands with subcommands for better organization of related functionality.

```javascript
// filepath: /commands/settings.js
const { ModularCommand, RegisterCommand } = require('js-discord-modularcommand');
const { ApplicationCommandOptionType, PermissionFlagsBits, Locale, EmbedBuilder, Colors } = require('discord.js');

const settingsCommand = new ModularCommand('settings')
    .setDescription('Configure bot settings for this server.')
    .setCooldown(5)
    .setPermissionCheck((interaction) => interaction.member.permissions.has(PermissionFlagsBits.ManageGuild));

// Add subcommands with their own options
settingsCommand.addSubCommand({
    name: 'set-prefix',
    description: 'Set the command prefix for this server',
    options: [
        {
            name: 'prefix',
            description: 'The new prefix to use',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]
});

settingsCommand.addSubCommand({
    name: 'set-channel',
    description: 'Set the default channel for bot messages',
    options: [
        {
            name: 'channel',
            description: 'The channel to use for bot messages',
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ]
});

settingsCommand.addSubCommand({
    name: 'view-config',
    description: 'View current server configuration'
});

// Localize subcommands and their options
settingsCommand.setLocalizationSubCommands({
    [Locale.EnglishUS]: {
        'set-prefix': 'Set Command Prefix',
        'set-prefix.description': 'Set the command prefix for this server',
        'set-prefix.prefix': 'Prefix',
        'set-prefix.prefix.description': 'The new prefix to use for commands',
        
        'set-channel': 'Set Default Channel',
        'set-channel.description': 'Set the default channel for bot messages',
        'set-channel.channel': 'Channel',
        'set-channel.channel.description': 'The channel to use for bot messages',
        
        'view-config': 'View Configuration',
        'view-config.description': 'View current server configuration'
    }
});

// Set up localized phrases
settingsCommand.setLocalizationPhrases({
    [Locale.EnglishUS]: {
        'success.prefix_set': 'Command prefix has been set to `{prefix}`.',
        'success.channel_set': 'Default channel has been set to {channel}.',
        'config.title': 'Server Configuration - {serverName}',
        'config.description': 'Current bot settings for this server:'
    }
});

// Handle all subcommands in a single execute function
settingsCommand.setExecute(async ({ interaction, locale, args }) => {
    await interaction.deferReply();
    
    const subcommand = args.subcommand; // The subcommand name is automatically added to args
    
    switch (subcommand) {
        case 'set-prefix':
            const newPrefix = args.prefix;
            // Save the prefix to your database
            await interaction.editReply({
                content: locale['success.prefix_set'].replace('{prefix}', newPrefix)
            });
            break;
            
        case 'set-channel':
            const channel = args.channel;
            // Save the channel to your database
            await interaction.editReply({
                content: locale['success.channel_set'].replace('{channel}', `<#${channel.id}>`)
            });
            break;
            
        case 'view-config':
            const embed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setTitle(locale['config.title'].replace('{serverName}', interaction.guild.name))
                .setDescription(locale['config.description'])
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
            break;
    }
});

module.exports = RegisterCommand(settingsCommand);
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.