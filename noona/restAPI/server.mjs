// /noona/restAPI/server.mjs

import express from 'express';
import chalk from 'chalk';
import { setupRoutes } from './routemanager.mjs';

/**
 * Starts the Noona-Vault REST API server.
 *
 * @returns {Promise<void>}
 */
export async function startServer() {
    const app = express();
    const PORT = process.env.PORT || 3120;

    app.use(express.json());

    // Versioned API mount point
    app.use('/v1', setupRoutes());

    return new Promise((resolve) => {
        app.listen(PORT, () => {
            console.log(chalk.cyan(`[REST API] Listening on port ${PORT}`));
            resolve();
        });
    });
}
