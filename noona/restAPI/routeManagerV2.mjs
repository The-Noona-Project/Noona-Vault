/**
 * @fileoverview
 * Dynamically mounts versioned REST API routes under `/v2` by scanning subfolders.
 * Routes are grouped by category → action → endpoint (e.g., `/v2/mongodb/notifications/read`).
 * Public and private access is determined using the `authLock` middleware.
 *
 * @module routeManagerV2
 */

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

import { printResult, printError } from '../logger/logUtils.mjs';
import { authLock } from './middleware/authLock.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Explicitly defined public endpoints that bypass authentication.
 * These are safe to expose and used during early service bootstrapping.
 * @type {string[]}
 */
const publicRoutes = [
    '/v2/redis/publicKey/create',
    '/v2/redis/publicKey/read/:service'
];

/**
 * Dynamically mounts all available `/v2/*/*/*.mjs` routes under Express.
 *
 * @async
 * @function
 * @param {import('express').Express} app - The Express app instance to attach routes to
 *
 * @example
 * // This will mount:
 * // - /v2/mongodb/notifications/create
 * // - /v2/system/health/databaseHealth
 * // and so on...
 */
export async function mountRoutesV2(app) {
    const v2Base = path.join(__dirname, 'v2');
    const categories = await fs.readdir(v2Base);

    for (const category of categories) {
        const categoryPath = path.join(v2Base, category);
        const stats = await fs.stat(categoryPath);
        if (!stats.isDirectory()) continue;

        const actions = await fs.readdir(categoryPath);
        for (const action of actions) {
            const actionPath = path.join(categoryPath, action);
            const actionStats = await fs.stat(actionPath);
            if (!actionStats.isDirectory()) continue;

            const files = await fs.readdir(actionPath);
            for (const file of files) {
                if (!file.endsWith('.mjs')) continue;

                const routeFile = path.join(actionPath, file);
                try {
                    const routeModule = await import(routeFile);

                    if (!routeModule.default) {
                        printError(`❌ ❌ Skipped /v2/${category}/${action}/${file.replace('.mjs', '')} — no default export`);
                        continue;
                    }

                    const routePath = `/v2/${category}/${action}/${file.replace('.mjs', '')}`;
                    const isExplicitPublic = publicRoutes.includes(routePath);
                    const isSystem = category === 'system';

                    if (isExplicitPublic || isSystem) {
                        app.use(routePath, routeModule.default);
                        printResult(`✔ 🌐 Public Route: ${routePath}`);
                    } else {
                        app.use(routePath, authLock, routeModule.default);
                        printResult(`✔ 🔐 Private Route: ${routePath}`);
                    }
                } catch (err) {
                    printError(`❌ ❌ Failed to load route: ${file}`);
                    printError(`DEBUG: ${err.stack}`);
                }
            }
        }
    }

    printResult('✔ ✅ Routes mounted');
}
