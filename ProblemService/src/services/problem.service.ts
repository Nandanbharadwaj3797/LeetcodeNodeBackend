import { CreateProblemDto, UpdateProblemDto } from "../validators/problem.validator";
import { IProblem } from "../models/problem.model";
import { IProblemRepository } from "../repositories/problem.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { sanitizeMarkdown } from "../utils/markdown.sanitizer";

export interface IProblemService {
    createProblem(problem: CreateProblemDto): Promise<IProblem>;
    getProblemById(id: string): Promise<Partial<IProblem>>;
    getAllProblems(page: number, limit: number): Promise<{ problems: Partial<IProblem>[], total: number }>;
    updateProblem(id: string, updateData: UpdateProblemDto): Promise<IProblem | null>;
    deleteProblem(id: string): Promise<boolean>;
    findByDifficulty(difficulty: "easy" | "medium" | "hard"): Promise<Partial<IProblem>[]>;
    searchProblems(query: string): Promise<Partial<IProblem>[]>;
}

export class ProblemService implements IProblemService {

    constructor(private problemRepository: IProblemRepository) {}

    private sanitizeResponse(problem: IProblem): Partial<IProblem> {
        const obj: any = { ...problem };
        delete obj.hiddenTestcases;
        return obj;
    }

    private toStarterCodeMap(
        starterCode?: Record<string, string>
    ): Map<string, string> | undefined {
        if (!starterCode) {
            return undefined;
        }

        return new Map(Object.entries(starterCode));
    }


    async createProblem(problem: CreateProblemDto): Promise<IProblem> {
        const sanitizedPayload: Partial<IProblem> = {
            ...problem,
            title: problem.title.trim().toLowerCase(),

            tags: problem.tags?.map(tag => tag.trim().toLowerCase()) || [],

            description: await sanitizeMarkdown(problem.description),

            editorial:
                problem.editorial &&
                (await sanitizeMarkdown(problem.editorial)),
            starterCode: this.toStarterCodeMap(problem.starterCode),
        };

        return await this.problemRepository.createProblem(sanitizedPayload);
    }


    async getProblemById(id: string): Promise<Partial<IProblem>> {
        const problem = await this.problemRepository.getProblemById(id);

        if (!problem) {
            throw new NotFoundError("Problem not found");
        }

        return this.sanitizeResponse(problem);
    }


    async getAllProblems(
        page: number = 1,
        limit: number = 10
    ): Promise<{ problems: Partial<IProblem>[]; total: number }> {

        const { problems, total } =
            await this.problemRepository.getAllProblems(page, limit);

        return {
            problems: problems.map(p => this.sanitizeResponse(p)),
            total,
        };
    }

    async updateProblem(
        id: string,
        updateData: UpdateProblemDto
    ): Promise<IProblem | null> {

        const problem = await this.problemRepository.getProblemById(id);

        if (!problem) {
            throw new NotFoundError("Problem not found");
        }

        const sanitizedPayload: Partial<IProblem> = {};

        if (updateData.difficulty) {
            sanitizedPayload.difficulty = updateData.difficulty;
        }

        if (updateData.constraints) {
            sanitizedPayload.constraints = updateData.constraints;
        }

        if (updateData.testcases) {
            sanitizedPayload.testcases = updateData.testcases;
        }

        if (updateData.hiddenTestcases) {
            sanitizedPayload.hiddenTestcases = updateData.hiddenTestcases;
        }

        if (updateData.timeLimit !== undefined) {
            sanitizedPayload.timeLimit = updateData.timeLimit;
        }

        if (updateData.memoryLimit !== undefined) {
            sanitizedPayload.memoryLimit = updateData.memoryLimit;
        }

        if (updateData.starterCode) {
            sanitizedPayload.starterCode = this.toStarterCodeMap(updateData.starterCode);
        }

        if (updateData.title) {
            sanitizedPayload.title = updateData.title.trim().toLowerCase();
        }

        if (updateData.tags) {
            sanitizedPayload.tags = updateData.tags.map(tag =>
                tag.trim().toLowerCase()
            );
        }

        if (updateData.description) {
            sanitizedPayload.description = await sanitizeMarkdown(updateData.description);
        }

        if (updateData.editorial) {
            sanitizedPayload.editorial = await sanitizeMarkdown(updateData.editorial);
        }

        return await this.problemRepository.updateProblem(id, sanitizedPayload);
    }


    async deleteProblem(id: string): Promise<boolean> {
        const result = await this.problemRepository.deleteProblem(id);

        if (!result) {
            throw new NotFoundError("Problem not found");
        }

        return result;
    }


    async findByDifficulty(
        difficulty: "easy" | "medium" | "hard"
    ): Promise<Partial<IProblem>[]> {

        const problems = await this.problemRepository.findByDifficulty(difficulty);

        return problems.map(p => this.sanitizeResponse(p));
    }

    async searchProblems(query: string): Promise<Partial<IProblem>[]> {
        if (!query || query.trim() === "") {
            throw new BadRequestError("Query is required");
        }

        const problems = await this.problemRepository.searchProblems(query);

        return problems.map(p => this.sanitizeResponse(p));
    }
}