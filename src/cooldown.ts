/**
 * @license     MIT
 * @file        src/cooldown.ts
 * @author      vicentefelipechile
 * @description Manages command cooldowns for users in a Discord bot using Discord.js.
 */

// =================================================================================================
// Interfaces
// =================================================================================================

/**
 * @interface CooldownStatus
 * @description Represents the cooldown status of a user for a specific command.
*/
interface CooldownStatus {
    /** Indicates if the user is currently on cooldown. */
    inCooldown: boolean;
    /** The remaining time in seconds until the cooldown expires. It will be 0 if the user is not in cooldown. */
    waitTime: number;
}

// =================================================================================================
// Module-level State
// =================================================================================================

/**
 * @description Stores the cooldown duration configured for each command.
 * @maps Command name (string) to its cooldown duration in seconds (number).
 */
const COMMAND_CONFIG = new Map<string, number>();

/**
 * @description Stores the last execution timestamp for each user on a specific command.
 * @maps Command name (string) to another Map, which in turn maps a user's ID (string) to the execution timestamp (number).
 */
const COOLDOWNS_MAP = new Map<string, Map<string, number>>();

// =================================================================================================
// Public Functions
// =================================================================================================

/**
 * Registers a new command and its cooldown duration in the internal maps.
 * If the command is already registered, an error is thrown to prevent accidental data loss.
 * @param {string} name - The name of the command to register.
 * @param {number} duration - The cooldown duration in seconds.
 * @returns {void}
 */
export function cooldownRegister(name: string, duration: number): void {
    if (COMMAND_CONFIG.has(name)) {
        throw new Error(`Command '${name}' is already registered in the cooldown system.`);
    }

    COMMAND_CONFIG.set(name, duration);
    COOLDOWNS_MAP.set(name, new Map<string, number>());
};

/**
 * Gets the last execution timestamp for a user on a specific command.
 * @param {string} name - The name of the command.
 * @param {string} userId - The ID of the user.
 * @returns {number | undefined} The timestamp (in milliseconds) of the last execution, or `undefined` if not found.
 */
export function cooldownGetUser(name: string, userId: string): number | undefined {
    return COOLDOWNS_MAP.get(name)?.get(userId);
}

/**
 * Sets the current timestamp for a user on a specific command, effectively starting their cooldown.
 * @param {string} name - The name of the command.
 * @param {string} userId - The ID of the user.
 * @returns {void}
 */
export function cooldownSetUser(name: string, userId: string): void {
    COOLDOWNS_MAP.get(name)?.set(userId, Date.now());
}

/**
 * Checks if a user is currently on cooldown for a specific command.
 * Expired entries are automatically cleaned up to prevent memory leaks.
 * @param {string} name - The name of the command.
 * @param {string} userId - The ID of the user.
 * @returns {CooldownStatus} An object indicating if the user is in cooldown and the remaining time.
 */
export default function isUserInCooldown(name: string, userId: string): CooldownStatus {
    // Validate first that the command exists, before doing any further lookups.
    const cooldownDuration = COMMAND_CONFIG.get(name);

    // This error indicates a developer mistake, as a command should be registered before being checked.
    if (cooldownDuration === undefined) {
        throw new Error(`Command '${name}' isn't registered in the cooldown system.`);
    }

    // Single reference to the command's user map, avoiding a second .get(name) lookup later.
    const userMap = COOLDOWNS_MAP.get(name)!;
    const lastTime = userMap.get(userId);

    // If the user has never used the command, they are not on cooldown.
    if (lastTime === undefined) {
        return { inCooldown: false, waitTime: 0 };
    }

    const timePassed = ((Date.now() - lastTime) / 1000) | 0; // Bitwise truncation, faster than Math.floor

    if (timePassed < cooldownDuration) {
        // If the time passed is less than the required cooldown, the user is still on cooldown.
        return { inCooldown: true, waitTime: cooldownDuration - timePassed };
    }

    // Cooldown has expired — remove the entry to prevent memory leaks.
    userMap.delete(userId);
    return { inCooldown: false, waitTime: 0 };
}