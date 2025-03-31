// /database/mariadb/connectMariadb.mjs

import mysql from 'mysql2/promise';
import { printSection, printResult, printError, printDebug } from '../../noona/logger/logUtils.mjs';

/**
 * Establishes an asynchronous connection to a MariaDB database.
 *
 * This function retrieves connection parameters (host, port, user, password, and database) from environment variables,
 * using default values when not provided. It logs the connection details, attempts to create a connection, and verifies it by pinging the database.
 * On success, it returns the MariaDB connection object; if the connection fails, it logs the error and returns null.
 *
 * @returns {Promise<object|null>} A promise that resolves with the MariaDB connection object if successful, or null if the connection fails.
 */
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
        return connection;
    } catch (error) {
        printError('❌ MariaDB connection failed.');
        printDebug(error.message);
        return null;
    }
}
