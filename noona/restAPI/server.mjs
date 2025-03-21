// ✅ /noona/restAPI/server.mjs

import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mountRoutes from './routemanager.mjs';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3120;

/**
 * Global middleware stack
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/**
 * Dynamically mount versioned API routes
 */
mountRoutes(app);

/**
 * Start HTTP server and log status once listening
 */
app.listen(PORT, () => {
    console.log(chalk.green('[REST API] ✅ Online and authenticated.'));
    console.log(chalk.cyan(`[REST API] Listening on port ${PORT}`));
});
