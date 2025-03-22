// /noona/restAPI/v1/system/system.mjs

import express from 'express';
import jwt from 'jsonwebtoken';
import chalk from 'chalk';

const router = express.Router();

/**
 * Health Check Endpoint
 * Returns basic status response to confirm API is alive.
 */
export function healthCheck(req, res) {
    res.status(200).json({ status: 'healthy' });
}

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
        mongo: !!global.noonaMongoClient,
        redis: !!global.noonaRedisClient,
        mariadb: !!global.noonaMariaConnection,
        milvus: !!global.noonaMilvusClient
    };

    const connectedCount = Object.values(dbStatus).filter(Boolean).length;

    console.log(chalk.blue(`[System] Database status requested. ${connectedCount}/4 online.`));
    res.json(dbStatus);
});

export function getToken(req, res) {
    const service = req.params.service;
    console.log(`[System] Token requested for service: ${service}`);
    
    const secret = process.env.JWT_SECRET || 'super-secret-key';
    const token = jwt.sign({ service }, secret, { expiresIn: '1h' });
    
    res.status(200).json({ token });
}

export default function (app) {
    router.get('/health', healthCheck);
    router.get('/getToken/:service', getToken);
    
    app.use('/v1/system', router);
}
