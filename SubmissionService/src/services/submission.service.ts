import { getProblemById } from "../apis/problem.api";
import logger from "../config/logger.config";
import { 
    ISubmission, 
    SubmissionStatus 
} from "../models/submission.model";
import { addSubmissionJob } from"../producers/submission.producer";
import { ISubmissionRepository } from "../repositories/submission.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";

export interface ISubmissionService {
    createSubmission(data: Partial<ISubmission>): Promise<ISubmission>;
    getSubmissionById(id: string): Promise<ISubmission>;
    getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]>;
    deleteSubmissionById(id: string): Promise<boolean>;

    updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<ISubmission>;

    updateSubmissionResult(
        id: string,
        updateData: Partial<ISubmission>
    ): Promise<ISubmission>;
}

export class SubmissionService implements ISubmissionService {

    private submissionRepository: ISubmissionRepository;

    constructor(submissionRepository: ISubmissionRepository) {
        this.submissionRepository = submissionRepository;
    }


    async createSubmission(data: Partial<ISubmission>): Promise<ISubmission> {

        if (!data.problemId) throw new BadRequestError("Problem ID is required");
        if (!data.code) throw new BadRequestError("Code is required");
        if (!data.language) throw new BadRequestError("Language is required");

        logger.info("Fetching problem", { problemId: data.problemId });

        const problem = await getProblemById(data.problemId);

        if (!problem) {
            throw new NotFoundError("Problem not found");
        }

        // enforce default status
        data.status = SubmissionStatus.PENDING;

        const submission = await this.submissionRepository.create(data);

        try {
            const jobId = await addSubmissionJob({
                submissionId: submission.id,
                problem,
                code: data.code,
                language: data.language
            });

            logger.info("Submission queued", { jobId });

            // update status → QUEUED
            await this.submissionRepository.updateStatus(
                submission.id,
                SubmissionStatus.QUEUED
            );

        } catch (error) {
            logger.error("Queue failed", error);

            await this.submissionRepository.updateStatus(
                submission.id,
                SubmissionStatus.FAILED
            );

            throw new Error("Failed to queue submission");
        }

        return submission;
    }


    async getSubmissionById(id: string): Promise<ISubmission> {
        const submission = await this.submissionRepository.findById(id);

        if (!submission) {
            throw new NotFoundError("Submission not found");
        }

        return submission;
    }

    async getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]> {
        return await this.submissionRepository.findByProblemId(problemId);
    }


    async deleteSubmissionById(id: string): Promise<boolean> {
        const result = await this.submissionRepository.deleteById(id);

        if (!result) {
            throw new NotFoundError("Submission not found");
        }

        return result;
    }


    async updateSubmissionStatus(
        id: string,
        status: SubmissionStatus
    ): Promise<ISubmission> {

        const submission = await this.submissionRepository.updateStatus(id, status);

        if (!submission) {
            throw new NotFoundError("Submission not found");
        }

        return submission;
    }


    async updateSubmissionResult(
        id: string,
        updateData: Partial<ISubmission>
    ): Promise<ISubmission> {

        const submission = await this.submissionRepository.updateResult(id, updateData);

        if (!submission) {
            throw new NotFoundError("Submission not found");
        }

        return submission;
    }
}