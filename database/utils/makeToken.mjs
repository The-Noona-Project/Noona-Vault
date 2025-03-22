// this is temp, noona warden in going to handle all of jwts

import jwt from 'jsonwebtoken';

/**
 * Generates a JWT for internal service communication.
 *
 * @param {Object} payload - Data to include in the token.
 * @param {string} secret - The secret key used to sign the token.
 * @param {string} expiresIn - Expiration time (default: 1h).
 * @returns {string} - The signed JWT.
 */
export function makeToken(payload = { from: 'noona-portal' }, secret = process.env.JWT_SECRET || 'super-secret-key', expiresIn = '1h') {
    return jwt.sign(payload, secret, { expiresIn });
}
