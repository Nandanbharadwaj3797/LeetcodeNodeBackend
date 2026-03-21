import { 
    ISubmission, 
    Submission, 
    SubmissionStatus 
} from "../models/submission.model";

export interface ISubmissionRepository {
    create(data: Partial<ISubmission>): Promise<ISubmission>;
    findById(id: string): Promise<ISubmission | null>;
    findByProblemId(problemId: string): Promise<ISubmission[]>;
    deleteById(id: string): Promise<boolean>;

    updateStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null>;

    updateResult(
        id: string,
        updateData: Partial<ISubmission>
    ): Promise<ISubmission | null>;

    getPendingSubmissions(limit?: number): Promise<ISubmission[]>;

    markAsRunning(id: string): Promise<ISubmission | null>;
}

export class SubmissionRepository implements ISubmissionRepository {


    async create(data: Partial<ISubmission>): Promise<ISubmission> {
        return await Submission.create(data);
    }


    async findById(id: string): Promise<ISubmission | null> {
        return await Submission.findById(id);
    }

    async findByProblemId(problemId: string): Promise<ISubmission[]> {
        return await Submission.find({ problemId })
            .sort({ createdAt: -1 });
    }


    async deleteById(id: string): Promise<boolean> {
        const result = await Submission.findByIdAndDelete(id);
        return result !== null;
    }


    async updateStatus(
        id: string,
        status: SubmissionStatus
    ): Promise<ISubmission | null> {
        return await Submission.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
    }


    async updateResult(
        id: string,
        updateData: Partial<ISubmission>
    ): Promise<ISubmission | null> {
        return await Submission.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
    }


    async getPendingSubmissions(limit = 10): Promise<ISubmission[]> {
        return await Submission.find({
            status: {
                $in: [SubmissionStatus.PENDING, SubmissionStatus.QUEUED]
            }
        })
        .sort({ createdAt: 1 }) // FIFO
        .limit(limit);
    }


    async markAsRunning(id: string): Promise<ISubmission | null> {
        return await Submission.findOneAndUpdate(
            {
                _id: id,
                status: SubmissionStatus.QUEUED
            },
            {
                status: SubmissionStatus.RUNNING
            },
            { new: true }
        );
    }
}