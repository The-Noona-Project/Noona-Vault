// /database/databaseManager.mjs

import chalk from 'chalk';
import initMongo from './mongo/mongo.mjs';
import initRedis from './redis/redis.mjs';
import initMariaDB from './mariadb/mariadb.mjs';
import initMilvus from './milvus/milvus.mjs';

/**
 * Initializes all database modules and prints status.
 *
 * @returns {Promise<void>}
 */
export async function initializeDatabases() {
    console.log(chalk.yellowBright('[Noona-Vault] 🔌 Beginning database initialization...\n'));

    const results = [];

    results.push(await initialize('MongoDB', initMongo));
    results.push(await initialize('Redis', initRedis));
    results.push(await initialize('MariaDB', initMariaDB));
    results.push(await initialize('Milvus', initMilvus));

    const total = results.length;
    const success = results.filter(Boolean).length;

    const statusLine = `[Noona-Vault] ⚙️ Database initialization complete (${success}/${total} successful)\n`;
    console.log(success === total ? chalk.green(statusLine) : chalk.yellow(statusLine));
}

/**
 * Wrapper to run a database initializer with logs.
 *
 * @param {string} name - DB display name
 * @param {Function} initFunction - DB initializer (returns boolean)
 * @returns {Promise<boolean>}
 */
async function initialize(name, initFunction) {
    console.log(chalk.cyan(`[Init] Starting ${name}...`));

    try {
        const success = await initFunction();

        if (success) {
            console.log(chalk.green(`[Init] ✅ ${name} initialized successfully.`));
        } else {
            console.warn(chalk.red(`[Init] ❌ ${name} failed to initialize.`));
        }

        return success;
    } catch (err) {
        console.warn(chalk.red(`[Init] ❌ ${name} threw an exception.`));
        console.warn(chalk.gray(`[Init] Reason: ${err?.message || err}`));
        return false;
    } finally {
        console.log(chalk.gray('----------------------------------------'));
    }
}
