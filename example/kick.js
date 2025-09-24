/**
 * Modular Kick Command Example
 * @description This is an example of a modular kick command using the js-discord-modularcommand library,
 *              which includes permission checks and localization.
 */

const { PermissionFlagsBits, Locale, ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const { ModularCommand, RegisterCommand } = require("js-discord-modularcommand");

const kickCommand = new ModularCommand("kick")

kickCommand.setDescription("Kick a user from the server")

kickCommand.setLocalizationDescription({
    [Locale.EnglishUS]: "Kick a user from the server",
    [Locale.SpanishLATAM]: "Expulsa a un usuario del servidor",
})

kickCommand.setPermissionCheck(({ interaction }) => {
    // Only allow users with the KickMembers permission to use this command
    return interaction.member.permissions.has(PermissionFlagsBits.KickMembers);
})

kickCommand.addOption({
    name: "user",
    type: ApplicationCommandOptionType.User,
    required: true,
})

kickCommand.setExecute(async ({ interaction, args, locale }) => {
    const user = args.user;

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) {
        await interaction.reply({
            content: "User not found in this server.",
            flags: MessageFlags.Ephemeral
        });
        return;
    }

    try {
        await member.kick();
        await interaction.reply({
            content: `User ${user.tag} has been kicked.`,
        });
    } catch (err) {
        await interaction.reply({
            content: "Failed to kick user.",
            flags: MessageFlags.Ephemeral
        });
        console.error(err);
    }
});

module.exports = RegisterCommand(kickCommand);