// /noona/restAPI/routemanager.mjs

import fs from 'fs';
import path from 'path';
import { printResult, printError, printDebug, printSection, printDivider } from '../logger/logUtils.mjs';

/**
 * Dynamically mounts all versioned REST routes found under `/noona/restAPI/v1`
 * and logs registered route files to the console.
 *
 * Each .mjs file is mounted at a path corresponding to its folder structure and file name.
 * For example, a file "crud/routes.mjs" will be mounted at "/crud/routes".
 *
 * @param {import('express').Application} app - The Express application instance.
 */
export default function mountRoutes(app) {
    // Set base directory to the "v1" folder
    const baseDir = path.join(process.cwd(), 'noona', 'restAPI', 'v1');

    printSection('🔁 Mounting V1 REST Routes');

    /**
     * Recursively walks through the directory and mounts .mjs route files.
     *
     * @param {string} dirPath - The current directory path.
     * @param {string} routePrefix - The accumulated route prefix.
     */
    function walkAndMount(dirPath, routePrefix = '') {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        entries.forEach(entry => {
            const fullPath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                walkAndMount(fullPath, routePrefix + '/' + entry.name);
            } else if (entry.isFile() && entry.name.endsWith('.mjs')) {
                // Import the route module dynamically.
                import(fullPath)
                    .then(routeModule => {
                        if (typeof routeModule.default === 'function') {
                            // Determine route path by removing the ".mjs" extension.
                            const routePath = routePrefix + '/' + entry.name.replace(/\.mjs$/, '');
                            // Mount the route on the Express app.
                            app.use(routePath, routeModule.default);
                            printResult(`✅ Mounted route: ${routePath}`);
                        } else {
                            printError(`No default export in ${fullPath}; skipping.`);
                        }
                    })
                    .catch(err => {
                        printError(`❌ Failed to load route file: ${fullPath}`);
                        printDebug(err.message);
                    });
            }
        });
    }

    walkAndMount(baseDir, '');
    printDivider();
}
