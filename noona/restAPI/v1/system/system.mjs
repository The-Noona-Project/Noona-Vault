// /noona/restAPI/v1/system/system.mjs

import { Router } from 'express';
import chalk from 'chalk';

export default function (app) {
    const router = Router();

    /**
     * Health Check Endpoint
     * Returns basic status response to confirm API is alive.
     */
    router.get('/health', (req, res) => {
        res.json({ status: 'healthy' });
    });

    /**
     * Version Info Endpoint
     * Reports the current version of the Noona-Vault service.
     */
    router.get('/version', (req, res) => {
        const version = process.env.npm_package_version || '0.0.0-dev';
        res.json({ version });
    });

    /**
     * Database Connection Status Endpoint
     * Checks which databases are initialized (based on global objects).
     */
    router.get('/db-status', (req, res) => {
        const dbStatus = {
            mongo: !!global.noonaMongo,
            redis: !!global.noonaRedis,
            mariadb: !!global.noonaMaria,
            milvus: !!global.noonaMilvus
        };

        const connectedCount = Object.values(dbStatus).filter(Boolean).length;

        console.log(chalk.blue(`[System] Database status requested. ${connectedCount}/4 online.`));
        res.json(dbStatus);
    });

    app.use('/v1/system', router);
}
