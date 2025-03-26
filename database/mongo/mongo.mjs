// ✅ /database/mongo/mongo.mjs

import mongoose from 'mongoose';
import {
    printSection,
    printResult,
    printError,
    printDebug
} from '../../noona/logger/logUtils.mjs';

let mongoDb = null;
const isDev = process.env.NODE_ENV === 'development';

/**
 * Initializes MongoDB using Mongoose with optional admin authentication.
 *
 * @returns {Promise<{ client: typeof mongoose, db: object } | false>}
 */
export default async function initMongo() {
    let mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/noona';

    // Append authSource=admin if not already present
    if (!mongoURL.includes('authSource=')) {
        const separator = mongoURL.includes('?') ? '&' : '?';
        mongoURL += `${separator}authSource=admin`;
    }

    printSection('MongoDB');
    if (isDev) printDebug(`MongoDB URL → ${mongoURL}`);

    try {
        const client = await mongoose.connect(mongoURL, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 10000,
            maxPoolSize: 10
        });

        // Connection listeners
        mongoose.connection.on('error', (err) => {
            printError(`[MongoDB] Connection error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            printError('[MongoDB] Disconnected.');
        });

        mongoDb = mongoose.connection.db;
        printResult(`✅ Connected to MongoDB at ${mongoURL}`);
        return { client, db: mongoDb };
    } catch (err) {
        printError('❌ Failed to connect to MongoDB.');
        printDebug(`Authentication failed. Reason → ${err.message}`);
        return false;
    }
}

/**
 * Access the connected MongoDB instance directly.
 * @returns {object|null}
 */
export function getMongoDb() {
    return mongoDb;
}
