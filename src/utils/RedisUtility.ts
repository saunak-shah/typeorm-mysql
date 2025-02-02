import RedisClient from "./RedisClient";
import * as dotenv from "dotenv";

dotenv.config()
class RedisUtility {
    private client = RedisClient.getInstance().then((instance) => instance.getClient());
    
    /**
     * Executes a Redis operation only if Redis is enabled.
     * @param callback Callback function containing the Redis operation.
     */
    private async executeIfEnabled<T>(callback: (redis: any) => Promise<T>): Promise<T | null> {
        const redis = await this.client;
        return await callback(redis);
    }
    
    /**
     * Sets a string value in Redis with an optional expiration time.
     * @param key Redis key.
     * @param value String value to set.
     * @param ttl Expiration time in seconds (optional).
     */
    async setString(key: string, value: string, ttl?: number): Promise<void> {
        await this.executeIfEnabled(async (redis) => {
            if (ttl) {
                await redis.set(key, value, "EX", ttl);
            } else {
                await redis.set(key, value);
            }
        });
    }

    /**
     * Retrieves a string value from Redis by key.
     * @param key Redis key.
     * @returns String value or null if key does not exist.
     */
    async getString(key: string): Promise<string | null> {
        return this.executeIfEnabled(async (redis) => await redis.get(key));
    }

    /**
     * Sets a JSON object in Redis with an optional expiration time.
     * @param key Redis key.
     * @param value JSON object to set.
     * @param ttl Expiration time in seconds (optional).
     */
    async setJSON(key: string, value: object, ttl?: number): Promise<void> {
        const jsonString = JSON.stringify(value);
        await this.setString(key, jsonString, ttl);
    }

    /**
     * Retrieves a JSON object from Redis by key.
     * @param key Redis key.
     * @returns Parsed JSON object or null if key does not exist.
     */
    async getJSON<T>(key: string): Promise<T | null> {
        const jsonString = await this.getString(key);
        return jsonString ? JSON.parse(jsonString) : null;
    }

    /**
     * Sets an array in Redis with an optional expiration time.
     * @param key Redis key.
     * @param value Array to set.
     * @param ttl Expiration time in seconds (optional).
     */
    async setArray<T>(key: string, value: T[], ttl?: number): Promise<void> {
        await this.setJSON(key, value, ttl);
    }

    /**
     * Retrieves an array from Redis by key.
     * @param key Redis key.
     * @returns Array or null if key does not exist.
     */
    async getArray<T>(key: string): Promise<T[] | null> {
        return await this.getJSON<T[]>(key);
    }

    /**
     * Deletes a key from Redis.
     * @param key Redis key to delete.
     */
    async deleteKey(key: string): Promise<void> {
        const redis: any = await this.client;
        await redis.del(key);
    }
}

export default new RedisUtility();
