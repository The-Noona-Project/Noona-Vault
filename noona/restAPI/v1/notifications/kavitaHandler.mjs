// ✅ /noona/restAPI/v1/notifications/kavitaHandler.mjs

import express from 'express';
import { getMongoDb } from '../../../../database/mongo/mongo.mjs';
import { printError, printDebug } from '../../../logger/logUtils.mjs';

const router = express.Router();

const COLLECTION_NAME = 'kavitaNotifications';
const DOCUMENT_TYPE = 'kavitaNotifiedIds';

/**
 * GET /v1/notifications/kavita
 * Returns the current list of notified IDs for Kavita.
 */
router.get('/', async (req, res) => {
    try {
        const db = getMongoDb();
        if (!db) {
            printError('MongoDB connection not available');
            return res.status(503).json({ success: false, message: 'Database connection unavailable' });
        }

        const record = await db.collection(COLLECTION_NAME).findOne({ type: DOCUMENT_TYPE });
        const ids = Array.isArray(record?.ids) ? record.ids : [];

        return res.status(200).json({
            success: true,
            status: 'ok',
            notifiedIds: ids
        });
    } catch (error) {
        printError(`Failed to retrieve Kavita notified IDs: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve notified IDs'
        });
    }
});

/**
 * POST /v1/notifications/kavita
 * Replaces the list of notified IDs for Kavita.
 */
router.post('/', async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid format: ids must be an array'
            });
        }

        const db = getMongoDb();
        if (!db) {
            printError('MongoDB connection not available');
            return res.status(503).json({ success: false, message: 'Database connection unavailable' });
        }

        await db.collection(COLLECTION_NAME).updateOne(
            { type: DOCUMENT_TYPE },
            { $set: { ids, updatedAt: new Date() } },
            { upsert: true }
        );

        return res.status(200).json({
            success: true,
            status: 'ok',
            message: 'Notified IDs saved successfully'
        });
    } catch (error) {
        printError(`Failed to save Kavita notified IDs: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Failed to save notified IDs'
        });
    }
});

export default router;
