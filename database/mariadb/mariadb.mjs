import chalk from 'chalk';
import mysql from 'mysql2/promise';

/**
 * Initializes MariaDB connection using mysql2.
 * Returns true on success, false on failure.
 *
 * @returns {Promise<boolean>}
 */
export default async function initMariaDB() {
    const host = process.env.MARIADB_HOST || 'localhost';
    const port = process.env.MARIADB_PORT || 3306;
    const user = process.env.MARIADB_USER || 'root';
    const password = process.env.MARIADB_PASSWORD || '';
    const database = process.env.MARIADB_DATABASE || 'noona';

    console.log(chalk.gray('----------------------------------------'));
    console.log(chalk.cyan('[Init] Starting MariaDB...'));
    console.log(chalk.cyan(`[MariaDB] Attempting to connect to ${user}@${host}:${port} (${database})...`));

    try {
        const connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
            database
        });

        await connection.ping();
        console.log(chalk.green(`[MariaDB] Connected to ${host}:${port} | Database: ${database}`));
        global.noonaMariaDB = connection;
        console.log(chalk.green('[Init] ✅ MariaDB initialized successfully.'));
        return true;
    } catch (error) {
        console.error(chalk.red(`[MariaDB] ❌ Connection failed.`));
        console.error(chalk.gray(`[MariaDB] Reason: ${error.message}`));
        return false;
    } finally {
        console.log(chalk.gray('----------------------------------------'));
    }
}
