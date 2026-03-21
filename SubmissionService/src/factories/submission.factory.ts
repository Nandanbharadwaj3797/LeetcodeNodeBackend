import { SubmissionController } from "../controllers/submission.controller";
import { SubmissionService } from "../services/submission.service";
import { SubmissionRepository, ISubmissionRepository } from "../repositories/submission.repository";
import logger from "../config/logger.config";

export class SubmissionFactory {
    private static submissionRepository: ISubmissionRepository;
    private static submissionService: SubmissionService;
    private static submissionController: SubmissionController;


    static getSubmissionRepository(): ISubmissionRepository {
        if (!this.submissionRepository) {
            try {
                this.submissionRepository = new SubmissionRepository();
                logger.info("SubmissionRepository initialized");
            } catch (error) {
                logger.error("Failed to initialize SubmissionRepository", error);
                throw error;
            }
        }
        return this.submissionRepository;
    }

    static getSubmissionService(): SubmissionService {
        if (!this.submissionService) {
            try {
                this.submissionService = new SubmissionService(
                    this.getSubmissionRepository()
                );
                logger.info("SubmissionService initialized");
            } catch (error) {
                logger.error("Failed to initialize SubmissionService", error);
                throw error;
            }
        }
        return this.submissionService;
    }


    static getSubmissionController(): SubmissionController {
        if (!this.submissionController) {
            try {
                this.submissionController = new SubmissionController(
                    this.getSubmissionService()
                );
                logger.info("SubmissionController initialized");
            } catch (error) {
                logger.error("Failed to initialize SubmissionController", error);
                throw error;
            }
        }
        return this.submissionController;
    }
}