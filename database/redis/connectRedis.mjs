// /database/redis/connectRedis.mjs

import { createClient } from 'redis';
import { printDebug, printError, printResult } from '../../noona/logger/logUtils.mjs';

/**
 * Asynchronously connects to a Redis database.
 *
 * This function creates a Redis client using the URL specified in the REDIS_URL environment variable,
 * defaulting to "redis://localhost:6379" if not provided. It sets up an error listener on the client,
 * attempts to establish a connection, logs the outcome, and returns the client instance upon success.
 * If the connection fails, it logs the error and returns null.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the Redis client instance if connected,
 * or null if an error occurs.
 */
export default async function connectRedis() {
    const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';

    try {
        const client = createClient({ url: redisURL });

        client.on('error', (err) => {
            printError(`Redis Client Error: ${err.message}`);
        });

        await client.connect();
        printResult(`Connected to Redis at ${redisURL}`);
        return client;
    } catch (error) {
        printError(`Error connecting to Redis: ${error.message}`);
        return null;
    }
}
