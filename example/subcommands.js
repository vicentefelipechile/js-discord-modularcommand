/**
 * @license     MIT
 * @version     2.5.2
 * @file        example/subcommands.js
 * @author      vicentefelipechile
 * @description Example command demonstrating subcommand functionality with proper localization and permission checks.
 */

// =================================================================================================
// IMPORTS SECTION
// =================================================================================================

const { Locale, EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits, Colors } = require("discord.js");
const { ModularCommand, RegisterCommand } = require("js-discord-modularcommand");

// =================================================================================================
// COMMAND INITIALIZATION
// =================================================================================================

const settingsCommand = new ModularCommand('settings')
    .setDescription('Configure bot settings for this server.')
    .setCooldown(5)
    .setPermissionCheck((interaction) => interaction.member.permissions.has(PermissionFlagsBits.ManageGuild));

// =================================================================================================
// SUBCOMMAND CONSTANTS
// =================================================================================================

const SUBCOMMANDS_NAME = {
    SET_PREFIX: 'set-prefix',
    SET_CHANNEL: 'set-channel',
    TOGGLE_FEATURE: 'toggle-feature',
    VIEW_CONFIG: 'view-config',
    RESET_CONFIG: 'reset-config'
};

// =================================================================================================
// SUBCOMMANDS CONFIGURATION
// =================================================================================================

settingsCommand.addSubCommand({
    name: SUBCOMMANDS_NAME.SET_PREFIX,
    description: 'Set the command prefix for this server',
    options: [
        {
            name: 'prefix',
            description: 'The new prefix to use',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]
});

settingsCommand.addSubCommand({
    name: SUBCOMMANDS_NAME.SET_CHANNEL,
    description: 'Set the default channel for bot messages',
    options: [
        {
            name: 'channel',
            description: 'The channel to use for bot messages',
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ]
});

settingsCommand.addSubCommand({
    name: SUBCOMMANDS_NAME.TOGGLE_FEATURE,
    description: 'Enable or disable a bot feature',
    options: [
        {
            name: 'feature',
            description: 'The feature to toggle',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Auto Moderation', value: 'automod' },
                { name: 'Welcome Messages', value: 'welcome' },
                { name: 'Logging', value: 'logging' }
            ]
        },
        {
            name: 'enabled',
            description: 'Enable or disable the feature',
            type: ApplicationCommandOptionType.Boolean,
            required: true
        }
    ]
});

settingsCommand.addSubCommand({
    name: SUBCOMMANDS_NAME.VIEW_CONFIG,
    description: 'View current server configuration'
});

settingsCommand.addSubCommand({
    name: SUBCOMMANDS_NAME.RESET_CONFIG,
    description: 'Reset server configuration',
    options: [
        {
            name: 'confirm',
            description: 'Type "confirm" to reset all settings',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]
});

// =================================================================================================
// LOCALIZATION CONFIGURATION
// =================================================================================================

settingsCommand.setLocalizationDescription({
    [Locale.EnglishUS]: 'Configure bot settings for this server.',
    [Locale.SpanishLATAM]: 'Configura los ajustes del bot para este servidor.',
});

settingsCommand.setLocalizationPhrases({
    [Locale.EnglishUS]: {
        'error.permission': 'You need the "Manage Server" permission to use this command.',
        'error.general': 'An error occurred while processing the settings. Please try again later.',
        'error.invalid_prefix': 'The prefix must be between 1 and 5 characters long.',
        'error.invalid_channel': 'The specified channel is not valid.',
        'error.reset_failed': 'Failed to reset configuration. Please try again.',
        'success.prefix_set': 'Command prefix has been set to `{prefix}`.',
        'success.channel_set': 'Default channel has been set to {channel}.',
        'success.feature_toggled': 'Feature "{feature}" has been {status}.',
        'success.config_reset': 'All server configuration has been reset successfully.',
        'status.enabled': 'enabled',
        'status.disabled': 'disabled',
        'config.title': 'Server Configuration - {serverName}',
        'config.description': 'Current bot settings for this server:',
        'config.prefix': 'Command Prefix:',
        'config.channel': 'Default Channel:',
        'config.automod': 'Auto Moderation:',
        'config.welcome': 'Welcome Messages:',
        'config.logging': 'Logging:',
        'config.not_set': 'Not configured',
        'reset.confirmation': 'Type "confirm" to reset all settings.',
        'reset.invalid': 'Invalid confirmation. Type "confirm" to reset settings.'
    },
    [Locale.SpanishLATAM]: {
        'error.permission': 'Necesitas el permiso "Administrar Servidor" para usar este comando.',
        'error.general': 'Ocurrió un error al procesar la configuración. Por favor, inténtalo de nuevo más tarde.',
        'error.invalid_prefix': 'El prefijo debe tener entre 1 y 5 caracteres.',
        'error.invalid_channel': 'El canal especificado no es válido.',
        'error.reset_failed': 'No se pudo restablecer la configuración. Por favor, inténtalo de nuevo.',
        'success.prefix_set': 'El prefijo de comando ha sido establecido como `{prefix}`.',
        'success.channel_set': 'El canal predeterminado ha sido establecido como {channel}.',
        'success.feature_toggled': 'La función "{feature}" ha sido {status}.',
        'success.config_reset': 'Toda la configuración del servidor ha sido restablecida exitosamente.',
        'status.enabled': 'habilitada',
        'status.disabled': 'deshabilitada',
        'config.title': 'Configuración del Servidor - {serverName}',
        'config.description': 'Configuración actual del bot para este servidor:',
        'config.prefix': 'Prefijo de Comando:',
        'config.channel': 'Canal Predeterminado:',
        'config.automod': 'Moderación Automática:',
        'config.welcome': 'Mensajes de Bienvenida:',
        'config.logging': 'Registro:',
        'config.not_set': 'No configurado',
        'reset.confirmation': 'Escribe "confirm" para restablecer toda la configuración.',
        'reset.invalid': 'Confirmación inválida. Escribe "confirm" para restablecer la configuración.'
    },
});

settingsCommand.setLocalizationSubCommands({
    [Locale.EnglishUS]: {
        [`${SUBCOMMANDS_NAME.SET_PREFIX}`]: 'Set Command Prefix',
        [`${SUBCOMMANDS_NAME.SET_PREFIX}.description`]: 'Set the command prefix for this server',
        [`${SUBCOMMANDS_NAME.SET_PREFIX}.prefix`]: 'Prefix',
        [`${SUBCOMMANDS_NAME.SET_PREFIX}.prefix.description`]: 'The new prefix to use for commands',

        [`${SUBCOMMANDS_NAME.SET_CHANNEL}`]: 'Set Default Channel',
        [`${SUBCOMMANDS_NAME.SET_CHANNEL}.description`]: 'Set the default channel for bot messages',
        [`${SUBCOMMANDS_NAME.SET_CHANNEL}.channel`]: 'Channel',
        [`${SUBCOMMANDS_NAME.SET_CHANNEL}.channel.description`]: 'The channel to use for bot messages',

        [`${SUBCOMMANDS_NAME.TOGGLE_FEATURE}`]: 'Toggle Feature',
        [`${SUBCOMMANDS_NAME.TOGGLE_FEATURE}.description`]: 'Enable or disable a bot feature',
        [`${SUBCOMMANDS_NAME.TOGGLE_FEATURE}.feature`]: 'Feature',
        [`${SUBCOMMANDS_NAME.TOGGLE_FEATURE}.feature.description`]: 'The feature to toggle',
        [`${SUBCOMMANDS_NAME.TOGGLE_FEATURE}.enabled`]: 'Enabled',
        [`${SUBCOMMANDS_NAME.TOGGLE_FEATURE}.enabled.description`]: 'Enable or disable the feature',

        [`${SUBCOMMANDS_NAME.VIEW_CONFIG}`]: 'View Configuration',
        [`${SUBCOMMANDS_NAME.VIEW_CONFIG}.description`]: 'View current server configuration',

        [`${SUBCOMMANDS_NAME.RESET_CONFIG}`]: 'Reset Configuration',
        [`${SUBCOMMANDS_NAME.RESET_CONFIG}.description`]: 'Reset all server configuration to defaults',
        [`${SUBCOMMANDS_NAME.RESET_CONFIG}.confirm`]: 'Confirmation',
        [`${SUBCOMMANDS_NAME.RESET_CONFIG}.confirm.description`]: 'Type "confirm" to reset all settings'
    },
    [Locale.SpanishLATAM]: {
        [`${SUBCOMMANDS_NAME.SET_PREFIX}`]: 'Establecer Prefijo de Comando',
        [`${SUBCOMMANDS_NAME.SET_PREFIX}.description`]: 'Establece el prefijo de comando para este servidor',
        [`${SUBCOMMANDS_NAME.SET_PREFIX}.prefix`]: 'Prefijo',
        [`${SUBCOMMANDS_NAME.SET_PREFIX}.prefix.description`]: 'El nuevo prefijo para usar en los comandos',
        
        [`${SUBCOMMANDS_NAME.SET_CHANNEL}`]: 'Establecer Canal Predeterminado',
        [`${SUBCOMMANDS_NAME.SET_CHANNEL}.description`]: 'Establece el canal predeterminado para los mensajes del bot',
        [`${SUBCOMMANDS_NAME.SET_CHANNEL}.channel`]: 'Canal',
        [`${SUBCOMMANDS_NAME.SET_CHANNEL}.channel.description`]: 'El canal a usar para los mensajes del bot',

        [`${SUBCOMMANDS_NAME.TOGGLE_FEATURE}`]: 'Alternar Función',
        [`${SUBCOMMANDS_NAME.TOGGLE_FEATURE}.description`]: 'Habilitar o deshabilitar una función del bot',
        [`${SUBCOMMANDS_NAME.TOGGLE_FEATURE}.feature`]: 'Función',
        [`${SUBCOMMANDS_NAME.TOGGLE_FEATURE}.feature.description`]: 'La función a alternar',
        [`${SUBCOMMANDS_NAME.TOGGLE_FEATURE}.enabled`]: 'Habilitada',
        [`${SUBCOMMANDS_NAME.TOGGLE_FEATURE}.enabled.description`]: 'Habilitar o deshabilitar la función',

        [`${SUBCOMMANDS_NAME.VIEW_CONFIG}`]: 'Ver Configuración',
        [`${SUBCOMMANDS_NAME.VIEW_CONFIG}.description`]: 'Ver la configuración actual del servidor',

        [`${SUBCOMMANDS_NAME.RESET_CONFIG}`]: 'Restablecer Configuración',
        [`${SUBCOMMANDS_NAME.RESET_CONFIG}.description`]: 'Restablece toda la configuración del servidor a los valores predeterminados',
        [`${SUBCOMMANDS_NAME.RESET_CONFIG}.confirm`]: 'Confirmación',
        [`${SUBCOMMANDS_NAME.RESET_CONFIG}.confirm.description`]: 'Escribe "confirm" para restablecer toda la configuración'
    }
});

// =================================================================================================
// HELPER FUNCTIONS
// =================================================================================================

/**
 * Mock configuration storage (in a real bot, you'd use a database)
 */
const serverConfigs = new Map();

/**
 * Get server configuration with defaults
 * @param {string} serverId - The server ID
 * @returns {object} Server configuration
 */
function getServerConfig(serverId) {
    return serverConfigs.get(serverId) || {
        prefix: '!',
        channel: null,
        automod: false,
        welcome: false,
        logging: false
    };
}

/**
 * Save server configuration
 * @param {string} serverId - The server ID
 * @param {object} config - The configuration to save
 */
function saveServerConfig(serverId, config) {
    serverConfigs.set(serverId, { ...getServerConfig(serverId), ...config });
}

// =================================================================================================
// COMMAND EXECUTION HANDLERS
// =================================================================================================

settingsCommand.setExecute(async ({ interaction, locale, args }) => {
    try {
        await interaction.deferReply();

        const serverId = interaction.guild.id;
        const subcommand = args.subcommand;

        if (!serverConfigs.has(serverId)) {
            saveServerConfig(serverId, {
                prefix: '!',
                channel: null,
                automod: false,
                welcome: false,
                logging: false
            });
        }

        switch (subcommand) {
            case SUBCOMMANDS_NAME.SET_PREFIX: {
                const newPrefix = args.prefix;
                
                if (!newPrefix || newPrefix.length < 1 || newPrefix.length > 5) {
                    await interaction.editReply({ content: locale['error.invalid_prefix'] });
                    return;
                }

                saveServerConfig(serverId, { prefix: newPrefix });
                await interaction.editReply({
                    content: locale['success.prefix_set'].replace('{prefix}', newPrefix)
                });
                break;
            }

            case SUBCOMMANDS_NAME.SET_CHANNEL: {
                const channel = args.channel;
                
                if (!channel) {
                    await interaction.editReply({ content: locale['error.invalid_channel'] });
                    return;
                }

                saveServerConfig(serverId, { channel: channel.id });
                await interaction.editReply({
                    content: locale['success.channel_set'].replace('{channel}', `<#${channel.id}>`)
                });
                break;
            }

            case SUBCOMMANDS_NAME.TOGGLE_FEATURE: {
                const feature = args.feature;
                const enabled = args.enabled;
                
                const updateConfig = {};
                updateConfig[feature] = enabled;
                
                saveServerConfig(serverId, updateConfig);
                
                const status = locale[enabled ? 'status.enabled' : 'status.disabled'];
                await interaction.editReply({
                    content: locale['success.feature_toggled']
                        .replace('{feature}', feature)
                        .replace('{status}', status)
                });
                break;
            }

            case SUBCOMMANDS_NAME.VIEW_CONFIG: {
                const config = getServerConfig(serverId);
                
                const embed = new EmbedBuilder()
                    .setColor(Colors.Blue)
                    .setTitle(locale['config.title'].replace('{serverName}', interaction.guild.name))
                    .setDescription(locale['config.description'])
                    .addFields(
                        {
                            name: locale['config.prefix'],
                            value: `\`${config.prefix}\``,
                            inline: true
                        },
                        {
                            name: locale['config.channel'],
                            value: config.channel ? `<#${config.channel}>` : locale['config.not_set'],
                            inline: true
                        },
                        {
                            name: locale['config.automod'],
                            value: config.automod ? locale['status.enabled'] : locale['status.disabled'],
                            inline: true
                        },
                        {
                            name: locale['config.welcome'],
                            value: config.welcome ? locale['status.enabled'] : locale['status.disabled'],
                            inline: true
                        },
                        {
                            name: locale['config.logging'],
                            value: config.logging ? locale['status.enabled'] : locale['status.disabled'],
                            inline: true
                        }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
                break;
            }

            case SUBCOMMANDS_NAME.RESET_CONFIG: {
                const confirmation = args.confirm;
                
                if (confirmation !== 'confirm') {
                    await interaction.editReply({ content: locale['reset.invalid'] });
                    return;
                }

                serverConfigs.delete(serverId);
                await interaction.editReply({ content: locale['success.config_reset'] });
                break;
            }

            default: {
                await interaction.editReply({ content: locale['error.general'] });
                break;
            }
        }

    } catch (error) {
        console.error('Error in settings command:', error);
        await interaction.editReply({ content: locale['error.general'] });
    }
});

// =================================================================================================
// EXPORT SECTION
// =================================================================================================

module.exports = RegisterCommand([settingsCommand]);