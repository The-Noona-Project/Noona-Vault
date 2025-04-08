// /restAPI/v2/system/health/databaseHealth.mjs
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const mongoStatus = global.noonaMongoClient?.topology?.isConnected?.() ? 'Online' : 'Offline';
        const redisStatus = global.noonaRedisClient?.status === 'ready' ? 'Online' : 'Offline';
        const mariaStatus = global.noonaMariaConnection ? 'Online' : 'Offline';

        res.status(200).json({
            mongo: {
                status: mongoStatus,
                url: process.env.MONGO_URL || 'Not set'
            },
            redis: {
                status: redisStatus,
                url: process.env.REDIS_URL || 'Not set'
            },
            mariadb: {
                status: mariaStatus,
                host: process.env.MARIADB_HOST || 'Not set',
                user: process.env.MARIADB_USER || 'Not set',
                database: process.env.MARIADB_DATABASE || 'Not set'
            }
        });
    } catch (err) {
        console.error('[Vault:DBHealth] Error reporting DB status:', err);
        res.status(500).json({ error: 'Failed to retrieve database status.' });
    }
});

export default router;
