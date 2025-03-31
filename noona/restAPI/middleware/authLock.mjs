// /noona/restAPI/middleware/authLock.mjs

import jwt from 'jsonwebtoken';
import { getFromRedis } from '../../../database/redis/getFromRedis.mjs';
import { printDebug, printError } from '../../logger/logUtils.mjs';

/**
 * Mounts publicly accessible routes before auth middleware applies.
 * These bypass JWT validation.
 */
export function mountPublicRoutes(app) {
    app.get('/v1/system/health', (req, res) => {
        res.status(200).json({ status: 'healthy', service: 'noona-vault' });
    });

    app.get('/v1/system/version', (req, res) => {
        const version = process.env.npm_package_version || '0.0.0-dev';
        res.status(200).json({
            success: true,
            version,
            service: 'noona-vault'
        });
    });

    app.get('/v1/system/db-status', (req, res) => {
        const dbStatus = {
            mongo: !!global.noonaMongoClient,
            redis: !!global.noonaRedisClient,
            mariadb: !!global.noonaMariaConnection
        };

        const onlineCount = Object.values(dbStatus).filter(Boolean).length;
        printDebug(`[System] DB status: ${onlineCount}/3 online`);

        res.status(200).json({
            success: true,
            status: 'ok',
            dbStatus
        });
    });

    // Allow public token fetch route
    app.get('/v1/system/token', (req, res, next) => next());
}

/**
 * Middleware: Validates JWT on protected routes.
 */
export async function authLock(req, res, next) {
    const path = req.originalUrl || req.path;

    const isPublic =
        path.startsWith('/v1/system/health') ||
        path.startsWith('/v1/system/version') ||
        path.startsWith('/v1/system/db-status') ||
        path.startsWith('/v1/system/token');

    if (isPublic) return next();

    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authorization token missing'
        });
    }

    try {
        const client = global.noonaRedisClient?.client;
        if (!client) throw new Error('Redis client not initialized');

        const publicKey = await getFromRedis(client, 'NOONA:JWT:PUBLIC_KEY');
        if (!publicKey) throw new Error('Public key not found in Redis');

        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        req.user = decoded;

        printDebug(`🔐 Verified JWT — user: ${decoded.sub || 'anonymous'}`);
        next();
    } catch (err) {
        printError(`🔒 AuthLock failed: ${err.message}`);
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}