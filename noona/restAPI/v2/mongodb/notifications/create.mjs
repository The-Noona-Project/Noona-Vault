// ✅ /noona/restAPI/v2/mongodb/notifications/create.mjs

import express from 'express';
import { getMongoDb } from '../../../../../database/mongo/initMongo.mjs';

const router = express.Router();

/**
 * POST /v2/mongodb/notifications/create
 * Body: { ids: [ ... ] }
 */
router.post('/', async (req, res) => {
    const db = getMongoDb();
    if (!db) return res.status(503).json({ success: false, message: 'MongoDB not available' });

    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ success: false, message: 'ids must be an array' });
        }

        await db.collection('kavitaNotifications').updateOne(
            { type: 'kavitaNotifiedIds' },
            { $set: { ids, updatedAt: new Date() } },
            { upsert: true }
        );

        res.status(200).json({ success: true, message: 'IDs stored successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to store IDs', error: err.message });
    }
});

export const routeMeta = {
    path: '/v2/mongodb/notifications/create',
    method: 'POST',
    authLevel: 'protected',
    description: 'Stores a list of notified item IDs in MongoDB',
};

export default router;
