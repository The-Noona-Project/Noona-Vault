// ✅ /initmain.mjs — Clean boot + graceful shutdown

import chalk from 'chalk';
import { initializeDatabases } from './database/databaseManager.mjs';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mountRoutes from './noona/restAPI/routemanager.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3120;
let server = null; // <--- Store the server reference

console.log('');
console.log(chalk.bold.greenBright('[Noona-Vault] Booting up Vault System...'));

/**
 * Main async startup block.
 * Initializes databases, mounts routes, and starts HTTP server.
 */
(async () => {
    try {
        // Step 1: Initialize all databases
        await initializeDatabases();
        console.log(chalk.gray('----------------------------------------'));
        console.log('');

        // Step 2: Setup Express middleware
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(morgan('dev'));

        // Step 3: Mount routes after databases are ready
        console.log(chalk.bold.cyan('[RouteManager] 🔁 Scanning and registering versioned REST routes...'));
        mountRoutes(app);
        console.log(chalk.gray('----------------------------------------'));
        console.log('');

        // Step 4: Start the HTTP server
        server = app.listen(PORT, () => {
            console.log(chalk.green('[REST API] ✅ Online and authenticated.'));
            console.log(chalk.cyan(`[REST API] Listening on port ${PORT}`));
            console.log('');
            console.log(chalk.bold.cyan('[Noona-Vault] 🟢 Vault is ready and awaiting secure orders.'));
            console.log('');
        });
    } catch (err) {
        console.error(chalk.red('[Noona-Vault] ❌ Error during initialization:'), err);
        process.exit(1);
    }
})();

/**
 * Handles graceful shutdown when Docker or system sends SIGTERM/SIGINT.
 * Closes DB connections and HTTP server before exiting.
 *
 * @param {'SIGTERM' | 'SIGINT'} signal
 */
function handleShutdown(signal) {
    console.log('');
    console.log(chalk.yellow(`\n[Shutdown] ${signal} received. Closing Noona-Vault cleanly...`));

    const closeTasks = [
        global.noonaMongoClient?.close?.(),
        global.noonaRedisClient?.quit?.(),
        global.noonaMariaConnection?.end?.(),
        global.noonaMilvusClient?.close?.(),
    ];

    // Add HTTP server shutdown if running
    if (server && server.close) {
        closeTasks.push(new Promise(resolve => server.close(resolve)));
    }

    Promise.allSettled(closeTasks).then(() => {
        console.log(chalk.green('[Shutdown] ✅ All services and connections closed. Vault secure.'));
        process.exit(0);
    }).catch(err => {
        console.error(chalk.red('[Shutdown] ❌ Error during shutdown:'), err);
        process.exit(1);
    });
}

// Bind shutdown signals
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
