// ✅ /database/redis/getFromRedis.mjs

/**
 * Safely fetches a value from Redis.
 *
 * @param {import('redis').RedisClientType} client - Redis client instance
 * @param {string} key - Redis key to get
 * @returns {Promise<string|null>}
 */
export async function getFromRedis(client, key) {
    if (!client?.get) {
        console.warn('[Redis] ⚠️ Invalid or disconnected client.');
        return null;
    }

    try {
        const value = await client.get(key);
        return value || null;
    } catch (err) {
        console.error(`[Redis] ❌ Failed to get key "${key}":`, err.message);
        return null;
    }
}
