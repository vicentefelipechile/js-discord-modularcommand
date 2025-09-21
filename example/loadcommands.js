/**
 * @fileoverview
 * Example script for loading and deploying Discord slash commands using discord.js v14+.
 * This script reads all command modules from the 'commands' directory, validates them,
 * and registers them globally to a Discord application via the REST API.
 *
 * Usage:
 * - Place your command files (exporting { data, execute }) in the 'commands' folder.
 * - Ensure your .env file contains DISCORD_TOKEN and DISCORD_CLIENT_ID.
 * - Run this script to deploy your commands.
 *
 * Key Steps:
 * 1. Loads environment variables.
 * 2. Reads and validates command files.
 * 3. Prepares commands for deployment.
 * 4. Registers commands globally using Discord REST API.
 *
 * @module loadcommands
 * @requires discord.js
 * @requires node:fs
 * @requires node:path
 * @requires dotenv
 *
 * @example
 * // To deploy commands, run:
 * // node loadcommands.js
 *
 * @warning
 * This script is for demonstration purposes. Adapt paths and error handling as needed for production use.
 */

// Import required modules
const { REST, Routes } = require("discord.js");
const { readdirSync } = require("node:fs");
const { join } = require("node:path");
const { config } = require("dotenv");

// Load environment variables from .env file
config();

// Array to store commands to deploy
const commandsToDeploy = [];

// Path to the commands directory
const commandPath = join(__dirname, 'commands');

// Read all .js files from the commands directory
const commandFiles = readdirSync(commandPath).filter(file => file.endsWith('.js'));

// Load and validate each command file
for (const file of commandFiles) {
    const filePath = join(commandPath, file);
    const commandModule = require(filePath);

    // Support both single command export and array of commands
    const commands = Array.isArray(commandModule) ? commandModule : [commandModule];

    for (const command of commands) {
        // Validate command structure
        if (command.data && typeof command.execute === 'function') {
            commandsToDeploy.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] File ${filePath} does not export a valid command.`);
        }
    }
}

// Initialize Discord REST API client
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Deploy commands asynchronously
(async () => {
    try {
        console.log(`Registering ${commandsToDeploy.length} commands...`);

        // Register commands globally
        const globalData = await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            { body: commandsToDeploy }
        );

        console.log(`Successfully registered ${globalData.length} commands.`);
    } catch (error) {
        console.error('Error registering commands:', error);
    }
})();