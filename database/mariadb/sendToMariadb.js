// /database/mariadb/sendToMariadb.js

import { printResult, printError, printDebug } from '../../noona/logger/logUtils.mjs';

/**
 * Executes an INSERT, UPDATE, or DELETE query against MariaDB.
 *
 * @param {import('mysql2/promise').Connection} connection - MariaDB connection instance.
 * @param {string} query - The SQL query string.
 * @param {Array} [values=[]] - Values for the parameterized query.
 * @returns {Promise<object|false>} - The result object if successful; otherwise, false.
 */
export async function sendToMariadb(connection, query, values = []) {
    if (!connection) {
        printError('[MariaDB] Connection not available');
        return false;
    }
    try {
        const [result] = await connection.execute(query, values);
        printResult(`[MariaDB] Query executed successfully`);
        return result;
    } catch (err) {
        printError(`[MariaDB] Query execution failed: ${err.message}`);
        printDebug(err);
        return false;
    }
}
