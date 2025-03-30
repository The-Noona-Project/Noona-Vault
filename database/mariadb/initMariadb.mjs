// /database/mariadb/initMariadb.mjs

import connectMariadb from './connectMariadb.mjs';
import { printError } from '../../noona/logger/logUtils.mjs';

export default async function initMariaDB() {
    const connection = await connectMariadb();
    if (!connection) {
        printError('❌ Failed to initialize MariaDB connection.');
        return false;
    }
    return { connection };
}
