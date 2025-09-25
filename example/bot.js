/**
 * @file        bot.js
 * @author      vicentefelipechile
 * @version     2.4.0
 * @license     MIT
 * @description This is the main entry point for the Discord bot.
 * It is responsible for initializing the Discord client, loading all modular commands
 * from the 'commands' directory, registering event handlers, and connecting to Discord.
 */

// -----------------------------------------------------------------------------
// IMPORTS & INITIAL SETUP
// -----------------------------------------------------------------------------

const { Client, Collection, GatewayIntentBits, Events, MessageFlags } = require("discord.js");
const { LoadCommand, ModularCommandHandler } = require("js-discord-modularcommand");
const { readdirSync } = require("node:fs");
const { join } = require("node:path");
const { config } = require("dotenv");

config();

// -----------------------------------------------------------------------------
// DISCORD CLIENT INITIALIZATION
// -----------------------------------------------------------------------------

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
    ]
});

client.commands = new Collection();

// -----------------------------------------------------------------------------
// COMMAND LOADING
// -----------------------------------------------------------------------------

const commandPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandPath).filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
    const filePath = join(commandPath, file);
    const command = require(filePath);

    LoadCommand(commands, command);
};

for (const cmd of commands) {
    client.commands.set(cmd.data.name, cmd);
}

// -----------------------------------------------------------------------------
// EVENT HANDLERS
// -----------------------------------------------------------------------------

// A global flag for our middleware example. Set to 'true' to activate maintenance mode.
const BOT_IN_MAINTENANCE = false;

// Register the main event handler for all interactions.
// The handler also accepts an OPTIONAL second argument: an async function that acts as a global middleware.
// If provided, this function runs BEFORE the command handler attempts to find and execute a command.
client.on(Events.InteractionCreate, ModularCommandHandler(client, async (interaction) => {
    // Example: A global maintenance mode check.
    if (BOT_IN_MAINTENANCE) {
        // We only want to send a reply for interactions that can be replied to, like commands.
        if (interaction.isCommand()) {
            await interaction.reply({
                content: 'The bot is currently under maintenance. Please try again later.',
                flags: MessageFlags.Ephemeral
            });
        }
        // By returning false, we tell the ModularCommandHandler to stop all further processing.
        // The specific command for this interaction will NOT be executed.
        return false;
    }

    // If we don't return false (i.e., the function completes without returning anything),
    // the handler continues its execution normally.
}));

// Register an event handler for when the client is ready and successfully logged in.
client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// -----------------------------------------------------------------------------
// CLIENT LOGIN
// -----------------------------------------------------------------------------

client.login(process.env.DISCORD_TOKEN);