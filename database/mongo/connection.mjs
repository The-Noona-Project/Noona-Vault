// /database/mongo/connection.mjs

import { getMongoDb } from './mongo.mjs';

/**
 * Returns the connected MongoDB database instance.
 */
export async function connectToMongo() {
    return getMongoDb();
}
