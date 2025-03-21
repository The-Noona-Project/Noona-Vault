// /noona/restAPI/routemanager.mjs

import express from 'express';
import systemRoutes from './v1/system/health-check.mjs';

/**
 * Sets up versioned route modules under the `/v1` namespace.
 * Extend this to support more route categories or versions.
 *
 * @returns {express.Router}
 */
export function setupRoutes() {
    const router = express.Router();

    // All system-level endpoints like /v1/system/health
    router.use('/system', systemRoutes);

    return router;
}
