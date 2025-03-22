import { getMongoDb } from '../../../../database/mongo/mongo.mjs';

const COLLECTION_NAME = 'kavitaNotifications';

export async function getKavitaNotifiedIds(req, res) {
    try {
        const db = getMongoDb();
        if (!db) {
            console.error('MongoDB connection not available');
            return res.status(503).json({ 
                success: false, 
                message: 'Database connection unavailable' 
            });
        }
        
        const collection = db.collection(COLLECTION_NAME);
        const record = await collection.findOne({ type: 'kavitaNotifiedIds' });
        
        return res.status(200).json({ 
            success: true, 
            notifiedIds: record?.ids || [] 
        });
    } catch (error) {
        console.error('Error retrieving Kavita notified IDs:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to retrieve notified IDs' 
        });
    }
}

export async function saveKavitaNotifiedIds(req, res) {
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
            console.error('MongoDB connection not available');
            return res.status(503).json({ 
                success: false, 
                message: 'Database connection unavailable' 
            });
        }
        
        const collection = db.collection(COLLECTION_NAME);
        
        await collection.updateOne(
            { type: 'kavitaNotifiedIds' },
            { $set: { ids, updatedAt: new Date() } },
            { upsert: true }
        );
        
        return res.status(200).json({ 
            success: true, 
            message: 'Notified IDs saved successfully' 
        });
    } catch (error) {
        console.error('Error saving Kavita notified IDs:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to save notified IDs' 
        });
    }
} 