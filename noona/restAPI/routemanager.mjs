// /noona/restAPI/routemanager.mjs
import fs from 'fs';
import path from 'path';
import { authLock } from './middleware/authLock.mjs';
import { printResult, printError, printDebug, printSection, printDivider } from '../logger/logUtils.mjs';

/**
 * Mounts version 1 REST API routes onto the provided Express application.
 *
 * The function recursively traverses the 'noona/restAPI/v1' directory, dynamically imports
 * route modules, and mounts them to the app instance. Routes marked with a `routeMeta.auth`
 * value of "public" are added without middleware, while all other routes are secured with the
 * authentication lock middleware.
 *
 * @example
 * mountRoutes(app);
 */
export default function mountRoutes(app) {
    const baseDir = path.join(process.cwd(), 'noona', 'restAPI', 'v1');
    printSection('🔁 Mounting V1 REST Routes');

    async function walkAndMount(dirPath, routePrefix = '') {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });

        entries.forEach(async (entry) => {
            const fullPath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                walkAndMount(fullPath, routePrefix + '/' + entry.name);
            } else if (entry.isFile() && entry.name.endsWith('.mjs')) {
                try {
                    const routeModule = await import(fullPath);
                    const router = routeModule.default;
                    const routePath = routePrefix + '/' + entry.name.replace(/\.mjs$/, '');
                    const meta = routeModule.routeMeta || {};

                    if (typeof router !== 'function') {
                        printError(`❌ No default export in ${entry.name}; skipping`);
                        return;
                    }

                    if (meta.auth === 'public') {
                        app.use(routePath, router);
                        printResult(`🌐 Public Route: ${routePath}`);
                    } else {
                        app.use(routePath, authLock, router);
                        printResult(`🔐 Private Route: ${routePath}`);
                    }
                } catch (err) {
                    printError(`❌ Failed to load ${entry.name}`);
                    printDebug(err.message);
                }
            }
        });
    }

    walkAndMount(baseDir, '');
    printDivider();
}
