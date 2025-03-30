// /noona/restAPI/v1/crud/crudRedis.mjs

import express from 'express';
import { printDebug, printError } from '../../../logger/logUtils.mjs';

const router = express.Router();

/**
 * CRUD operations for Redis.
 *
 * Endpoint: POST /v1/crud/redis/:key/:action
 *
 * Required headers:
 *   - fromto: string (required)
 *   - time: string (required)
 *
 * Request Body:
 *   - For "write": { value: "..." }
 *
 * Supported Actions:
 *   - read: Retrieves the value for the given key.
 *   - write: Sets the value for the given key.
 *   - delete: Removes the given key.
 */
router.post('/redis/:key/:action', async (req, res) => {
    const { key, action } = req.params;
    const { fromto, time } = req.headers;
    const { value } = req.body;

    if (!fromto || !time) {
        return res.status(400).json({ success: false, msg: 'Missing required headers (fromto, time)' });
    }
    if (!key || !action) {
        return res.status(400).json({ success: false, msg: 'Missing key or action in route' });
    }

    // Get the Redis client from global (set during initialization)
    const client = global.noonaRedisClient;
    if (!client) {
        printError('❌ Redis client not available');
        return res.status(503).json({ success: false, msg: 'Redis connection unavailable' });
    }

    try {
        let result;
        switch (action.toLowerCase()) {
            case 'read':
                result = await client.get(key);
                printDebug(`Redis read: key=${key}, value=${result}`);
                return res.status(200).json({ success: true, key, value: result });
            case 'write':
                if (typeof value === 'undefined') {
                    return res.status(400).json({ success: false, msg: 'Missing "value" in request body for write operation' });
                }
                result = await client.set(key, value);
                printDebug(`Redis write: key=${key}, value=${value}`);
                return res.status(201).json({ success: true, key, result });
            case 'delete':
                result = await client.del(key);
                printDebug(`Redis delete: key=${key}, deletedCount=${result}`);
                return res.status(200).json({ success: true, key, deletedCount: result });
            default:
                return res.status(400).json({ success: false, msg: `Unsupported action: ${action}` });
        }
    } catch (err) {
        printError(`Redis ${action} operation failed: ${err.message}`);
        return res.status(500).json({ success: false, msg: `Redis ${action} operation failed: ${err.message}` });
    }
});

export default router;
