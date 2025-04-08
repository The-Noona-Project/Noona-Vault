// /noona/jwt/generateKeyPair.mjs

import { generateKeyPair as generate } from 'crypto';
import { promisify } from 'util';

const asyncGenerateKeyPair = promisify(generate);

/**
 * Generates a new RSA key pair.
 * @returns {Promise<{ publicKey: string, privateKey: string }>}
 */
export async function generateKeyPair() {
    const { publicKey, privateKey } = await asyncGenerateKeyPair('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });

    return { publicKey, privateKey };
}
