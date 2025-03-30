// /noona/restAPI/server.mjs

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { printResult } from '../logger/logUtils.mjs';
import mountRoutes from './routemanager.mjs';
import { authLock } from './middleware/authLock.mjs';

const app = express();
const PORT = process.env.PORT || process.env.VAULT_PORT || 3120;

// Global middleware stack
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Apply authLock middleware to protect routes based on our configuration
app.use('/v1', authLock);

// Dynamically mount all versioned V1 routes
mountRoutes(app);

// Start the HTTP server
app.listen(PORT, () => {
    printResult(`[REST API] Vault listening on port ${PORT}`);
});
