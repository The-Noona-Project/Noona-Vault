// /restAPI/v2/mongodb/notifications/update/updateIds.mjs
import { getMongoDb } from '../../../../../../database/mongo/initMongo.mjs';

export const routeMeta = {
    method: 'PUT',
    path: '/v2/mongodb/notifications/update/ids',
    authLevel: 'protected',
};

export default async function handler(req, res) {
    const db = getMongoDb();
    if (!db) return res.status(503).json({ success: false, message: 'MongoDB not available' });

    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) return res.status(400).json({ success: false, message: 'ids must be an array' });

        const existing = await db.collection('kavitaNotifications').findOne({ type: 'kavitaNotifiedIds' });
        const current = Array.isArray(existing?.ids) ? existing.ids : [];

        const merged = Array.from(new Set([...current, ...ids]));

        await db.collection('kavitaNotifications').updateOne(
            { type: 'kavitaNotifiedIds' },
            { $set: { ids: merged, updatedAt: new Date() } },
            { upsert: true }
        );

        res.status(200).json({ success: true, message: 'IDs merged successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update IDs', error: err.message });
    }
}
