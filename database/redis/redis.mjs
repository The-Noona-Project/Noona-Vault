// ✅ /database/redis/redis.mjs

import { createClient } from 'redis';
import {
    printSection,
    printResult,
    printError,
    printDebug
} from '../../noona/logger/logUtils.mjs';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Initializes a Redis connection using the native client.
 * On success, returns { client }, otherwise false.
 *
 * @returns {Promise<{ client: import('redis').RedisClientType } | false>}
 */
export default async function initRedis() {
    const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';

    printSection('Redis');

    if (isDev) {
        printDebug(`Redis URL: ${redisURL}`);
    }

    try {
        const client = createClient({ url: redisURL });

        client.on('error', err => {
            printError(`Redis Client Error: ${err.message}`);
        });

        await client.connect();
        printResult(`✅ Connected to Redis @ ${redisURL}`);

        return { client };
    } catch (err) {
        printError('❌ Redis connection failed.');
        printDebug(err.message || 'Unknown Redis error');
        return false;
    }
}
