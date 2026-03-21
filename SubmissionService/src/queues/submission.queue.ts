
import { Queue, QueueEvents } from "bullmq";
import logger from "../config/logger.config";

const queueConnection = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null as null
};
const queueEventsConnection = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null as null
};



export const submissionQueue = new Queue("submission", {
    connection: queueConnection,

    defaultJobOptions: {
        attempts: 3,

        backoff: {
            type: "exponential",
            delay: 2000
        },

        removeOnComplete: true,

        removeOnFail: {
            count: 1000
        }
    }
});



export const submissionQueueEvents = new QueueEvents("submission", {
    connection: queueEventsConnection
});



submissionQueueEvents.on("waiting", ({ jobId }) => {
    logger.info("Job waiting", { jobId });
});

submissionQueueEvents.on("active", ({ jobId }) => {
    logger.info("Job started", { jobId });
});

submissionQueueEvents.on("completed", ({ jobId }) => {
    logger.info("Job completed", { jobId });
});

submissionQueueEvents.on("failed", ({ jobId, failedReason }) => {
    logger.error("Job failed", {
        jobId,
        reason: failedReason
    });
});

submissionQueueEvents.on("error", (error) => {
    logger.error("Queue events error", { error });
});



const shutdown = async () => {
    try {
        logger.info("Shutting down submission queue...");

        await submissionQueue.close();
        await submissionQueueEvents.close();

        logger.info("Submission queue closed successfully");
    } catch (error) {
        logger.error("Error shutting down queue", { error });
    } finally {
        process.exit(0);
    }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);