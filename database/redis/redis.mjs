import chalk from 'chalk';
import { createClient } from 'redis';

/**
 * Initializes Redis connection.
 * Returns true on success, false on failure.
 *
 * @returns {Promise<boolean>}
 */
export default async function initRedis() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = process.env.REDIS_PORT || 6379;

    console.log(chalk.gray('----------------------------------------'));
    console.log(chalk.cyan('[Init] Starting Redis...'));
    console.log(chalk.cyan(`[Redis] Attempting to connect to ${host}:${port}...`));

    const redisClient = createClient({
        socket: { host, port }
    });

    redisClient.on('error', (err) => {
        console.error(chalk.red(`[Redis] Connection error:`), err.message);
    });

    try {
        await redisClient.connect();
        console.log(chalk.green(`[Redis] Connected to ${host}:${port}`));
        global.noonaRedis = redisClient;
        console.log(chalk.green('[Init] ✅ Redis initialized successfully.'));
        return true;
    } catch (error) {
        console.error(chalk.red('[Redis] ❌ Failed to connect:'), error.message);
        return false;
    } finally {
        console.log(chalk.gray('----------------------------------------'));
    }
}
