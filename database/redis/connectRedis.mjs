// /database/redis/connectRedis.mjs

import { createClient } from 'redis';
import { printDebug, printError, printResult } from '../../noona/logger/logUtils.mjs';

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
