// ✅ /initmain.mjs (final polished order)

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

console.log('');
console.log(chalk.bold.greenBright('[Noona-Vault] Booting up Vault System...'));

(async () => {
    // Init databases
    await initializeDatabases();

    console.log(chalk.gray('----------------------------------------'));
    console.log('');

    /**
     * Global middleware stack
     */
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev'));

    /**
     * Route mount (after DBs)
     */
    console.log(chalk.bold.cyan('[RouteManager] 🔁 Scanning and registering versioned REST routes...'));
    mountRoutes(app);

    console.log(chalk.gray('----------------------------------------'));
    console.log('');

    /**
     * Start server after routes and DBs are up
     */
    app.listen(PORT, () => {
        console.log(chalk.green('[REST API] ✅ Online and authenticated.'));
        console.log(chalk.cyan(`[REST API] Listening on port ${PORT}`));
        console.log('');
        console.log(chalk.bold.cyan('[Noona-Vault] 🟢 Vault is ready and awaiting secure orders.'));
        console.log('');
    });
})();
