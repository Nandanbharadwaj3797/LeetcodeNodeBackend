import { z } from "zod";



const testcaseSchema = z.object({
    input: z.string().trim().min(1, "Input is required"),
    output: z.string().trim().min(1, "Output is required"),
});



export const createProblemSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .transform(val => val.toLowerCase()),
    description: z
        .string()
        .trim()
        .min(1, "Description is required"),

    difficulty: z.enum(["easy", "medium", "hard"]),

    constraints: z
        .string()
        .trim()
        .min(1, "Constraints are required"),

    tags: z
        .array(
            z.string().trim().min(1).transform(tag => tag.toLowerCase())
        )
        .max(10)
        .optional()
        .refine(tags => !tags || new Set(tags).size === tags.length, {
            message: "Duplicate tags are not allowed",
        }),

    editorial: z.string().trim().optional(),

    testcases: z
        .array(testcaseSchema)
        .min(1, "At least one testcase is required"),

    hiddenTestcases: z
        .array(testcaseSchema)
        .optional(),

    starterCode: z
        .record(z.enum(["cpp", "java", "python", "javascript"]), z.string().min(1))
        .optional(),

    timeLimit: z.number().positive().max(10).default(1),
    memoryLimit: z.number().positive().max(1024).default(256),
});



export const updateProblemSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .transform(val => val.toLowerCase())
        .optional(),

    description: z.string().trim().min(1).optional(),

    difficulty: z.enum(["easy", "medium", "hard"]).optional(),

    constraints: z.string().trim().min(1).optional(),

    tags: z
        .array(
            z.string().trim().min(1).transform(tag => tag.toLowerCase())
        )
        .optional()
        .refine(tags => !tags || new Set(tags).size === tags.length, {
            message: "Duplicate tags are not allowed",
        }),

    editorial: z.string().trim().optional(),

    testcases: z.array(testcaseSchema).min(1).optional(),

    hiddenTestcases: z.array(testcaseSchema).optional(),

    starterCode: z
        .record(z.enum(["cpp", "java", "python", "javascript"]), z.string().min(1))
        .optional(),

    timeLimit: z.number().positive().max(10).optional(),

    memoryLimit: z.number().positive().max(1024).optional(),
});



export const findByDifficultySchema = z.object({
    difficulty: z.enum(["easy", "medium", "hard"]),
});

export const searchSchema = z.object({
    query: z.string().trim().min(1, "Search query is required"),
});



export type CreateProblemDto = z.infer<typeof createProblemSchema>;
export type UpdateProblemDto = z.infer<typeof updateProblemSchema>;