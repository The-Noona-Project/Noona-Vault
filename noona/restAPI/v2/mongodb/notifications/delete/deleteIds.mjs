// /restAPI/v2/mongodb/notifications/delete/deleteIds.mjs
import { getMongoDb } from '../../../../../../database/mongo/initMongo.mjs';

export const routeMeta = {
    method: 'DELETE',
    path: '/v2/mongodb/notifications/delete/ids',
    authLevel: 'protected',
};

export default async function handler(req, res) {
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
}
