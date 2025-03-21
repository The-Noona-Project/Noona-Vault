// noona/restAPI/server.mjs

import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mountRoutes from './routemanager.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3120;

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging (dev-friendly)
app.use(morgan('dev'));

// Mount versioned REST routes
mountRoutes(app);

// Start the server
app.listen(PORT, () => {
    console.log(chalk.greenBright(`[Noona-Vault] ✅ REST API is online.`));
    console.log(chalk.cyan(`[REST API] Listening on port ${PORT}`));
});
export async function startServer() {
    app.listen(PORT, () => {
        console.log(chalk.green(`[REST API] Listening on port ${PORT}`));
    });
}
