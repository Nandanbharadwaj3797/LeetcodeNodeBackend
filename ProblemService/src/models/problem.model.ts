import mongoose, { Document } from "mongoose";


export interface ITestcase {
    input: string;
    output: string;
}

export interface IProblem extends Document {
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    constraints: string;
    tags: string[];
    editorial?: string;
    testcases: ITestcase[];
    hiddenTestcases: ITestcase[];
    starterCode: Map<string, string>;
    timeLimit: number;
    memoryLimit: number;
    createdAt: Date;
    updatedAt: Date;
}


const testSchema = new mongoose.Schema<ITestcase>(
    {
        input: {
            type: String,
            required: [true, "Input is required"],
            trim: true,
        },
        output: {
            type: String,
            required: [true, "Output is required"],
            trim: true,
        },
    },
    {
        _id: false, // remove unnecessary _id for each testcase
    }
);


const problemSchema = new mongoose.Schema<IProblem>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            maxLength: [100, "Title must be less than 100 characters"],
            trim: true,
            lowercase: true, // normalize for uniqueness
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        difficulty: {
            type: String,
            enum: {
                values: ["easy", "medium", "hard"],
                message: "Invalid difficulty level",
            },
            default: "easy",
            required: [true, "Difficulty level is required"],
        },


        constraints: {
            type: String,
            required: [true, "Constraints are required"],
            trim: true,
        },

        tags: {
            type: [String],
            default: [],
        },

        editorial: {
            type: String,
            trim: true,
            default: "",
        },

        testcases: {
            type: [testSchema],
            validate: [
                (val: ITestcase[]) => val.length > 0,
                "At least one testcase is required",
            ],
        },

        hiddenTestcases: {
            type: [testSchema],
            default: [],
        },

        starterCode: {
            type: Map,
            of: String,
            default: {},
        },

        timeLimit: {
            type: Number,
            default: 1, // seconds
        },

        memoryLimit: {
            type: Number,
            default: 256, // MB
        },
    },
    {
        timestamps: true,

        toJSON: {
            transform: (_, record) => {
                delete (record as any).__v;
                record.id = record._id;
                delete record._id;
                return record;
            },
        },
    }
);


// Case-insensitive unique title
problemSchema.index(
    { title: 1 },
    {
        unique: true,
        collation: { locale: "en", strength: 2 },
    }
);

// Filter by difficulty
problemSchema.index({ difficulty: 1 });

// Filter by tags (important for search)
problemSchema.index({ tags: 1 });


export const Problem = mongoose.model<IProblem>(
    "Problem",
    problemSchema
);