// /initmain.mjs — Clean Boot + Debug + Warden-Compatible

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import chalk from 'chalk';

import { initializeDatabases } from './database/databaseManager.mjs';
import mountRoutes from './noona/restAPI/routemanager.mjs';
import {
    printBanner,
    printDivider,
    printSection,
    printResult,
    printError,
    printDebug
} from './noona/logger/logUtils.mjs';
import { validateEnv } from './noona/logger/validateEnv.mjs';

// Validate required and optional environment variables
validateEnv(
    [
        'VAULT_PORT',
        'MONGO_URL',
        'REDIS_URL',
        'MARIADB_HOST',
        'MARIADB_USER',
        'MARIADB_PASSWORD',
        'MARIADB_DATABASE'
    ],
    ['NODE_ENV']
);

const app = express();
const PORT = process.env.PORT || 3120;
let server = null;

printBanner('Noona Vault');
printDivider();

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    printError('⚠️ Unhandled Promise Rejection:');
    console.error(reason);
});

// Main boot logic
(async () => {
    try {
        const isDev = process.env.NODE_ENV?.toLowerCase() === 'development';
        if (isDev) {
            printSection('🔍 Debug Mode Active');
            printDebug(`PORT: ${PORT}`);
            printDebug(`NODE_ENV: ${process.env.NODE_ENV}`);
            printDebug(`MONGO_URL: ${process.env.MONGO_URL}`);
            printDebug(`REDIS_URL: ${process.env.REDIS_URL}`);
            printDebug(`MARIADB_HOST: ${process.env.MARIADB_HOST}`);
            printDebug(`MARIADB_DATABASE: ${process.env.MARIADB_DATABASE}`);
            printDivider();
        }

        printSection('📦 Initializing Databases');
        await initializeDatabases();
        printResult('✅ All database clients connected');

        printSection('🧩 Setting Up Middleware');
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(morgan('dev'));
        printResult('✅ Express middleware ready');

        printSection('🔁 Mounting REST API Routes');
        mountRoutes(app);
        printResult('✅ Routes mounted');

        printSection('🚀 Starting API Server');
        server = app.listen(PORT, () => {
            printResult(`✅ Vault API listening on port ${PORT}`);
            printDivider();
            console.log(chalk.bold.cyan('[Noona-Vault] Vault is ready and awaiting secure orders.'));
            printDivider();
        });
    } catch (err) {
        printError('❌ Error during initialization:');
        console.error(err);
        process.exit(1);
    }
})();

// Graceful shutdown handler
function handleShutdown(signal) {
    printDivider();
    printSection(`💤 ${signal} received — Shutting down Noona-Vault`);

    const closeTasks = [
        global.noonaMongoClient?.close?.(),
        global.noonaRedisClient?.quit?.(),
        global.noonaMariaConnection?.end?.()
    ];

    if (server?.close) {
        closeTasks.push(new Promise(resolve => server.close(resolve)));
    }

    Promise.allSettled(closeTasks)
        .then(() => {
            printResult('✅ All services and connections closed. Vault secure.');
            process.exit(0);
        })
        .catch(err => {
            printError('❌ Error during shutdown:');
            console.error(err);
            process.exit(1);
        });
}

// Bind shutdown signals
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
