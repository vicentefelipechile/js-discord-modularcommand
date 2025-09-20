/**
 * @file Contains the logic for loading modular commands into the Discord bot client.
 * @author vicentefelipechile
 * @license MIT
 */

import { CommandData } from "./types";

// =================================================================================================
// Main Loading Function
// =================================================================================================

/**
 * @description Loads one or more commands into an array.
 * @param {CommandData[]} commandsArray The array where the loaded commands will be stored.
 * @param {CommandData | CommandData[]} command The command(s) to load. Can be a single `CommandData` object or an array of them.
 * @throws {TypeError} If a command is missing the `execute` function.
 * @example
 * ```typescript
 * import { Collection } from "discord.js";
 * import LoadCommand from "./loadcommands";
 * import exampleCommand from "./commands/example";
 *
 * const commandsList: CommandData[] = [];
 * LoadCommand(commandsList, exampleCommand);
 *
 * const client = { commands: new Collection<string, CommandData>() };
 * for (const cmd of commandsList) {
 *   client.commands.set(cmd.data.name, cmd);
 * }
 * ```
 */

export default function LoadCommand(commandsArray: CommandData[], command: CommandData | CommandData[]): void {
    const commands = Array.isArray(command) ? command : [command];

    for (const cmd of commands) {
        if (typeof cmd.execute !== "function") {
            throw new TypeError(`Command "${cmd.data.name}" is missing a required 'execute' function.`);
        }
        commandsArray.push(cmd);
    }
}