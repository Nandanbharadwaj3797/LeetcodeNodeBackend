import { z } from "zod";
import { SubmissionLanguage, SubmissionStatus, Verdict } from "../models/submission.model";


export const createSubmissionSchema = z.object({
    problemId: z.string().min(1, "Problem ID is required"),
    code: z.string().min(1, "Code is required"),
    language: z.nativeEnum(SubmissionLanguage)
});



const testCaseSchema = z.object({
    testCaseId: z.string().min(1),
    input: z.string().optional(),
    expectedOutput: z.string().optional(),
    actualOutput: z.string().optional(),
    status: z.nativeEnum(Verdict),
    executionTime: z.number().optional(),
    memoryUsed: z.number().optional()
});



export const updateSubmissionStatusSchema = z.object({
    status: z.nativeEnum(SubmissionStatus)
});



export const updateSubmissionResultSchema = z.object({
    status: z.nativeEnum(SubmissionStatus).optional(),
    verdict: z.nativeEnum(Verdict).optional(),
    testCases: z.array(testCaseSchema).optional(),
    totalExecutionTime: z.number().optional(),
    averageExecutionTime: z.number().optional(),
    memoryUsed: z.number().optional(),
    errorMessage: z.string().optional()
});



export const submissionQuerySchema = z.object({
    status: z.nativeEnum(SubmissionStatus).optional(),
    language: z.nativeEnum(SubmissionLanguage).optional(),

    limit: z.coerce.number().min(1).max(100).optional(),
    page: z.coerce.number().min(1).optional()
});