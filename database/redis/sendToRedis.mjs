// /database/redis/sendToRedis.mjs

import { printResult, printError } from '../../noona/logger/logUtils.mjs';

/**
 * Safely sets a value in Redis.
 *
 * @param {import('redis').RedisClientType} client - Redis client instance.
 * @param {string} key - Redis key to set.
 * @param {string} value - The value to store.
 * @param {object} [options] - Optional Redis set options.
 * @returns {Promise<boolean>} - True if successful, false otherwise.
 */
export async function sendToRedis(client, key, value, options = {}) {
    if (!client || typeof client.set !== 'function') {
        printError('[Redis] Invalid or disconnected client.');
        return false;
    }

    try {
        await client.set(key, value, options);
        printResult(`[Redis] Key "${key}" set successfully.`);
        return true;
    } catch (err) {
        printError(`[Redis] Failed to set key "${key}": ${err.message}`);
        return false;
    }
}
