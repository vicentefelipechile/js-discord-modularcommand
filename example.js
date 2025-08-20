/**
 * Modular Command Example
 * @license MIT
 */

/**
 * Imports
 */

const { Client, Collection, Events } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

const { LoadCommand } = require('js-discord-modularcommand');

/**
 * Client
 */

const client = new Client();
client.commands = new Collection();

/**
 * Command Loader
 */

const commandPath = join(__dirname, 'src', 'commands'); // ./src/commands
const commandFiles = readdirSync(commandPath).filter(file => file.endsWith('.js'));

const commandList = [];

for (const file of commandFiles) {
    const filePath = join(commandPath, file);
    const commandData = require(filePath);

    LoadCommand(commandList, commandData);
}

for (const command of commandList) {
    client.commands.set(command.data.name, command);
}


/**
 * Interaction
 */

client.on(Events.InteractionCreate, InteractionModularHandler(client, ({ interaction }) => {
    // This functions execute before the command execute function
    // If this functions return false, then doesn't run the command
}));

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.BOT_TOKEN);