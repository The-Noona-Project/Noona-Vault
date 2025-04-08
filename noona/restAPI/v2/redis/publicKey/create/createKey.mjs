// /noona/restAPI/v2/redis/publicKey/create/createKey.mjs

import express from 'express';
import { sendToRedis } from '../../../../../../database/redis/sendToRedis.mjs';
import { printDebug, printError } from '../../../../logger/logUtils.mjs';
import { generateKeyPair } from '../../../../jwt/generateKeyPair.mjs';

const router = express.Router();

/**
 * Generates and stores a public key for a specific service in Redis.
 *
 * @param {string} service - The service name (e.g., "noona-portal")
 * @returns {Promise<{ success: boolean, publicKey?: string }>}
 */
export async function handleCreateKey(service) {
    const client = global.noonaRedisClient;
    const keyName = `NOONA:TOKEN:${service}`;

    if (!client) {
        printError('[Vault] ❌ Redis client unavailable');
        return { success: false };
    }

    try {
        const { publicKey } = await generateKeyPair();
        await sendToRedis(client, keyName, publicKey);
        printDebug(`[Vault] 🔐 Public key generated and stored for ${service}`);
        return { success: true, publicKey };
    } catch (err) {
        printError(`[Vault] ❌ Failed to generate/store key for ${service}: ${err.message}`);
        return { success: false };
    }
}

/**
 * POST /v2/redis/publicKey/create
 * Body: { service: "noona-portal" }
 */
router.post('/', async (req, res) => {
    const { service } = req.body;

    if (!service) {
        printError('[Vault] ❌ Missing service name in request body');
        return res.status(400).json({
            success: false,
            msg: 'Missing required field: service'
        });
    }

    const { success, publicKey } = await handleCreateKey(service);

    if (!success) {
        return res.status(500).json({
            success: false,
            msg: 'Failed to generate/store public key'
        });
    }

    return res.status(201).json({
        success: true,
        msg: `Public key generated and stored for ${service}`,
        publicKey,
        keyName: `NOONA:TOKEN:${service}`
    });
});

export const routeMeta = {
    path: '/v2/redis/publicKey/create',
    authLevel: 'public',
    description: 'Generates and stores a public key for a service',
};

export default router;
