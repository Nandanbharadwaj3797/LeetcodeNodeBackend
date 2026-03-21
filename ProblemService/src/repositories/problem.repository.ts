import { Difficulty, IProblem, Problem } from "../models/problem.model";

export interface IProblemRepository {
    createProblem(problem: Partial<IProblem>): Promise<IProblem>;
    getProblemById(id: string): Promise<IProblem | null>;
    getAllProblems(
        page: number,
        limit: number
    ): Promise<{ problems: IProblem[]; total: number }>;
    updateProblem(id: string, updateData: Partial<IProblem>): Promise<IProblem | null>;
    deleteProblem(id: string): Promise<boolean>;
    findByDifficulty(difficulty: Difficulty): Promise<IProblem[]>;
    searchProblems(query: string): Promise<IProblem[]>;
}

export class ProblemRepository implements IProblemRepository {

    async createProblem(problem: Partial<IProblem>): Promise<IProblem> {
        try {
            const newProblem = new Problem(problem);
            return await newProblem.save();
        } catch (error) {
            throw new Error("Error creating problem: " + error);
        }
    }

    async getProblemById(id: string): Promise<IProblem | null> {
        try {
            return await Problem.findById(id).lean();
        } catch (error) {
            throw new Error("Error fetching problem by ID");
        }
    }

    async getAllProblems(
        page: number = 1,
        limit: number = 10
    ): Promise<{ problems: IProblem[]; total: number }> {
        try {
            const skip = (page - 1) * limit;

            const [problems, total] = await Promise.all([
                Problem.find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),

                Problem.countDocuments(),
            ]);

            return { problems, total };
        } catch (error) {
            throw new Error("Error fetching problems");
        }
    }

    async updateProblem(
        id: string,
        updateData: Partial<IProblem>
    ): Promise<IProblem | null> {
        try {
            return await Problem.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            }).lean();
        } catch (error) {
            throw new Error("Error updating problem");
        }
    }

    async deleteProblem(id: string): Promise<boolean> {
        try {
            const result = await Problem.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            throw new Error("Error deleting problem");
        }
    }

    async findByDifficulty(
        difficulty: Difficulty
    ): Promise<IProblem[]> {
        try {
            return await Problem.find({ difficulty })
                .sort({ createdAt: -1 })
                .lean();
        } catch (error) {
            throw new Error("Error filtering by difficulty");
        }
    }


    async searchProblems(query: string): Promise<IProblem[]> {
        try {
            return await Problem.find({
                $text: { $search: query },
            })
                .sort({ score: { $meta: "textScore" } })
                .lean();
        } catch (error) {
            throw new Error("Error searching problems");
        }
    }
}