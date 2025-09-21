# JS Discord ModularCommand

A module to create and manage modular commands in a simple way for Discord.js bots.

## What is it for?

This library simplifies the creation and management of slash commands for [Discord.js](https://discord.js.org/). It allows you to structure your commands in a modular way, making it easier to handle logic, permissions, cooldowns, localizations, and interactive components like buttons and modals.

## How to use it?

First, install the package in your project:

```sh
npm install js-discord-modularcommand@latest
```

Then, you can create your commands in a modular fashion. Here is a basic example of a `ping` command:

```javascript
// filepath: commands/ping.js
const { ModularCommand, RegisterCommand } = require('js-discord-modularcommand');
const { PermissionFlagsBits, Locale } = require('discord.js');

// Create a new command instance
const PingCommand = new ModularCommand('ping');

// Set the description
PingCommand.setDescription('Sends a ping message!');

// Optional: Add a permission check
PingCommand.setPermissionCheck(async ({ interaction }) => {
    return interaction.member.permissions.has(PermissionFlagsBits.Administrator);
});

// Optional: Localization to use with 'locale'
pong.setLocalizationPhrases({
    [Locale.EnglishUS]: {
        response: 'Replies with Pong!',
    },
    [Locale.SpanishLATAM]: {
        response: 'Responde con Pong!',
    }
});

// Set the command's description
pong.setDescription('Replies with Pong!');

// Optional: Add more localization descriptions for the command itself
pong.setLocalizationDescription({
    [Locale.EnglishUS]: 'Replies with Pong!',
    [Locale.SpanishLATAM]: 'Responde con Pong!',
});

// Set the executor function
pong.setExecute(async ({ interaction, locale }) => {
    await interaction.reply(locale['response']);
});

module.exports = RegisterCommand(pong)
```

In your main file, you can load the commands and register their executors with your Discord client.

## License

This project is under the MIT License. See the [LICENSE](LICENSE) file