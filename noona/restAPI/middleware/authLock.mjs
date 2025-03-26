// ✅ /noona/restAPI/middleware/authLock.mjs

import jwt from 'jsonwebtoken';
import { printDebug, printError } from '../../logger/logUtils.mjs';

/**
 * Central route lock map.
 * Keys are base route paths mounted via Express.
 * Values: "private" = requires valid JWT signed with private key (RS256).
 */
const routeConfig = {
    // 📦 CRUD Routes
    "/v1/crud/mongo": "private",         // POST: /v1/crud/mongo/:collection/:action
    "/v1/crud/mariadb": "private",       // POST: /v1/crud/mariadb/:table/:action
    "/v1/notifications/kavita": "private", // GET/POST: /v1/notifications/kavita
    "/v1/system/health": "public",
    "/v1/system/db-status": "public"
};

/**
 * Retrieves the public JWT key from Redis.
 * Warden stores the key under "NOONA_PUBLIC_KEY".
 */
async function getPublicKey() {
    const { getFromRedis } = await import('../../../database/redis/getFromRedis.mjs');
    const client = global.noonaRedisClient?.client;

    if (!client) {
        throw new Error('Redis client not available');
    }

    const publicKey = await getFromRedis(client, 'NOONA_PUBLIC_KEY');

    if (!publicKey) {
        throw new Error('Public key not found in Redis (key: NOONA_PUBLIC_KEY)');
    }

    printDebug(`✅ Public key retrieved from Redis`);
    return publicKey;
}

/**
 * Middleware: authLock
 * Locks sensitive API routes behind JWT verification (RS256).
 */
export async function authLock(req, res, next) {
    const path = req.originalUrl || req.path;
    let needsAuth = false;

    // Determine if the requested route is protected
    for (const [lockedPath, level] of Object.entries(routeConfig)) {
        if (path === lockedPath || path.startsWith(lockedPath)) {
            if (level === 'private') {
                needsAuth = true;
                break;
            }
        }
    }

    // Route is public
    if (!needsAuth) return next();

    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authorization token missing'
        });
    }

    try {
        const publicKey = await getPublicKey();
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        req.user = decoded;
        printDebug(`🔐 Token verified — user: ${decoded.sub || 'anonymous'}`);
        return next();
    } catch (err) {
        printError(`🔒 AuthLock failed: ${err.message}`);
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}
