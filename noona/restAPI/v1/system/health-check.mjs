// /noona/restAPI/v1/system/health-check.mjs

import express from 'express';

const router = express.Router();

/**
 * @route GET /v1/system/health
 * @desc  Health check endpoint for Noona-Vault
 * @returns {Object} status JSON
 */
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'Noona-Vault is alive and well! 💖' });
});

export default router;
