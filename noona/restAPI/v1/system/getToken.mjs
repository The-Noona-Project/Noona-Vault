// /noona/restAPI/v1/system/getToken.mjs

import express from 'express';
import { getFromRedis } from '../../../../database/redis/getFromRedis.mjs';
import { printDebug, printError } from '../../../logger/logUtils.mjs';

const router = express.Router();

/**
 * GET /v1/system/token
 * Public route — returns the public JWT key stored in Redis.
 */
router.get('/', async (req, res) => {
    printDebug('[System] 🔑 Received request for public JWT key');

    const client = global.noonaRedisClient?.client;
    if (!client) {
        printError('[System] ❌ Redis unavailable during token fetch');
        return res.status(503).json({
            success: false,
            msg: 'Vault Redis unavailable'
        });
    }

    try {
        const publicKey = await getFromRedis(client, 'NOONA:JWT:PUBLIC_KEY');
        if (!publicKey) {
            printError('[System] ❌ Public key not found in Redis');
            return res.status(404).json({
                success: false,
                msg: 'Public key not found'
            });
        }

        printDebug('[System] ✅ Public JWT key retrieved successfully');
        return res.status(200).json({
            success: true,
            publicKey,
            metadata: {
                format: 'PEM',
                length: publicKey.length,
                source: 'Redis',
                keyName: 'NOONA:JWT:PUBLIC_KEY'
            }
        });
    } catch (err) {
        printError(`[System] ❌ Failed to fetch token: ${err.message}`);
        return res.status(500).json({
            success: false,
            msg: 'Unexpected error while retrieving token'
        });
    }
});

/**
 * Route metadata — used by dynamic router to mount this file.
 */
export const routeMeta = {
    path: '/v1/system/token',
    authLevel: 'public',
    description: 'Returns the public JWT key used by Vault for verifying tokens'
};

export default router;
