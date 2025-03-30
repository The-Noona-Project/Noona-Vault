// /database/redis/getFromRedis.mjs

import { printDebug, printError } from '../../noona/logger/logUtils.mjs';

/**
 * Safely fetches a value from Redis.
 *
 * @param {import('redis').RedisClientType} client - Redis client instance.
 * @param {string} key - Redis key to retrieve.
 * @returns {Promise<string|null>} - The retrieved value or null if not found/error.
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
