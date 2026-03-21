import { Request, Response, NextFunction } from "express";
import { ProblemRepository } from "../repositories/problem.repository";
import { ProblemService } from "../services/problem.service";
import {
    createProblemSchema,
    updateProblemSchema,
    findByDifficultySchema,
    searchSchema
} from "../validators/problem.validator";

const problemRepository = new ProblemRepository();
const problemService = new ProblemService(problemRepository);

export const ProblemController = {

    async createProblem(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = createProblemSchema.parse(req.body);

            const problem = await problemService.createProblem(parsed);

            res.status(201).json({
                message: "Problem created successfully",
                data: problem,
                success: true
            });
        } catch (error) {
            next(error);
        }
    },

    async getProblemById(req: Request, res: Response, next: NextFunction) {
        try {
            const problem = await problemService.getProblemById(req.params.id);

            res.status(200).json({
                message: "Problem fetched successfully",
                data: problem,
                success: true
            });
        } catch (error) {
            next(error);
        }
    },

    async getAllProblems(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const problems = await problemService.getAllProblems(page, limit);

            res.status(200).json({
                message: "Problems fetched successfully",
                data: problems,
                success: true
            });
        } catch (error) {
            next(error);
        }
    },

    async updateProblem(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = updateProblemSchema.parse(req.body);

            const problem = await problemService.updateProblem(
                req.params.id,
                parsed
            );

            res.status(200).json({
                message: "Problem updated successfully",
                data: problem,
                success: true
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteProblem(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await problemService.deleteProblem(req.params.id);

            res.status(200).json({
                message: "Problem deleted successfully",
                data: result,
                success: true
            });
        } catch (error) {
            next(error);
        }
    },

    async findByDifficulty(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = findByDifficultySchema.parse(req.params);

            const problems = await problemService.findByDifficulty(parsed.difficulty);

            res.status(200).json({
                message: "Problems fetched successfully",
                data: problems,
                success: true
            });
        } catch (error) {
            next(error);
        }
    },

    async searchProblems(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = searchSchema.parse(req.query);

            const problems = await problemService.searchProblems(parsed.query);

            res.status(200).json({
                message: "Problems fetched successfully",
                data: problems,
                success: true
            });
        } catch (error) {
            next(error);
        }
    }
};