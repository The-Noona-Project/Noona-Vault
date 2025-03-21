// /noona/restAPI/v1/notifications/kavita.mjs

import express from 'express';
import { getNotificationModel } from '../../../../database/mongo/models/notificationModel.mjs';
import chalk from 'chalk';

/**
 * Mounts the Kavita notification API routes under /v1/notifications/kavita
 *
 * @param {express.Application} app - The Express app instance
 */
export function mountKavitaNotificationRoutes(app) {
    const router = express.Router();
    const collection = getNotificationModel();

    // Get all notified item IDs
    router.get('/ids', async (req, res) => {
        try {
            const docs = await collection.find({}, { projection: { _id: 0, itemId: 1 } }).toArray();
            const ids = docs.map(doc => doc.itemId);
            res.json(ids);
        } catch (err) {
            console.error(chalk.red('[Kavita Notifications] Failed to fetch IDs:'), err);
            res.status(500).json({ error: 'Failed to fetch notified item IDs.' });
        }
    });

    // Add or update notified item ID
    router.post('/ids', async (req, res) => {
        const { itemId } = req.body;
        if (!itemId) return res.status(400).json({ error: 'Missing itemId in request body' });

        try {
            await collection.updateOne(
                { itemId },
                { $set: { itemId, updatedAt: new Date() } },
                { upsert: true }
            );
            res.json({ message: 'Item saved or updated' });
        } catch (err) {
            console.error(chalk.red('[Kavita Notifications] Failed to save item ID:'), err);
            res.status(500).json({ error: 'Failed to save item ID.' });
        }
    });

    // Delete an item by ID
    router.delete('/ids/:itemId', async (req, res) => {
        const { itemId } = req.params;
        try {
            const result = await collection.deleteOne({ itemId });
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Item not found' });
            }
            res.json({ message: 'Item deleted' });
        } catch (err) {
            console.error(chalk.red('[Kavita Notifications] Failed to delete item ID:'), err);
            res.status(500).json({ error: 'Failed to delete item ID.' });
        }
    });

    app.use('/v1/notifications/kavita', router);
}
