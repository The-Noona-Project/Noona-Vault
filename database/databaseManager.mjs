// /database/databaseManager.mjs

import initMongo from './mongo/initMongo.mjs';
import initRedis from './redis/initRedis.mjs';
import initMariaDB from './mariadb/initMariadb.mjs';

import { printDbSummary } from '../noona/logger/printDbSummary.mjs';
import { printSection, printDebug, printResult } from '../noona/logger/logUtils.mjs';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Initializes all core databases used by Noona-Vault
 * and assigns global connections.
 */
export async function initializeDatabases() {
    const results = [];

    printSection('🧠 Booting Database Grid');

    // --- MongoDB
    printResult('Connecting to MongoDB...');
    const mongo = await initMongo();
    if (isDev) {
        printDebug(`Mongo URL: ${process.env.MONGO_URL || 'mongodb://localhost:27017/noona'}`);
    }
    results.push({
        name: 'MongoDB',
        status: !!mongo,
        info: process.env.MONGO_URL || 'mongodb://localhost:27017/noona'
    });
    if (mongo?.client) global.noonaMongoClient = mongo.client;

    // --- Redis
    printResult('Connecting to Redis...');
    const redis = await initRedis();
    if (isDev) {
        printDebug(`Redis URL: ${process.env.REDIS_URL || 'redis://localhost:6379'}`);
    }
    results.push({
        name: 'Redis',
        status: !!redis,
        info: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    if (redis?.client) global.noonaRedisClient = redis.client;

    // --- MariaDB
    printResult('Connecting to MariaDB...');
    const mariadb = await initMariaDB();
    if (isDev) {
        printDebug(`MariaDB Host: ${process.env.MARIADB_HOST || 'localhost'}`);
        printDebug(`MariaDB User: ${process.env.MARIADB_USER || 'root'}`);
        printDebug(`MariaDB Port: ${process.env.MARIADB_PORT || '3306'}`);
    }
    results.push({
        name: 'MariaDB',
        status: !!mariadb,
        info: `${process.env.MARIADB_USER || 'root'}@${process.env.MARIADB_HOST || 'localhost'}:${process.env.MARIADB_PORT || 3306}`
    });
    if (mariadb?.connection) global.noonaMariaConnection = mariadb.connection;

    // Final Summary
    printDbSummary(results);
}
