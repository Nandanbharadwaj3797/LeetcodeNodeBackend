import { Document, Schema, model } from "mongoose";


export enum SubmissionStatus {
    PENDING = "pending",
    QUEUED = "queued",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed"
}

export enum SubmissionLanguage {
    CPP = "cpp",
    PYTHON = "python",
    JAVA = "java",
    JAVASCRIPT = "javascript",
    TYPESCRIPT = "typescript",
    GO = "go",
    RUST = "rust"
}

export enum Verdict {
    ACCEPTED = "accepted",
    WRONG_ANSWER = "wrong_answer",
    TIME_LIMIT_EXCEEDED = "tle",
    MEMORY_LIMIT_EXCEEDED = "mle",
    RUNTIME_ERROR = "runtime_error",
    COMPILATION_ERROR = "compilation_error",
    INTERNAL_ERROR = "internal_error"
}


export interface ITestCaseResult {
    testCaseId: string;
    input?: string;
    expectedOutput?: string;
    actualOutput?: string;
    status: Verdict;
    executionTime?: number;
    memoryUsed?: number;
}

export interface ISubmission extends Document {
    id: string;
    userId: string;
    problemId: string;
    code: string;
    language: SubmissionLanguage;

    status: SubmissionStatus;
    verdict?: Verdict;

    testCases: ITestCaseResult[];

    totalExecutionTime?: number;
    averageExecutionTime?: number;
    memoryUsed?: number;

    errorMessage?: string;

    createdAt: Date;
    updatedAt: Date;
}


const testCaseSchema = new Schema<ITestCaseResult>(
    {
        testCaseId: { type: String, required: true },

        input: String,
        expectedOutput: String,
        actualOutput: String,

        status: {
            type: String,
            enum: Object.values(Verdict) as string[],
            required: true
        },

        executionTime: Number,
        memoryUsed: Number
    },
    { _id: false }
);

const submissionSchema = new Schema<ISubmission>(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },

        problemId: {
            type: String,
            required: true,
            index: true
        },

        code: {
            type: String,
            required: true
        },

        language: {
            type: String,
            required: true,
            enum: Object.values(SubmissionLanguage) as string[]
        },

        status: {
            type: String,
            required: true,
            enum: Object.values(SubmissionStatus) as string[],
            default: SubmissionStatus.PENDING,
            index: true
        },

        verdict: {
            type: String,
            enum: Object.values(Verdict) as string[]
        },

        testCases: {
            type: [testCaseSchema],
            default: []
        },

        totalExecutionTime: Number,
        averageExecutionTime: Number,
        memoryUsed: Number,

        errorMessage: String
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, record: any) => {
                record.id = record._id?.toString();
                delete record._id;
                delete record.__v;
                return record;
            }
        }
    }
);


submissionSchema.index({ userId: 1, createdAt: -1 });

submissionSchema.index({ problemId: 1, createdAt: -1 });

submissionSchema.index({ status: 1, createdAt: -1 });

submissionSchema.index({ userId: 1, problemId: 1, createdAt: -1 });

submissionSchema.index({ userId: 1, problemId: 1, status: 1, createdAt: -1 });

export const Submission = model<ISubmission>("Submission", submissionSchema);