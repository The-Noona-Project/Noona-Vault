// /database/redis/initRedis.mjs

import connectRedis from './connectRedis.mjs';
import { verifyVaultKeyPair } from '../../noona/jwt/verifyKeyPair.mjs';
import {
    printSection,
    printResult,
    printError,
    printDebug
} from '../../noona/logger/logUtils.mjs';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Initializes a Redis connection and validates JWT keypair.
 * On success, returns { client }; otherwise returns false.
 *
 * @returns {Promise<{ client: import('redis').RedisClientType } | false>}
 */
export default async function initRedis() {
    printSection('Redis Initialization');

    try {
        const client = await connectRedis();
        if (!client) {
            printError('❌ Redis connection failed: No client returned.');
            return false;
        }

        if (isDev) {
            const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';
            printDebug(`Redis URL: ${redisURL}`);
        }

        // 🔐 Vault key verification step
        const validKeys = await verifyVaultKeyPair(client);
        if (!validKeys) {
            printError('❌ Vault JWT key pair validation failed.');
            return false;
        }

        printResult(`✅ Connected to Redis`);
        return { client };
    } catch (err) {
        printError('❌ Redis connection failed.');
        printDebug(err.message || 'Unknown Redis error');
        return false;
    }
}
