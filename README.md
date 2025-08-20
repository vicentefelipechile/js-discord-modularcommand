# JS Discord ModularCommand

A module to create and manage modular commands in a simple way for Discord.js bots.

## What is it for?

This library simplifies the creation and management of slash commands for [Discord.js](https://discord.js.org/). It allows you to structure your commands in a modular way, making it easier to handle logic, permissions, cooldowns, localizations, and interactive components like buttons and modals.

The main classes are:
- [`ModularCommand`](src/modularcommand.ts): To define the base structure of a command.
- [`ModularButton`](src/modularcommand.ts): To create interactive buttons associated with a command.
- [`ModularModal`](src/modularcommand.ts): To create modals (forms) that the user can fill out.

## How to use it?

First, install the package in your project:

```sh
npm install js-discord-modularcommand
```

Then, you can create your commands in a modular fashion. Here is a basic example of a `ping` command:

```javascript
// filepath: commands/ping.js
const { ModularCommand, RegisterCommand } = require('js-discord-modularcommand');
const { PermissionFlagsBits } = require('discord.js');

// Create a new command instance
const PingCommand = new ModularCommand('ping');

// Set the description
PingCommand.setDescription('Sends a ping message!');

// Optional: Add a permission check
PingCommand.setPermissionCheck(async ({ interaction }) => {
    return interaction.member.permissions.has(PermissionFlagsBits.Administrator);
});

// Define the logic to be executed
PingCommand.setExecute(async ({ interaction }) => {
    await interaction.reply('Pong!');
});

// Register the command so it can be used by the Discord.js client
module.exports = RegisterCommand([
    PingCommand
]);
```

In your main file, you can load the commands and register their executors with your Discord client.

## License

This project is under the MIT License. See the [LICENSE](LICENSE) file