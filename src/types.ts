/**
 * @file Contains the type and interface definitions for the Discord bot's modular commands.
 * @author vicentefelipechile
 * @license MIT
 */

import {
    ApplicationCommandOptionType as OptionType,
    APIApplicationCommandOptionChoice,
    ChatInputCommandInteraction,
    MessageComponentInteraction,
    ModalSubmitInteraction,
    CommandInteraction,
    ButtonInteraction,
    SlashCommandBuilder,
    PartialDMChannel,
    ThreadChannel,
    GuildChannel,
    Collection,
    Message,
    Locale,
    Client,
    User,
} from "discord.js";
import ModularCommand from "./modularcommand";

// =================================================================================================
// Interfaces
// =================================================================================================

/**
 * @interface CommandOption
 * @description Defines the structure of an option for a slash command.
 */
export interface CommandOption {
    /** The name of the option, must be unique within the command. */
    name: string;
    /** The data type the option expects (e.g., STRING, USER, CHANNEL). */
    type: OptionType;
    /** The description of the option. It can be a string or an object for localization. */
    description: Record<Locale, string> | string;
    /** Defines if the option is required. */
    required?: boolean;
    /** An array of predefined choices the user can select from. */
    choices?: APIApplicationCommandOptionChoice[];
}

/**
 * @interface CommandData
 * @description Represents the final structure of a registered command, ready to be used by the Discord client.
 */
export interface CommandData {
    /** The slash command configuration built with SlashCommandBuilder. */
    data: SlashCommandBuilder;
    /** The main function that executes when the command is invoked. */
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    /** (Optional) Function to handle component interactions (e.g., select menus). */
    componentExecute?: (interaction: MessageComponentInteraction) => Promise<void>;
    /** (Optional) Function to handle modal submissions. */
    modalExecute?: (interaction: ModalSubmitInteraction) => Promise<void>;
    /** (Optional) Function to handle button interactions. */
    buttonExecute?: (interaction: ButtonInteraction) => Promise<void>;
    /** The command's cooldown time in seconds. */
    cooldown: number;
}

// =================================================================================================
// Generic and Utility Types
// =================================================================================================

/**
 * @type LocaleKey
 * @description An object that maps text identifiers to their translations.
 * @example { "GREETING": "Hello!", "FAREWELL": "Goodbye!" }
 */
export type LocaleKey = Record<string, string>;

/**
 * @type ClientWithCommands
 * @description Extends the discord.js `Client` type to include a collection of commands.
 */
export type ClientWithCommands = Client & {
    commands: Collection<string, CommandData>;
};

/**
 * @type CommandArgumentValue
 * @description Represents the possible value types that a command argument can have.
 */
export type CommandArgumentValue =
    | string
    | boolean
    | number
    | User
    | GuildChannel
    | ThreadChannel
    | PartialDMChannel
    | null;

// =================================================================================================
// Function Parameter Types
// =================================================================================================

/**
 * @type BaseExecuteParams
 * @description Defines the base parameters shared by all execution functions.
 */
export type BaseExecuteParams<T extends CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction> = {
    /** The interaction received from Discord. */
    interaction: T;
    /** The instance of the modular command being executed. */
    command: ModularCommand;
    /** The localization object to get translated texts. */
    locale: LocaleKey;
};

/**
 * @type CommandExecuteParams
 * @description Parameters for the execution function of a chat command.
 */
export type CommandExecuteParams = BaseExecuteParams<ChatInputCommandInteraction> & {
    /** An object containing the arguments provided by the user. */
    args?: Record<string, CommandArgumentValue>;
};

/**
 * @type ButtonExecuteParams
 * @description Parameters for the execution function of a button.
 */
export type ButtonExecuteParams = BaseExecuteParams<ButtonInteraction> & {
    /** The message to which the button is attached. */
    message: Message;
};

/**
 * @type ModalExecuteParams
 * @description Parameters for the execution function of a modal.
 */
export type ModalExecuteParams = BaseExecuteParams<ModalSubmitInteraction> & {
    /** An object with the values of the fields submitted in the modal. */
    args: Record<string, string>;
};

// =================================================================================================
// Execution Function Types
// =================================================================================================

/**
 * @type CommandExecuteFunction
 * @description Defines the signature for the main execution function of a command.
 */
export type CommandExecuteFunction = (params: CommandExecuteParams) => Promise<void>;

/**
 * @type ComponentExecuteFunction
 * @description Defines the signature for the function that handles generic component interactions.
 */
export type ComponentExecuteFunction = (params: BaseExecuteParams<MessageComponentInteraction>) => Promise<void>;

/**
 * @type ButtonExecuteFunction
 * @description Defines the signature for the function that handles button interactions.
 */
export type ButtonExecuteFunction = (params: ButtonExecuteParams) => Promise<void>;

/**
 * @type ModalExecuteFunction
 * @description Defines the signature for the function that handles a modal submission.
 */
export type ModalExecuteFunction = (params: ModalExecuteParams) => Promise<void>;

/**
 * @type PermissionCheckFunction
 * @description Defines the signature for a function that checks a user's permissions to execute a command.
 * @returns {boolean | Promise<boolean>} `true` if the user has permission, `false` otherwise.
 */
export type PermissionCheckFunction = (params: { interaction: CommandInteraction }) => boolean | Promise<boolean>;