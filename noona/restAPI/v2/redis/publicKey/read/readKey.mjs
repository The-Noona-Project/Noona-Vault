import express from 'express';
import { getFromRedis } from '../../../../../../database/redis/getFromRedis.mjs';
import { printDebug, printError } from '../../../../../logger/logUtils.mjs';

const router = express.Router();

/**
 * Retrieves the public key for a given service from Redis.
 * @param {string} service - Service name
 * @returns {Promise<string|null>} The public key or null if not found
 */
export async function handleReadKey(service) {
    const client = global.noonaRedisClient;
    const keyName = `NOONA:TOKEN:${service}`;
    if (!client) throw new Error('Redis unavailable');
    try {
        const key = await getFromRedis(client, keyName);
        if (!key) {
            printError(`[Vault] ❌ Key not found for ${service}`);
            return null;
        }
        printDebug(`[Vault] ✅ Key read for ${service}`);
        return key;
    } catch (err) {
        printError(`[Vault] ❌ Failed to read key for ${service}: ${err.message}`);
        return null;
    }
}

/**
 * GET /v2/redis/publicKey/read/:service
 */
router.get('/:service', async (req, res) => {
    const { service } = req.params;
    const key = await handleReadKey(service);

    if (!key) {
        return res.status(404).json({ success: false, msg: 'Key not found' });
    }

    return res.status(200).json({
        success: true,
        publicKey: key,
        metadata: {
            format: 'PEM',
            length: key.length,
            source: 'Redis',
            keyName: `NOONA:TOKEN:${service}`,
        }
    });
});

export const routeMeta = {
    path: '/v2/redis/publicKey/read/:service',
    authLevel: 'public',
    description: 'Get the stored public key for a service',
};

export default router;
