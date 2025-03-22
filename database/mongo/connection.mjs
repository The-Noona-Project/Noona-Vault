import { getMongoDb } from './mongo.mjs';

/**
 * Connect to MongoDB and return the database instance
 * @returns {Promise<object>} MongoDB database instance
 */
export async function connectToMongo() {
    return getMongoDb();
} 