import express from 'express';
import { printDebug, printError } from '../../../../../logger/logUtils.mjs';

const router = express.Router();

/**
 * Deletes the stored public key for a given service.
 * @param {string} service - Service name
 * @returns {Promise<boolean>} Success flag
 */
export async function handleDeleteKey(service) {
    const client = global.noonaRedisClient;
    const keyName = `NOONA:TOKEN:${service}`;
    if (!client) throw new Error('Redis unavailable');

    try {
        const deleted = await client.del(keyName);
        if (!deleted) {
            printError(`[Vault] ❌ No key to delete for ${service}`);
            return false;
        }
        printDebug(`[Vault] 🗑️ Deleted public key for ${service}`);
        return true;
    } catch (err) {
        printError(`[Vault] ❌ Failed to delete key for ${service}: ${err.message}`);
        return false;
    }
}

/**
 * DELETE /v2/redis/publicKey/delete/:service
 */
router.delete('/:service', async (req, res) => {
    const { service } = req.params;
    const ok = await handleDeleteKey(service);

    if (!ok) {
        return res.status(404).json({ success: false, msg: 'Key not found or failed to delete' });
    }

    return res.status(200).json({
        success: true,
        msg: `Key deleted for ${service}`,
        keyName: `NOONA:TOKEN:${service}`,
    });
});

export const routeMeta = {
    path: '/v2/redis/publicKey/delete/:service',
    authLevel: 'public',
    description: 'Delete the stored public key for a service',
};

export default router;
