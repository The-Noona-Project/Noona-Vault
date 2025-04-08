// /noona/restAPI/v1/notifications/kavita/getIds.mjs

import express from 'express';
import { getMongoDb } from '../../../../database/mongo/initMongo.mjs';
import { printError } from '../../../../noona/logger/logUtils.mjs';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = getMongoDb();
        if (!db) return res.status(503).json({ success: false, message: 'Database connection unavailable' });

        const record = await db.collection('kavitaNotifications').findOne({ type: 'kavitaNotifiedIds' });
        const ids = Array.isArray(record?.ids) ? record.ids : [];

        res.status(200).json({
            success: true,
            status: 'ok',
            notifiedIds: ids
        });
    } catch (err) {
        printError(`Failed to retrieve Kavita notified IDs: ${err.message}`);
        res.status(500).json({ success: false, message: 'Failed to retrieve notified IDs' });
    }
});

export const routeMeta = {
    path: '/v1/notifications/kavita',
    method: 'GET',
    authLevel: 'protected',
    description: 'Returns the current list of Kavita notification IDs'
};

export default router;
