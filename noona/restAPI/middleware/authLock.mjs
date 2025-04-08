// /noona/restAPI/middleware/authLock.mjs

import jwt from 'jsonwebtoken';
import { getFromRedis } from '../../../database/redis/getFromRedis.mjs';
import { printDebug, printError } from '../../logger/logUtils.mjs';

/**
 * Express middleware that validates JWTs using per-service public keys.
 *
 * Looks for Authorization header (Bearer <token>), extracts `iss` from JWT,
 * fetches `NOONA:TOKEN:<issuer>` from Redis, and verifies the token.
 *
 * On success, attaches `req.user`. On failure, returns 401 or 403.
 */
export async function authLock(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authorization token missing'
        });
    }

    try {
        const client = global.noonaRedisClient;
        if (!client) throw new Error('Redis client not initialized');

        // Decode the token without verifying to extract the issuer
        const decodedUnverified = jwt.decode(token, { complete: true });
        const issuer = decodedUnverified?.payload?.iss;

        if (!issuer) {
            throw new Error('Missing issuer (iss) in token');
        }

        const redisKey = `NOONA:TOKEN:${issuer}`;
        const publicKey = await getFromRedis(client, redisKey);

        if (!publicKey) {
            throw new Error(`Public key not found for issuer: ${issuer}`);
        }

        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        req.user = decoded;

        printDebug(`🔐 Verified token for ${issuer} — user: ${decoded.sub || 'anonymous'}`);
        next();
    } catch (err) {
        printError(`🔒 Auth failed: ${err.message}`);
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}
