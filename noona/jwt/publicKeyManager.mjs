// /noona/jwt/publicKeyManager.mjs

import { handleCreateKey } from '../restAPI/v2/redis/publicKey/create/createKey.mjs';
import { handleReadKey } from '../restAPI/v2/redis/publicKey/read/readKey.mjs';
import { handleUpdateKey } from '../restAPI/v2/redis/publicKey/update/updateKey.mjs';
import { handleDeleteKey } from '../restAPI/v2/redis/publicKey/delete/deleteKey.mjs';

/**
 * High-level wrapper: Create and store a public key in Redis for a service.
 *
 * @param {string} service - Name of the service (e.g., "noona-portal")
 * @param {string} publicKey - PEM-formatted public key string
 * @returns {Promise<boolean>} - True if key was stored successfully
 */
export async function createPublicKey(service, publicKey) {
    return await handleCreateKey(service, publicKey);
}

/**
 * High-level wrapper: Read the public key for a given service from Redis.
 *
 * @param {string} service - Name of the service
 * @returns {Promise<string|null>} - The PEM public key string or null if not found
 */
export async function readPublicKey(service) {
    return await handleReadKey(service);
}

/**
 * High-level wrapper: Update (overwrite) the public key in Redis for a service.
 *
 * @param {string} service - Name of the service
 * @param {string} publicKey - New PEM public key string
 * @returns {Promise<boolean>} - True if key was updated successfully
 */
export async function updatePublicKey(service, publicKey) {
    return await handleUpdateKey(service, publicKey);
}

/**
 * High-level wrapper: Delete the stored public key for a service.
 *
 * @param {string} service - Name of the service
 * @returns {Promise<boolean>} - True if key was deleted successfully
 */
export async function deletePublicKey(service) {
    return await handleDeleteKey(service);
}
