// /database/mariadb/initMariadb.mjs

import connectMariadb from './connectMariadb.mjs';
import { printError } from '../../noona/logger/logUtils.mjs';

/**
 * Attempts to establish a connection to a MariaDB database.
 *
 * This asynchronous function invokes `connectMariadb` to create a database connection. If a connection is successfully established, it returns an object containing the connection; otherwise, it logs an error using `printError` and returns false.
 *
 * @returns {Promise<{connection: object} | false>} A promise that resolves to an object with the database connection if successful, or false if the connection failed.
 */
export default async function initMariaDB() {
    const connection = await connectMariadb();
    if (!connection) {
        printError('❌ Failed to initialize MariaDB connection.');
        return false;
    }
    return { connection };
}
