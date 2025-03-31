// /database/redis/getFromRedis.mjs

import { printDebug, printError } from '../../noona/logger/logUtils.mjs';

/**
 * Retrieves the value for a specified Redis key asynchronously.
 *
 * Returns the value if present; otherwise, logs an error or debug message and returns null. This occurs when
 * the Redis client is invalid/disconnected, the key is not found, or an error happens during retrieval.
 *
 * @param {string} key - The Redis key to retrieve.
 * @returns {Promise<string|null>} A promise that resolves to the retrieved value or null.
 */
export async function getFromRedis(client, key) {
    if (!client || typeof client.get !== 'function') {
        printError('[Redis] Invalid or disconnected client.');
        return null;
    }

    try {
        const value = await client.get(key);
        if (value === null) {
            printDebug(`[Redis] Key "${key}" not found.`);
        }
        return value;
    } catch (err) {
        printError(`[Redis] Failed to get key "${key}": ${err.message}`);
        return null;
    }
}
