// /database/mongo/getFromMongo.mjs

import { getMongoDb } from './initMongo.mjs';
import { printDebug, printError } from '../../noona/logger/logUtils.mjs';

/**
 * Retrieves documents from the specified MongoDB collection using the provided filter.
 *
 * @param {string} collectionName - The name of the collection to query.
 * @param {object} [filter={}] - Query filter criteria.
 * @returns {Promise<Array|null>} - An array of documents if successful; otherwise, null.
 */
export async function getFromMongo(collectionName, filter = {}) {
    const db = getMongoDb();
    if (!db) {
        printError('[Mongo] Database not connected');
        return null;
    }
    try {
        const collection = db.collection(collectionName);
        const docs = await collection.find(filter).toArray();
        printDebug(`[Mongo] Fetched ${docs.length} documents from "${collectionName}"`);
        return docs;
    } catch (err) {
        printError(`[Mongo] Failed to fetch documents from "${collectionName}": ${err.message}`);
        return null;
    }
}
