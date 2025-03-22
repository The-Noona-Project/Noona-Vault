import express from 'express';
import { getToken, healthCheck } from './system.mjs';

export default function(app) {
    const router = express.Router();
    
    // Health check endpoint
    router.get('/health', healthCheck);
    
    // Token retrieval endpoint
    router.get('/getToken/:service', getToken);
    
    app.use('/v1/system', router);
} 