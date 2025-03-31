// /noona/restAPI/v1/system/health.mjs

import express from 'express';

const router = express.Router();

/**
 * GET /v1/system/health
 * Public route — returns basic service health status.
 */
router.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        status: 'healthy',
        service: 'noona-vault',
        timestamp: new Date().toISOString()
    });
});

/**
 * Route metadata — used by dynamic route manager.
 */
export const routeMeta = {
    path: '/v1/system/health',
    authLevel: 'public',
    description: 'Health check endpoint for Vault readiness/liveness probes'
};

export default router;
