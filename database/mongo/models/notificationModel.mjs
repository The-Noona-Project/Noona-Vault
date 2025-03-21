import chalk from 'chalk';
import { getMongoDb } from '../../mongo/mongo.mjs';

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
     * @param {string} batchId - The batch identifier.
     * @param {Array<Object>} items - Array of notified item objects.
     * @returns {Promise<Object>} Result object with success count.
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
            console.error(chalk.red('[MongoDB] Failed to save notification batch:'), err.message);
            return { successCount: 0 }; // Defensive fallback
        }
    }

    /**
     * Retrieves previously stored notification count.
     * @returns {Promise<number>} Number of notifications stored.
     */
    async getStoredNotificationCount() {
        return await this.collection.countDocuments();
    }
}
