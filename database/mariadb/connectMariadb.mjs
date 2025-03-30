// /database/mariadb/getFromMariadb.mjs

import { printDebug, printError } from '../../noona/logger/logUtils.mjs';

/**
 * Executes a SELECT query against MariaDB.
 *
 * @param {import('mysql2/promise').Connection} connection - MariaDB connection instance.
 * @param {string} query - The SQL query string.
 * @param {Array} [values=[]] - Values for the parameterized query.
 * @returns {Promise<Array|null>} - The resulting rows, or null if an error occurs.
 */
export async function getFromMariadb(connection, query, values = []) {
    if (!connection) {
        printError('[MariaDB] Connection not available');
        return null;
    }
    try {
        const [rows] = await connection.execute(query, values);
        printDebug(`[MariaDB] Fetched ${rows.length} rows`);
        return rows;
    } catch (err) {
        printError(`[MariaDB] Query failed: ${err.message}`);
        return null;
    }
}
