// /noona/restAPI/v1/system/version.mjs

import express from 'express';
import { execSync } from 'child_process';
import { printDebug, printError } from '../../../logger/logUtils.mjs';

const router = express.Router();

/**
 * GET /v1/system/version
 * Public route — returns system and service version details.
 */
router.get('/', async (req, res) => {
    const result = {
        success: true,
        service: 'noona-vault',
        version: process.env.npm_package_version || '0.0.0-dev',
        node: process.version,
        docker: null,
        databases: {}
    };

    // Try to get Docker version
    try {
        const output = execSync('docker version --format "{{.Server.Version}}"').toString().trim();
        result.docker = output;
    } catch (err) {
        printError('[Version] Could not retrieve Docker version');
    }

    // MongoDB Version
    try {
        const client = global.noonaMongoClient;
        if (client) {
            const info = await client.db().admin().serverStatus();
            result.databases.mongo = info.version || 'unknown';
        }
    } catch (err) {
        printError('[Version] Failed to fetch MongoDB version');
    }

    // Redis Version
    try {
        const client = global.noonaRedisClient?.client;
        if (client) {
            const info = await client.info();
            const match = info.match(/redis_version:(\S+)/);
            result.databases.redis = match?.[1] || 'unknown';
        }
    } catch (err) {
        printError('[Version] Failed to fetch Redis version');
    }

    // MariaDB Version
    try {
        const conn = global.noonaMariaConnection;
        if (conn) {
            const [rows] = await conn.query('SELECT VERSION() AS version');
            result.databases.mariadb = rows[0]?.version || 'unknown';
        }
    } catch (err) {
        printError('[Version] Failed to fetch MariaDB version');
    }

    printDebug('[Version] Version info sent to client');
    return res.status(200).json(result);
});

/**
 * Route metadata — used by dynamic router.
 */
export const routeMeta = {
    path: '/v1/system/version',
    authLevel: 'public',
    description: 'Returns service, Node.js, Docker, and database versions'
};

export default router;
