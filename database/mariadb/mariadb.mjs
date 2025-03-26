// ✅ /database/mariadb/mariadb.mjs

import mysql from 'mysql2/promise';
import {
    printSection,
    printResult,
    printError,
    printDebug
} from '../../noona/logger/logUtils.mjs';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Initializes a MariaDB connection using mysql2/promise.
 * On success, returns { connection }, else false.
 *
 * @returns {Promise<{ connection: import('mysql2/promise').Connection } | false>}
 */
export default async function initMariaDB() {
    const host = process.env.MARIADB_HOST || 'localhost';
    const port = Number(process.env.MARIADB_PORT || 3306);
    const user = process.env.MARIADB_USER || 'root';
    const password = process.env.MARIADB_PASSWORD || '';
    const database = process.env.MARIADB_DATABASE || 'noona';

    printSection('MariaDB');

    if (isDev) {
        printDebug(`Host: ${host}`);
        printDebug(`Port: ${port}`);
        printDebug(`User: ${user}`);
        printDebug(`Database: ${database}`);
    }

    try {
        const connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
            database
        });

        await connection.ping();
        printResult(`✅ Connected to ${host}:${port} [${database}]`);

        return { connection };
    } catch (error) {
        printError('❌ MariaDB connection failed.');
        printDebug(error.message);
        return false;
    }
}
