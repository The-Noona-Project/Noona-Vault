// /restAPI/v2/mongodb/notifications/read/readIds.mjs
import { getMongoDb } from '../../../../../../database/mongo/initMongo.mjs';

export const routeMeta = {
    method: 'GET',
    path: '/v2/mongodb/notifications/read/ids',
    authLevel: 'protected',
};

export default async function handler(req, res) {
    const db = getMongoDb();
    if (!db) return res.status(503).json({ success: false, message: 'MongoDB not available' });

    try {
        const record = await db.collection('kavitaNotifications').findOne({ type: 'kavitaNotifiedIds' });
        const ids = record?.ids || [];

        res.status(200).json({ success: true, ids });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch IDs', error: err.message });
    }
}
