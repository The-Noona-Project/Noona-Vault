// /database/redis/sendToRedis.mjs

import { printResult, printError } from '../../noona/logger/logUtils.mjs';

/**
 * Safely sets a value in Redis.
 *
 * Attempts to store a value under a specified key in Redis. If the provided client is invalid or disconnected,
 * or if the operation fails, the function logs an error and returns false.
 *
 * @param {string} key - The Redis key to set.
 * @param {string} value - The value to store.
 * @param {object} [options] - Optional Redis set options.
 * @returns {Promise<boolean>} Resolves to true if the operation is successful, or false otherwise.
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
