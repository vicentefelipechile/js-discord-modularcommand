/**
 * @license     MIT
 * @version     2.5.2
 * @file        example/loadcommands.js
 * @author      vicentefelipechile
 * @description This is a deployment script responsible for registering slash commands.
 * It reads all command definition files from the 'commands' directory, extracts
 * their JSON data, and sends it to the Discord API to create or update the commands.
 * This script should be run manually whenever you add, remove, or change a command's definition.
 */

// =================================================================================================
// IMPORTS & INITIAL SETUP
// =================================================================================================
// Imports the necessary modules and loads environment variables from the .env file.
const { REST, Routes } = require("discord.js");
const { readdirSync } = require("node:fs");
const { join } = require("node:path");
const { config } = require("dotenv");

config();

// =================================================================================================
// COMMAND DISCOVERY & LOADING
// =================================================================================================
// This section finds the 'commands' directory, reads all command files, validates
// their structure, and extracts the required JSON data for API registration.
const commandsToDeploy = [];
const commandPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = join(commandPath, file);
    const commandModule = require(filePath);
    const commands = Array.isArray(commandModule) ? commandModule : [commandModule];

    for (const command of commands) {
        if (command.data && typeof command.execute === 'function') {
            commandsToDeploy.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The file at ${filePath} does not export a valid command object.`);
        }
    }
}

// =================================================================================================
// DISCORD API REGISTRATION
// =================================================================================================
// Initializes the REST client and executes an async function to send the
// collected command data to the Discord API, registering or updating them.
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Started registering ${commandsToDeploy.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            { body: commandsToDeploy },
        );

        console.log(`Successfully registered ${data.length} application (/) commands.`);
    } catch (error) {
        console.error('Error registering commands:', error);
    }
})();