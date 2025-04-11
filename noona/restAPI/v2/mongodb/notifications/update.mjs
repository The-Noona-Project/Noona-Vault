// ✅ /noona/restAPI/v2/mongodb/notifications/update.mjs

import express from 'express';
import { getMongoDb } from '../../../../../database/mongo/initMongo.mjs';

const router = express.Router();

/**
 * PUT /v2/mongodb/notifications/update
 * Body: { ids: [ ... ] }
 */
router.put('/', async (req, res) => {
    const db = getMongoDb();
    if (!db) return res.status(503).json({ success: false, message: 'MongoDB not available' });

    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ success: false, message: 'ids must be an array' });
        }

        const existing = await db.collection('kavitaNotifications').findOne({ type: 'kavitaNotifiedIds' });
        const current = Array.isArray(existing?.ids) ? existing.ids : [];

        const merged = Array.from(new Set([...current, ...ids]));

        await db.collection('kavitaNotifications').updateOne(
            { type: 'kavitaNotifiedIds' },
            { $set: { ids: merged, updatedAt: new Date() } },
            { upsert: true }
        );

        res.status(200).json({ success: true, message: 'IDs merged successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update IDs', error: err.message });
    }
});

export const routeMeta = {
    path: '/v2/mongodb/notifications/update',
    method: 'PUT',
    authLevel: 'protected',
    description: 'Merges new IDs with existing notified IDs in MongoDB',
};

export default router;
