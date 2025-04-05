// /database/mariadb/connectMariadb.mjs

import mysql from 'mysql2/promise';
import { printSection, printResult, printError, printDebug } from '../../noona/logger/logUtils.mjs';

/**
 * Delays execution for the given number of milliseconds.
 * @param {number} ms - Milliseconds to delay.
 * @returns {Promise<void>}
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function connectMariadb() {
    const host = process.env.MARIADB_HOST || 'localhost';
    const port = Number(process.env.MARIADB_PORT || 3306);
    const user = process.env.MARIADB_USER || 'root';
    const password = process.env.MARIADB_PASSWORD || '';
    const database = process.env.MARIADB_DATABASE || 'noona';

    printSection('MariaDB');
    printDebug(`Host: ${host}`);
    printDebug(`Port: ${port}`);
    printDebug(`User: ${user}`);
    printDebug(`Database: ${database}`);

    const maxRetries = 5;
    let attempt = 0;
    let connection = null;

    while (attempt < maxRetries) {
        try {
            connection = await mysql.createConnection({
                host,
                port,
                user,
                password,
                database
            });
            await connection.ping();
            printResult(`✅ Connected to ${host}:${port} [${database}]`);
            return connection;
        } catch (error) {
            attempt++;
            printError(`❌ MariaDB connection failed on attempt ${attempt}: ${error.message}`);
            if (attempt >= maxRetries) {
                printError('❌ MariaDB connection failed after maximum retries.');
                return null;
            }
            printDebug(`Retrying connection in 5000ms...`);
            await delay(5000);
        }
    }

    return connection;
}
