// ✅ Updated /database/mongo/mongo.mjs
import chalk from 'chalk';
import mongoose from 'mongoose';

let mongoDb = null;

/**
 * Initializes MongoDB via Mongoose.
 * @returns {Promise<{success: boolean, message: string, url: string}>}
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

        mongoDb = mongoose.connection;
        global.noonaMongo = mongoDb;

        mongoDb.on('error', (err) =>
            console.error(chalk.red('[MongoDB] Connection error:'), err.message)
        );

        mongoDb.on('disconnected', () =>
            console.warn(chalk.yellow('[MongoDB] Disconnected from database.'))
        );

        console.log(chalk.green(`[MongoDB] Connected successfully to: ${mongoURL}`));
        console.log(chalk.green('[Init] ✅ MongoDB initialized successfully.'));
        return { success: true, message: 'Connected', url: mongoURL };
    } catch (error) {
        console.error(chalk.red('[MongoDB] ❌ Connection failed:'), error.message);
        return { success: false, message: error.message, url: mongoURL };
    } finally {
        console.log(chalk.gray('----------------------------------------'));
    }
}

export function getMongoDb() {
    return mongoDb;
}
