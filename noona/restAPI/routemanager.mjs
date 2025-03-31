// /noona/restAPI/routemanager.mjs
import fs from 'fs';
import path from 'path';
import { authLock } from './middleware/authLock.mjs';
import { printResult, printError, printDebug, printSection, printDivider } from '../logger/logUtils.mjs';

/**
 * Mounts version 1 REST API routes onto the provided Express application.
 *
 * Recursively traverses the 'noona/restAPI/v1' directory, dynamically imports REST API route modules,
 * and mounts each route to the app with a '/v1' prefix. The route path is built from '/v1', any subdirectory
 * names, and the file name (without the '.mjs' extension). Routes whose metadata property `authLevel` is set
 * to "public" are mounted without authentication middleware, whereas all others are secured using the authLock middleware.
 * Modules that lack a default export (i.e., a valid router function) are skipped with an error log.
 *
 * @example
 * mountRoutes(app);
 */
export default function mountRoutes(app) {
    const baseDir = path.join(process.cwd(), 'noona', 'restAPI', 'v1');
    printSection('🔁 Mounting V1 REST Routes');

    /**
     * Recursively traverses the specified directory to dynamically import and mount route modules onto the Express app.
     *
     * This function reads the contents of a directory, recursively processing subdirectories and loading files ending with ".mjs" as route modules.
     * It constructs each route path by prefixing "/v1" to the accumulated route prefix and the file name (sans extension).
     * Depending on the module's metadata (using "routeMeta.authLevel"), it mounts the route as either public (without authentication middleware) or private (with "authLock").
     * Files that do not export a default function are skipped with an error log, and any issues during dynamic import are caught and logged.
     *
     * @param {string} dirPath - The directory path to scan for route modules.
     * @param {string} [routePrefix=''] - A base prefix used to construct route paths reflecting the directory structure.
     *
     * @async
     */
    async function walkAndMount(dirPath, routePrefix = '') {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                await walkAndMount(fullPath, routePrefix + '/' + entry.name);
            } else if (entry.isFile() && entry.name.endsWith('.mjs')) {
                try {
                    const routeModule = await import(fullPath);
                    const router = routeModule.default;
                    const routePath = '/v1' + routePrefix + '/' + entry.name.replace(/\.mjs$/, '');
                    const meta = routeModule.routeMeta || {};

                    if (typeof router !== 'function') {
                        printError(`❌ No default export in ${entry.name}; skipping`);
                        continue;
                    }

                    const authLevel = meta.authLevel || 'private';

                    if (authLevel === 'public') {
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
        }
    }

    walkAndMount(baseDir, '');
    printDivider();
}
