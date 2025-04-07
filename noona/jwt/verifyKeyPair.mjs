// /noona/jwt/verifyKeyPair.mjs

import jwt from 'jsonwebtoken';
import { getFromRedis } from '../../database/redis/getFromRedis.mjs';
import {
    printDebug,
    printError,
    printResult
} from '../logger/logUtils.mjs';

/**
 * Verifies Vault's private key matches the public key stored in Redis.
 * Returns true if valid, false if mismatch or missing keys.
 *
 * @param {object} redisClient - Connected Redis client (from global.noonaRedisClient)
 * @returns {Promise<boolean>}
 */
export async function verifyVaultKeyPair(redisClient) {
    const serviceName = 'noona-vault';
    const redisKey = `NOONA:KEY:${serviceName}:PUBLIC`;

    printDebug('[KEYCHECK] Verifying Vault public/private key pair...');

    // Step 1: Fetch the public key from Redis
    const publicKey = await getFromRedis(redisClient, redisKey);
    if (!publicKey) {
        printError(`[KEYCHECK] ❌ Missing public key in Redis at: ${redisKey}`);
        return false;
    }

    // Step 2: Get private key from env
    const privateKey = process.env.JWT_PRIVATE_KEY;
    if (!privateKey) {
        printError('[KEYCHECK] ❌ JWT_PRIVATE_KEY not set in environment');
        return false;
    }

    try {
        // Step 3: Sign and verify test token
        const token = jwt.sign({ check: 'noona' }, privateKey, {
            algorithm: 'RS256',
            expiresIn: '30s'
        });

        jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        printResult('✅ [KEYCHECK] Vault JWT key pair is valid');
        return true;
    } catch (err) {
        printError(`[KEYCHECK] ❌ JWT key mismatch: ${err.message}`);
        return false;
    }
}
