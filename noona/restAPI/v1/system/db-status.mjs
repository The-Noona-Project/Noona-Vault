// /noona/restAPI/v1/system/db-status.mjs

import express from 'express';
import { printDebug, printError } from '../../../logger/logUtils.mjs';

const router = express.Router();

/**
 * GET /v1/system/db-status
 * Public route — returns connection status for each database.
 */
router.get('/', async (req, res) => {
    const status = {
        mongo: { online: false, host: null },
        redis: { online: false, host: null },
        mariadb: { online: false, host: null }
    };

    // MongoDB
    try {
        const mongo = global.noonaMongoClient;
        if (mongo) {
            const info = await mongo.db().admin().serverStatus();
            status.mongo.online = true;
            status.mongo.host = info.host;
        }
    } catch (err) {
        printError('[DB-Status] MongoDB not available:', err.message);
    }

    // Redis
    try {
        const redis = global.noonaRedisClient?.client;
        if (redis) {
            const pong = await redis.ping();
            if (pong === 'PONG') {
                status.redis.online = true;
                status.redis.host = global.noonaRedisClient.options?.socket?.host || 'redis';
            }
        }
    } catch (err) {
        printError('[DB-Status] Redis not available:', err.message);
    }

    // MariaDB
    try {
        const maria = global.noonaMariaConnection;
        if (maria) {
            const [rows] = await maria.query('SELECT @@hostname AS host');
            status.mariadb.online = true;
            status.mariadb.host = rows[0]?.host || 'unknown';
        }
    } catch (err) {
        printError('[DB-Status] MariaDB not available:', err.message);
    }

    const onlineCount = Object.values(status).filter(s => s.online).length;
    printDebug(`[System] DB status: ${onlineCount}/3 online`);

    return res.status(200).json({
        success: true,
        status: 'ok',
        connected: onlineCount,
        dbStatus: status
    });
});

/**
 * Route metadata — used by dynamic router.
 */
export const routeMeta = {
    path: '/v1/system/db-status',
    authLevel: 'public',
    description: 'Returns the live connection status of Vault’s database clients',
    method: 'GET'
};

export default router;
