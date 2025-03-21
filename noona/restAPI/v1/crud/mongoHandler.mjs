import { getMongoDb } from '../../../../database/mongo/mongo.mjs';

export async function handleMongoAction({ action, target, payload }) {
    const db = getMongoDb();
    const collection = db.collection(target);

    try {
        switch (action) {
            case 'create':
                const insertResult = await collection.insertOne(payload);
                return {
                    status: 201,
                    body: { success: true, insertedId: insertResult.insertedId }
                };

            case 'read':
                const docs = await collection.find(payload || {}).toArray();
                return {
                    status: 200,
                    body: { success: true, results: docs }
                };

            case 'update':
                const { filter = {}, update = {} } = payload;
                const updateResult = await collection.updateMany(filter, { $set: update });
                return {
                    status: 200,
                    body: {
                        success: true,
                        matchedCount: updateResult.matchedCount,
                        modifiedCount: updateResult.modifiedCount
                    }
                };

            case 'delete':
                const deleteResult = await collection.deleteMany(payload);
                return {
                    status: 200,
                    body: {
                        success: true,
                        deletedCount: deleteResult.deletedCount
                    }
                };

            default:
                return {
                    status: 400,
                    body: { success: false, error: `Unknown action: ${action}` }
                };
        }
    } catch (err) {
        console.error(`[MongoHandler] ❌ Error processing ${action} on ${target}:`, err);
        return {
            status: 500,
            body: { success: false, error: 'MongoDB operation failed' }
        };
    }
}
