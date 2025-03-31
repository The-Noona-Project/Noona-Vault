// /noona/restAPI/middleware/authLock.mjs

import jwt from 'jsonwebtoken';
import { getFromRedis } from '../../../database/redis/getFromRedis.mjs';
import { printDebug, printError } from '../../logger/logUtils.mjs';

/**
 * Configures and mounts system-related public routes on the provided Express application.
 *
 * This function registers several GET endpoints that are accessible without JWT validation:
 * - `/v1/system/health`: Returns basic health information about the service.
 * - `/v1/system/version`: Provides the current service version, defaulting to '0.0.0-dev' if unspecified.
 * - `/v1/system/db-status`: Returns the status of MongoDB, Redis, and MariaDB connections.
 * - `/v1/system/token`: A passthrough route that bypasses authentication.
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
 * Validates a JSON Web Token (JWT) on protected routes.
 *
 * This middleware bypasses authentication for public endpoints:
 * "/v1/system/health", "/v1/system/version", "/v1/system/db-status", and "/v1/system/token".
 * For all other routes, it extracts the JWT from the 'Authorization' header following the
 * Bearer scheme, retrieves the public key from Redis, and verifies the token using the RS256 algorithm.
 * On successful verification, the decoded token is attached to req.user.
 * If the token is missing, invalid, or expired, the middleware sends an appropriate HTTP error response.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to pass control to the next middleware.
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