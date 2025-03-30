// /database/mariadb/connectMariadb.mjs

import mysql from 'mysql2/promise';
import { printSection, printResult, printError, printDebug } from '../../noona/logger/logUtils.mjs';

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
