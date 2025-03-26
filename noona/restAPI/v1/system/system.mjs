import express from 'express';
import { printDebug } from '../../../logger/logUtils.mjs';

const router = express.Router();

/**
 * GET /v1/system/health
 * Health check endpoint for Docker and readiness probes.
 */
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', service: 'noona-vault' });
});

/**
 * GET /v1/system/version
 * Returns the current Noona Vault version from package.json.
 */
router.get('/version', (req, res) => {
    const version = process.env.npm_package_version || '0.0.0-dev';
    return res.status(200).json({
        success: true,
        version,
        service: 'noona-vault'
    });
});

/**
 * GET /v1/system/db-status
 * Returns the status of all critical database connections.
 */
router.get('/db-status', (req, res) => {
    const dbStatus = {
        mongo: !!global.noonaMongoClient,
        redis: !!global.noonaRedisClient,
        mariadb: !!global.noonaMariaConnection,
        milvus: !!global.noonaMilvusClient // optional, for Oracle later
    };

    const onlineCount = Object.values(dbStatus).filter(Boolean).length;
    printDebug(`[System] DB status: ${onlineCount}/4 online`);

    return res.status(200).json({
        success: true,
        status: 'ok',
        dbStatus
    });
});

export default router;