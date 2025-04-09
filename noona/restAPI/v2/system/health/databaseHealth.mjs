// /routes/v2/system/databaseHealth.mjs

export default async function databaseHealthHandler(req, res) {
    const results = {};

    // MongoDB
    if (global.noonaMongoClient) {
        results.mongo = {
            status: 'Online',
            url: process.env.MONGO_URL
        };
    } else {
        results.mongo = {
            status: 'Offline',
            url: process.env.MONGO_URL
        };
    }

    // Redis
    if (global.noonaRedisClient) {
        results.redis = {
            status: 'Online',
            url: process.env.REDIS_URL
        };
    } else {
        results.redis = {
            status: 'Offline',
            url: process.env.REDIS_URL
        };
    }

    // MariaDB
    if (global.noonaMariaConnection) {
        results.mariadb = {
            status: 'Online',
            host: process.env.MARIADB_HOST,
            user: process.env.MARIADB_USER,
            database: process.env.MARIADB_DATABASE
        };
    } else {
        results.mariadb = {
            status: 'Offline',
            host: process.env.MARIADB_HOST,
            user: process.env.MARIADB_USER,
            database: process.env.MARIADB_DATABASE
        };
    }

    return res.status(200).json(results);
}
