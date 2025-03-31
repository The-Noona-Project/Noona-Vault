// /noona/restAPI/server.mjs

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { printResult } from '../logger/logUtils.mjs';
import mountRoutes from './routemanager.mjs';
import { authLock } from './middleware/authLock.mjs';
import systemRoutes from './v1/system.mjs';

const app = express();
const PORT = process.env.PORT || process.env.VAULT_PORT || 3120;

// 🌐 Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ✅ PUBLIC ROUTES — expose system info without auth
app.use('/v1/system', systemRoutes);

// 🔐 AUTH-PROTECTED ROUTES — everything else under /v1
app.use('/v1', authLock);

// 🧩 DYNAMICALLY MOUNT remaining versioned routes
mountRoutes(app);

// 🚀 Start the server
app.listen(PORT, () => {
    printResult(`[REST API] Vault listening on port ${PORT}`);
});
