// /initmain.mjs

import 'dotenv/config';
import chalk from 'chalk';
import { startServer } from './noona/restAPI/server.mjs';
import { initializeDatabases } from './database/databaseManager.mjs';

// Global safety net
process.on('unhandledRejection', (reason) => {
    console.error('[Global UnhandledRejection]', reason?.message || reason);
});

process.on('uncaughtException', (err) => {
    console.error('[Global UncaughtException]', err?.message || err);
});

/**
 * Main entry for Noona-Vault.
 * Boots databases and REST API server.
 */
async function init() {
    console.log(chalk.blueBright('[Noona-Vault] Booting up Vault System...\n'));

    await initializeDatabases(); // handles all logging inside

    try {
        await startServer();
        console.log(chalk.green('[Noona-Vault] ✅ REST API is online.'));
    } catch (err) {
        console.error(chalk.red('[Noona-Vault] ❌ Failed to start REST API:'), err.message);
        process.exit(1);
    }
}

init();
