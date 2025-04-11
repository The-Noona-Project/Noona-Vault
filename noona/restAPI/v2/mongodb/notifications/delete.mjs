// ✅ /noona/restAPI/v2/mongodb/notifications/delete.mjs

import express from 'express';
import { getMongoDb } from '../../../../../database/mongo/initMongo.mjs';

const router = express.Router();

/**
 * DELETE /v2/mongodb/notifications/delete
 */
router.delete('/', async (req, res) => {
    const db = getMongoDb();
    if (!db) return res.status(503).json({ success: false, message: 'MongoDB not available' });

    try {
        const result = await db.collection('kavitaNotifications').deleteOne({ type: 'kavitaNotifiedIds' });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'No record found to delete' });
        }

        res.status(200).json({ success: true, message: 'IDs deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete IDs', error: err.message });
    }
});

export const routeMeta = {
    path: '/v2/mongodb/notifications/delete',
    method: 'DELETE',
    authLevel: 'protected',
    description: 'Deletes the stored notified IDs from MongoDB',
};

export default router;
