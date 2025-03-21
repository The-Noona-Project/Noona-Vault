import chalk from 'chalk';
import mongoose from 'mongoose';

/**
 * Initializes MongoDB via Mongoose.
 * Returns true on success, false on failure.
 *
 * @returns {Promise<boolean>}
 */
export default async function initMongo() {
    const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/noona';

    console.log(chalk.gray('----------------------------------------'));
    console.log(chalk.cyan('[Init] Starting MongoDB...'));
    console.log(chalk.cyan(`[MongoDB] Attempting to connect to ${mongoURL}...`));

    try {
        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(chalk.green(`[MongoDB] Connected successfully to: ${mongoURL}`));
        global.noonaMongo = mongoose.connection;

        mongoose.connection.on('error', (err) =>
            console.error(chalk.red('[MongoDB] Connection error:'), err.message)
        );

        mongoose.connection.on('disconnected', () =>
            console.warn(chalk.yellow('[MongoDB] Disconnected from database.'))
        );

        console.log(chalk.green('[Init] ✅ MongoDB initialized successfully.'));
        return true;
    } catch (error) {
        console.error(chalk.red('[MongoDB] ❌ Connection failed:'), error.message);
        return false;
    } finally {
        console.log(chalk.gray('----------------------------------------'));
    }
}
