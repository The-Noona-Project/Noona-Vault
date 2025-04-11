// ✅ /noona/restAPI/v2/mongodb/notifications/read.mjs

import express from 'express';
import { getMongoDb } from '../../../../../database/mongo/initMongo.mjs';

const router = express.Router();

/**
 * GET /v2/mongodb/notifications/read
 */
router.get('/', async (req, res) => {
    const db = getMongoDb();
    if (!db) return res.status(503).json({ success: false, message: 'MongoDB not available' });

    try {
        const record = await db.collection('kavitaNotifications').findOne({ type: 'kavitaNotifiedIds' });
        const ids = record?.ids || [];

        res.status(200).json({ success: true, ids });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch IDs', error: err.message });
    }
});

export const routeMeta = {
    path: '/v2/mongodb/notifications/read',
    method: 'GET',
    authLevel: 'protected',
    description: 'Reads the current list of notified item IDs from MongoDB',
};

export default router;
