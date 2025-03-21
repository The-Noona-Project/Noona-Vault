
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

/**
 * Dynamically mounts all versioned REST routes found under `/v1/` and beyond.
 * Logs registered route files to the console.
 *
 * @param {import('express').Application} app - The Express application instance.
 */
export default function mountRoutes(app) {
    const baseDir = path.join(process.cwd(), 'noona', 'restAPI');

    console.log('');
    console.log(chalk.bold.cyan(`[RouteManager] 🔁 Scanning and registering versioned REST routes...`));

    // Recursively find and mount route files
    function walkAndMount(dirPath) {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);

            if (entry.isDirectory()) {
                walkAndMount(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.mjs')) {
                const routePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
                const routePrefix = '/' + routePath.split('/')[0]; // e.g., /v1

                import(fullPath)
                    .then((routeModule) => {
                        if (typeof routeModule.default === 'function') {
                            routeModule.default(app, global.noonaMongoClient);
                            console.log(chalk.greenBright(`✅ Mounted: ${routePath}`));
                        } else {
                            console.warn(chalk.yellow(`⚠️ Skipped (no default export): ${routePath}`));
                        }
                    })
                    .catch((err) => {
                        console.error(chalk.red(`❌ Failed to load: ${routePath}`));
                        console.error(err);
                    });
            }
        }
    }

    walkAndMount(path.join(baseDir, 'v1'));
    console.log('');
}
