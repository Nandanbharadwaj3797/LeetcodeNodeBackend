import { IProblemDetails } from "../apis/problem.api";
import { SubmissionLanguage } from "../models/submission.model";
import { submissionQueue } from "../queues/submission.queue";
import logger from "../config/logger.config";

export interface ISubmissionJob {
    submissionId: string;
    problem: IProblemDetails;
    code: string;
    language: SubmissionLanguage;
}

export async function addSubmissionJob(data: ISubmissionJob): Promise<string> {
    try {
        const job = await submissionQueue.add(
            "evaluate-submission",
            data,
            {
                jobId: data.submissionId, // prevent duplicates

                attempts: 3, // retry 3 times

                backoff: {
                    type: "exponential",
                    delay: 2000
                },

                removeOnComplete: true,
                removeOnFail: false
            }
        );

        logger.info("Submission job added", {
            jobId: job.id,
            submissionId: data.submissionId
        });

        return job.id as string;

    } catch (error) {
        logger.error("Failed to add submission job", {
            error,
            submissionId: data.submissionId
        });

        throw new Error("Failed to enqueue submission job");
    }
}