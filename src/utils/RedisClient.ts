import Redis from "ioredis";
import * as dotenv from "dotenv";

dotenv.config();

class RedisClient {
  private static instance: RedisClient;
  private client: Redis | null;

  private constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST, // Replace with your ElastiCache Redis endpoint
      port: Number(process.env.REDIS_PORT) || 6379, // Default Redis port is 6379
      // password: process.env.REDIS_PASSWORD, // Optional, if Redis requires authentication
      tls: process.env.REDIS_TLS === "true" ? {} : undefined,
    });
  }

  public static async getInstance(): Promise<RedisClient> {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
      if (RedisClient.instance.client) {
        await RedisClient.instance.waitForConnection();
      }
    }
    return RedisClient.instance;
  }

  private waitForConnection(): Promise<void> {
    if (!this.client) {
      return Promise.resolve(); // If Redis is disabled, skip connection logic.
    }

    return new Promise((resolve, reject) => {
      this.client!.on("connect", () => {
        console.log("Redis connected successfully.");
        resolve();
      });

      this.client!.on("error", (err) => {
        console.log("Redis connection error.", err);
        reject(err);
      });
    });
  }

  public getClient(): Redis | null {
    return this.client;
  }
}

export default RedisClient;
