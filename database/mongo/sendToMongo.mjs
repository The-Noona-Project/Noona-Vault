// /database/mongo/getFromMongo.mjs

import { getMongoDb } from './initMongo.mjs';
import { printDebug, printError } from '../../noona/logger/logUtils.mjs';

/**
 * Retrieves documents from a MongoDB collection that match the provided filter.
 *
 * This asynchronous function obtains a database connection and attempts to query
 * the specified collection using the given filter criteria. If the database connection
 * is unavailable or an error occurs during the query, the function logs an error and returns null.
 *
 * @param {string} collectionName - The name of the MongoDB collection to query.
 * @param {object} [filter={}] - Optional filter criteria for selecting documents.
 * @returns {Promise<Array|null>} A promise that resolves to an array of documents if successful; otherwise, null.
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
