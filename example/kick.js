/**
 * @file        kick.js
 * @author      vicentefelipechile
 * @version     2.4.0
 * @license     MIT
 * @description Example of a modular 'kick' command.
 * This script demonstrates a more advanced command that includes permission checks,
 * command options, and the use of localization for descriptions, options, and in-command phrases.
 */

// -----------------------------------------------------------------------------
// IMPORTS SECTION
// -----------------------------------------------------------------------------

// Import necessary classes and enums from discord.js and the modular command library.
const { PermissionFlagsBits, Locale, ApplicationCommandOptionType, MessageFlags } = require('discord.js');
const { ModularCommand, RegisterCommand } = require('js-discord-modularcommand');

// -----------------------------------------------------------------------------
// COMMAND INITIALIZATION
// -----------------------------------------------------------------------------

// Create a new instance of ModularCommand for the 'kick' command.
const kickCommand = new ModularCommand('kick');

// -----------------------------------------------------------------------------
// MAIN COMMAND CONFIGURATION
// -----------------------------------------------------------------------------

// Set the default description for the command. This is used if no localization matches.
kickCommand.setDescription('Kick a user from the server');

// -----------------------------------------------------------------------------
// LOCALIZATION CONFIGURATION
// -----------------------------------------------------------------------------

// Set localized descriptions for the command itself.
kickCommand.setLocalizationDescription({
    [Locale.EnglishUS]: 'Kick a user from the server',
    [Locale.SpanishLATAM]: 'Expulsa a un usuario del servidor',
});

// Set localized names/descriptions for the command's options.
// The key 'user' must match the option name defined in addOption.
kickCommand.setLocalizationOptions({
    [Locale.EnglishUS]: {
        user: 'The user to kick',
    },
    [Locale.SpanishLATAM]: {
        user: 'El usuario a expulsar',
    }
});

// Define a dictionary of phrases for use within the command's execution logic.
// This allows for localized responses (e.g., error messages, success confirmations).
kickCommand.setLocalizationPhrases({
    [Locale.EnglishUS]: {
        userNotFound: 'User not found in this server.',
        userKicked: 'User {user} has been kicked.',
        kickFailed: 'Failed to kick user.',
    },
    [Locale.SpanishLATAM]: {
        userNotFound: 'Usuario no encontrado en este servidor.',
        userKicked: 'El usuario {user} ha sido expulsado.',
        kickFailed: 'No se pudo expulsar al usuario.',
    }
});
        
// -----------------------------------------------------------------------------
// PERMISSION HANDLING
// -----------------------------------------------------------------------------

// setPermissionCheck defines a function that runs before the command executes.
// It should return 'true' if the user has permission, and 'false' otherwise.
kickCommand.setPermissionCheck(({ interaction }) => {
    // We check if the member who ran the command has the 'KickMembers' permission.
    return interaction.member.permissions.has(PermissionFlagsBits.KickMembers);
});

// -----------------------------------------------------------------------------
// COMMAND OPTIONS
// -----------------------------------------------------------------------------

// addOption defines the parameters the command will accept.
kickCommand.addOption({
    name: 'user', // The name of the option, used to retrieve its value later.
    type: ApplicationCommandOptionType.User, // The type of input expected, in this case, a Discord user.
    required: true, // This option must be provided by the user.
});

// -----------------------------------------------------------------------------
// EXECUTION LOGIC
// -----------------------------------------------------------------------------

// setExecute defines the main logic of the command.
// It receives the interaction, parsed arguments (args), and the selected locale phrases (locale).
kickCommand.setExecute(async ({ interaction, args, locale }) => {
    // Retrieve the user object from the parsed arguments.
    const user = args['user']; // or you can access with arg.user

    // We need the guild member object to perform actions like kicking.
    // We fetch it from the guild's member cache using the user's ID.
    const member = interaction.guild.members.cache.get(user.id);

    // If the member is not found in the server's cache, they might not be in the server.
    if (!member) {
        // Reply with the localized 'userNotFound' phrase.
        // The message is set to Ephemeral, so only the user who ran the command can see it.
        await interaction.reply({
            content: locale['userNotFound'],
            flags: MessageFlags.Ephemeral
        });
        return; // Stop execution.
    }

    // Use a try...catch block to handle potential errors during the kick attempt,
    // for example, if the bot lacks permissions to kick that specific user.
    try {
        await member.kick(); // Attempt to kick the member.
        
        // On success, reply with the localized 'userKicked' phrase.
        // We replace the {user} placeholder with the actual user tag.
        await interaction.reply({
            content: locale['userKicked'].replace('{user}', user.tag),
        });
    } catch (err) {
        // If an error occurs, reply with the localized 'kickFailed' phrase.
        // This is also an ephemeral message to avoid cluttering the channel.
        await interaction.reply({
            content: locale['kickFailed'],
            flags: MessageFlags.Ephemeral
        });
        // It's good practice to log the actual error to the console for debugging.
        console.error(err);
    }
});

// -----------------------------------------------------------------------------
// COMMAND EXPORT
// -----------------------------------------------------------------------------

// Wrap the command with RegisterCommand to prepare it for the command handler.
module.exports = RegisterCommand(kickCommand);