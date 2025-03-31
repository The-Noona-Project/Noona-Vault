// /database/mariadb/sendToMariadb.js

import { printResult, printError, printDebug } from '../../noona/logger/logUtils.mjs';

/**
 * Executes a parameterized INSERT, UPDATE, or DELETE SQL query against a MariaDB database.
 *
 * This asynchronous function uses the provided connection to run the given SQL statement. It returns
 * the query result object upon success. If the connection is missing or an error occurs during execution,
 * the function logs the error details and returns false.
 *
 * @param {string} query - The SQL statement to execute.
 * @param {Array} [values=[]] - Optional list of values for parameterizing the query.
 * @returns {Promise<object|false>} A promise that resolves with the query result if successful, or false if execution fails.
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
