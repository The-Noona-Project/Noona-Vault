// /noona/restAPI/v1/notifications/kavita/postIds.mjs

import express from 'express';
import { getMongoDb } from '../../../../../../database/mongo/initMongo.mjs';
import { printError } from '../../../../noona/logger/logUtils.mjs';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ success: false, message: 'Invalid format: ids must be an array' });
        }

        const db = getMongoDb();
        if (!db) return res.status(503).json({ success: false, message: 'Database connection unavailable' });

        await db.collection('kavitaNotifications').updateOne(
            { type: 'kavitaNotifiedIds' },
            { $set: { ids, updatedAt: new Date() } },
            { upsert: true }
        );

        res.status(200).json({
            success: true,
            status: 'ok',
            message: 'Notified IDs saved successfully'
        });
    } catch (err) {
        printError(`Failed to save Kavita notified IDs: ${err.message}`);
        res.status(500).json({ success: false, message: 'Failed to save notified IDs' });
    }
});

export const routeMeta = {
    path: '/v1/notifications/kavita',
    method: 'POST',
    authLevel: 'protected',
    description: 'Updates or replaces the list of Kavita notification IDs'
};

export default router;
