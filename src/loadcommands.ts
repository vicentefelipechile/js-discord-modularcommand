/**
 * @module LoadCommands
 * @description A module for loading modular commands into the Discord bot.
 * @license MIT
 */

/**
 * Imports
 */

import { CommandData } from "./modularcommand";

/**
 * @param commandsArray For storing the loaded commands
 * @param command The command to load
 * @example
 * const client = new Client();
 * client.commands = new Collection();
 *
 * const commandsPath = join(__dirname, 'src', 'commands');
 * const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
 *
 * const commandsList = [];
 *
 * for (const file of commandFiles) {
 *  const filePath = join(commandsPath, file);
 *  const commandModule = require(filePath);
 *
 *  LoadCommands(commandsList, commandModule);
 * }
 *
 * for (const cmd of commandsList) {
 *  client.commands.set(cmd.data.name, cmd);
 * }
 */

function LoadCommand(commandsArray: Object[], command: CommandData | CommandData[]): void {
    const commands = Array.isArray(command) ? command : [command];

    for (const cmd of commands) {
        if (typeof cmd.execute !== "function") throw new TypeError("Missing command execute function");
        commandsArray.push(cmd);
    }
};

/**
 * Exports
 */

export default LoadCommand;