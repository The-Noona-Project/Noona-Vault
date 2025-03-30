// /database/mongo/models/notificationModel.mjs

import { getMongoDb } from '../initMongo.mjs';
import { printError } from '../../../noona/logger/logUtils.mjs';

/**
 * MongoDB model for handling library notification persistence.
 */
export default class NotificationModel {
    constructor() {
        const mongo = getMongoDb();
        if (!mongo) throw new Error('MongoDB not initialized');
        this.collection = mongo.collection('kavita_notifications');
    }

    /**
     * Saves notified item data to MongoDB.
     * @param {string} batchId
     * @param {Array<Object>} items
     * @returns {Promise<Object>} { successCount }
     */
    async saveNotifiedItems(batchId, items) {
        try {
            const docs = items.map(item => ({
                batchId,
                ...item,
                savedAt: new Date()
            }));

            const result = await this.collection.insertMany(docs);
            return { successCount: result.insertedCount || 0 };
        } catch (err) {
            printError('[MongoDB] Failed to save notification batch:');
            printError(err.message);
            return { successCount: 0 };
        }
    }

    /**
     * Returns the number of stored notifications.
     */
    async getStoredNotificationCount() {
        return await this.collection.countDocuments();
    }
}
