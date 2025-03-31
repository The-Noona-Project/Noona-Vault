// /noona/restAPI/v1/crud/crudMongo.mjs

import express from 'express';
import { getMongoDb } from '../../../../database/mongo/getFromMongo.mjs';
import { printDebug, printError } from '../../../logger/logUtils.mjs';

const router = express.Router();

router.post('/mongo/:collection/:action', async (req, res) => {
    const { collection: collectionName, action } = req.params;
    const payload = req.body;

    if (!collectionName || !action) {
        return res.status(400).json({
            success: false,
            msg: 'Missing collection or action in route'
        });
    }

    const db = getMongoDb();
    if (!db) {
        printError('❌ MongoDB connection not available');
        return res.status(503).json({
            success: false,
            msg: 'Database connection unavailable'
        });
    }

    try {
        const collection = db.collection(collectionName);
        let result;

        switch (action.toLowerCase()) {
            case 'create': {
                result = await collection.insertOne(payload);
                return res.status(201).json({
                    success: true,
                    insertedId: result.insertedId
                });
            }
            case 'read': {
                const query = payload?.filter || {};
                const docs = await collection.find(query).toArray();
                return res.status(200).json({
                    success: true,
                    count: docs.length,
                    results: docs
                });
            }
            case 'update': {
                const { filter = {}, update = {} } = payload || {};
                result = await collection.updateMany(filter, { $set: update });
                return res.status(200).json({
                    success: true,
                    matchedCount: result.matchedCount,
                    modifiedCount: result.modifiedCount
                });
            }
            case 'delete': {
                const query = payload?.filter || {};
                result = await collection.deleteMany(query);
                return res.status(200).json({
                    success: true,
                    deletedCount: result.deletedCount
                });
            }
            default:
                return res.status(400).json({
                    success: false,
                    msg: `Unsupported action: ${action}`
                });
        }
    } catch (err) {
        printError(`[Mongo] ${action.toUpperCase()} failed on ${collectionName}: ${err.message}`);
        return res.status(500).json({
            success: false,
            msg: `MongoDB ${action} operation failed`
        });
    }
});

export default router;
