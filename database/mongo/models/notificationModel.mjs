// /database/mongo/models/notificationModel.mjs

/**
 * Returns the MongoDB collection for library notifications.
 * This fetches the DB connection dynamically to avoid undefined errors.
 *
 * @throws {Error} If MongoDB is not initialized.
 * @returns {Collection} MongoDB collection instance
 */
export function getNotificationModel() {
    const db = global.noonaMongo?.db;
    if (!db) throw new Error('MongoDB is not initialized yet (noonaMongo.db is undefined)');

    return db.collection('library_notifications');
}