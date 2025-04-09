import express from 'express';
import { sendToRedis } from '../../../../../../database/redis/sendToRedis.mjs';
import { printDebug, printError } from '../../../../../logger/logUtils.mjs';

const router = express.Router();

/**
 * Updates (overwrites) the public key for a service.
 * @param {string} service - Service name
 * @param {string} publicKey - New public key
 * @returns {Promise<boolean>} Success flag
 */
export async function handleUpdateKey(service, publicKey) {
    const client = global.noonaRedisClient;
    const keyName = `NOONA:TOKEN:${service}`;
    if (!client) throw new Error('Redis unavailable');

    try {
        await sendToRedis(client, keyName, publicKey);
        printDebug(`[Vault] 🔄 Public key updated for ${service}`);
        return true;
    } catch (err) {
        printError(`[Vault] ❌ Failed to update key for ${service}: ${err.message}`);
        return false;
    }
}

/**
 * PUT /v2/redis/publicKey/update/:service
 */
router.put('/:service', async (req, res) => {
    const { service } = req.params;
    const { publicKey } = req.body;

    if (!publicKey) {
        return res.status(400).json({ success: false, msg: 'Missing publicKey' });
    }

    const ok = await handleUpdateKey(service, publicKey);
    if (!ok) return res.status(500).json({ success: false, msg: 'Update failed' });

    return res.status(200).json({
        success: true,
        msg: `Public key updated for ${service}`,
        keyName: `NOONA:TOKEN:${service}`,
    });
});

export const routeMeta = {
    path: '/v2/redis/publicKey/update/:service',
    authLevel: 'public',
    description: 'Update the stored public key for a service',
};

export default router;
