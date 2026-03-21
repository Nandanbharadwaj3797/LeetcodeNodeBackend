import { NextFunction, Request, Response } from "express";
import logger from "../config/logger.config";
import { SubmissionService } from "../services/submission.service";

export class SubmissionController {
    private submissionService: SubmissionService;

    constructor(submissionService: SubmissionService) {
        this.submissionService = submissionService;
    }



    createSubmission = async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("Creating new submission", { body: req.body });

            const submission = await this.submissionService.createSubmission(req.body);

            logger.info("Submission created", { submissionId: submission.id });

            res.status(201).json({
                success: true,
                message: "Submission created successfully",
                data: submission
            });
        } catch (error) {
            logger.error("Error creating submission", error);
            next(error);
        }
    };


    getSubmissionById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            logger.info("Fetching submission", { submissionId: id });

            const submission = await this.submissionService.getSubmissionById(id);

            res.status(200).json({
                success: true,
                message: "Submission fetched successfully",
                data: submission
            });
        } catch (error) {
            logger.error("Error fetching submission", error);
            next(error);
        }
    };

    getSubmissionsByProblemId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { problemId } = req.params;

            logger.info("Fetching submissions by problem", { problemId });

            const submissions = await this.submissionService.getSubmissionsByProblemId(problemId);

            res.status(200).json({
                success: true,
                message: "Submissions fetched successfully",
                data: submissions
            });
        } catch (error) {
            logger.error("Error fetching submissions", error);
            next(error);
        }
    };



    deleteSubmissionById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            logger.info("Deleting submission", { submissionId: id });

            await this.submissionService.deleteSubmissionById(id);

            res.status(200).json({
                success: true,
                message: "Submission deleted successfully"
            });
        } catch (error) {
            logger.error("Error deleting submission", error);
            next(error);
        }
    };

    updateSubmissionStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            logger.info("Updating submission status", {
                submissionId: id,
                status
            });

            const submission = await this.submissionService.updateSubmissionStatus(id, status);

            res.status(200).json({
                success: true,
                message: "Submission status updated successfully",
                data: submission
            });
        } catch (error) {
            logger.error("Error updating submission status", error);
            next(error);
        }
    };


    updateSubmissionResult = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            logger.info("Updating submission result", { submissionId: id });

            const submission = await this.submissionService.updateSubmissionResult(id, req.body);

            res.status(200).json({
                success: true,
                message: "Submission result updated successfully",
                data: submission
            });
        } catch (error) {
            logger.error("Error updating submission result", error);
            next(error);
        }
    };
}