import express from 'express';
import { getKavitaNotifiedIds, saveKavitaNotifiedIds } from './kavitaHandler.mjs';
import { authenticateToken } from '../../middleware/auth.mjs';

export default function(app) {
    const router = express.Router();
    
    router.get('/kavita', authenticateToken, getKavitaNotifiedIds);
    router.post('/kavita', authenticateToken, saveKavitaNotifiedIds);
    
    app.use('/v1/notifications', router);
} 