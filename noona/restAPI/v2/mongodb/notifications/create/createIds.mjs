// /restAPI/v2/mongodb/notifications/create/createIds.mjs
import { getMongoDb } from '../../../../../../database/mongo/initMongo.mjs';

export const routeMeta = {
    method: 'POST',
    path: '/v2/mongodb/notifications/create/ids',
    authLevel: 'protected',
};

export default async function handler(req, res) {
    const db = getMongoDb();
    if (!db) return res.status(503).json({ success: false, message: 'MongoDB not available' });

    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) return res.status(400).json({ success: false, message: 'ids must be an array' });

        await db.collection('kavitaNotifications').updateOne(
            { type: 'kavitaNotifiedIds' },
            { $set: { ids, updatedAt: new Date() } },
            { upsert: true }
        );

        res.status(200).json({ success: true, message: 'IDs stored successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to store IDs', error: err.message });
    }
}
