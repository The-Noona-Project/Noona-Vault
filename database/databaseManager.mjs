// ✅ /database/databaseManager.mjs

import initMongo from './mongo/mongo.mjs';
import initRedis from './redis/redis.mjs';
import initMariaDB from './mariadb/mariadb.mjs';
import initMilvus from './milvus/milvus.mjs';
import { printDbSummary } from './utils/printDbSummary.mjs';
import chalk from 'chalk';

/**
 * Prints the start block for each database section.
 * @param {string} name
 */
function printBlockStart(name) {
    console.log(chalk.gray('----------------------------------------'));
    console.log(chalk.cyan(`[Init] Starting ${name}...`));
}

/**
 * Shortens a long connection string for log display.
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
function shorten(str = '', max = 35) {
    return str.length > max ? str.slice(0, 15) + '…' + str.slice(-15) : str;
}

/**
 * Initializes all configured databases and sets globals for shutdown.
 * @returns {Promise<void>}
 */
export async function initializeDatabases() {
    const results = [];

    printBlockStart('MongoDB');
    const mongo = await initMongo();
    results.push({
        name: 'MongoDB',
        status: mongo,
        info: shorten(process.env.MONGO_URL || 'localhost:27017/noona')
    });

    if (mongo?.client) {
        global.noonaMongoClient = mongo.client;
    }

    printBlockStart('Redis');
    const redis = await initRedis();
    results.push({
        name: 'Redis',
        status: redis,
        info: `${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
    });

    if (redis?.client) {
        global.noonaRedisClient = redis.client;
    }

    printBlockStart('MariaDB');
    const mariadb = await initMariaDB();
    results.push({
        name: 'MariaDB',
        status: mariadb,
        info: `${process.env.MARIADB_USER || 'root'}@${process.env.MARIADB_HOST || 'localhost'}:${process.env.MARIADB_PORT || 3306}`
    });

    if (mariadb?.connection) {
        global.noonaMariaConnection = mariadb.connection;
    }

    printBlockStart('Milvus');
    const milvus = await initMilvus();
    results.push({
        name: 'Milvus',
        status: milvus,
        info: process.env.MILVUS_ADDRESS || 'localhost:19530'
    });

    if (milvus?.client) {
        global.noonaMilvusClient = milvus.client;
    }

    console.log(chalk.gray('----------------------------------------'));
    printDbSummary(results);
}
