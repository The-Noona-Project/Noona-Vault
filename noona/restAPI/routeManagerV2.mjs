// /noona/restAPI/v2/routeManagerV2.mjs

import fs from 'fs';
import path from 'path';
import { authLock } from './middleware/authLock.mjs';
import {
    printSection,
    printResult,
    printError,
    printDebug,
    printDivider
} from '../logger/logUtils.mjs';

/**
 * Mounts all v2 route modules found under /noona/restAPI/v2/
 * @param {Express.Application} app
 */
export async function mountRoutesV2(app) {
    const baseDir = path.join(process.cwd(), 'noona', 'restAPI', 'v2');
    printSection('🔁 Mounting V2 REST Routes');

    async function walk(dir, prefix = '') {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                await walk(fullPath, prefix + '/' + entry.name);
            } else if (entry.name.endsWith('.mjs')) {
                try {
                    const mod = await import(fullPath);
                    const router = mod.default;
                    const meta = mod.routeMeta || {};
                    const routePath = '/v2' + prefix + '/' + entry.name.replace(/\.mjs$/, '');

                    if (typeof router !== 'function') {
                        printError(`❌ Skipped ${routePath} — no default export`);
                        continue;
                    }

                    const isPublic = meta.authLevel === 'public';
                    const routeLog = isPublic ? '🌐 Public Route' : '🔐 Private Route';

                    app.use(routePath, isPublic ? router : authLock, router);
                    printResult(`${routeLog}: ${routePath}`);
                } catch (err) {
                    printError(`❌ Failed to load route: ${entry.name}`);
                    printDebug(err.stack);
                }
            }
        }
    }

    await walk(baseDir, '');
    printDivider();
}
