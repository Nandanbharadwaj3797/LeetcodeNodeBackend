import Redis from "ioredis";
import logger from "./logger.config";

const redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,

    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
    enableReadyCheck: true,
    lazyConnect: true,
    connectionName: "movie-booking-redis",

    retryStrategy: (times: number) => {
        logger.warn(`Retrying Redis connection: attempt ${times}`);
        return Math.min(times * 200, 5000);
    },

    reconnectOnError: (err: Error) => {
        logger.error("Reconnect on Redis error:", err);
        return true;
    }
};

export const redis = new Redis(redisConfig);

export const connectRedis = async () => {
    try {
        await redis.connect();
        logger.info("Connected to Redis successfully");
    } catch (error) {
        logger.error("Failed to connect Redis", error);
    }
};

redis.on("ready", () => {
    logger.info("Redis is ready to use");
});

redis.on("error", (error) => {
    logger.error("Redis connection error", error);
});

redis.on("close", () => {
    logger.warn("Redis connection closed");
});

// Graceful shutdown
process.on("SIGINT", async () => {
    await redis.quit();
    logger.info("Redis connection closed on app termination");
    process.exit(0);
});

export const createNewRedisConnection = () => {
    return new Redis(redisConfig);
};