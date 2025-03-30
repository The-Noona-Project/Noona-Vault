// /database/mongo/connectMongo.mjs

import { getMongoDb } from './initMongo.mjs';

/**
 * Returns the connected MongoDB database instance.
 * This function assumes that initMongo.mjs has been called to establish the connection.
 *
 * @returns {object|null} The connected MongoDB instance.
 */
export async function connectToMongo() {
    return getMongoDb();
}
