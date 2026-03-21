import mongoose, { Document } from "mongoose";

export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}



export interface ITestcase {
    input: string;
    output: string;
}

export interface IProblem extends Document {
    title: string;
    slug: string;
    description: string;
    difficulty: Difficulty;
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
            required: true,
            trim: true
        },
        output: {
            type: String,
            required: true,
            trim: true
        }
    },
    { _id: false }
);


const problemSchema = new mongoose.Schema<IProblem>(
    {
        title: {
            type: String,
            required: true,
            maxlength: 100,
            trim: true,
            lowercase: true
        },

        slug: {
            type: String,
            unique: true,
            lowercase: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        difficulty: {
            type: String,
            enum: Object.values(Difficulty),
            default: Difficulty.EASY,
            required: true
        },

        constraints: {
            type: String,
            required: true,
            trim: true
        },

        tags: {
            type: [String],
            default: []
        },

        editorial: {
            type: String,
            default: "",
            trim: true
        },

        testcases: {
            type: [testSchema],
            validate: [
                (val: ITestcase[]) => val.length > 0,
                "At least one testcase is required"
            ]
        },


        hiddenTestcases: {
            type: [testSchema],
            default: [],
            select: false
        },

        starterCode: {
            type: Map,
            of: String,
            default: {}
        },

        timeLimit: {
            type: Number,
            default: 1,
            min: 0.5,
            max: 10
        },

        memoryLimit: {
            type: Number,
            default: 256,
            min: 64,
            max: 1024
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, record: any) => {
                record.id = record._id?.toString();
                delete record._id;
                delete record.__v;

                // convert Map → object
                if (record.starterCode instanceof Map) {
                    record.starterCode = Object.fromEntries(record.starterCode);
                }

                return record;
            }
        }
    }
);



problemSchema.pre("save", function () {
    if (this.isModified("title")) {
        this.slug = this.title.replace(/\s+/g, "-").toLowerCase();
    }
});


problemSchema.index(
    { title: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } }
);

problemSchema.index({ difficulty: 1 });
problemSchema.index({ tags: 1 });

problemSchema.index({
    title: "text",
    description: "text"
});



export const Problem = mongoose.model<IProblem>("Problem", problemSchema);