import { AxiosError, AxiosResponse } from "axios";
import httpClient from "../utils/httpClient";
import { serverConfig } from "../config";
import { InternalServerError, NotFoundError } from "../utils/errors/app.error";
import logger from "../config/logger.config";


export interface ITestcase {
    input: string;
    output: string;
}

export interface IProblemDetails {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    constraints: string;
    tags: string[];
    editorial?: string;
    testcases: ITestcase[];
    timeLimit: number;
    memoryLimit: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProblemResponse {
    data: IProblemDetails;
    message: string;
    success: boolean;
}



export async function getProblemById(problemId: string): Promise<IProblemDetails> {
    const url = `${serverConfig.PROBLEM_SERVICE}/problems/${problemId}`;

    try {
        logger.info("Fetching problem", { problemId });

        const response: AxiosResponse<IProblemResponse> =
            await httpClient.get(url);

        if (!response.data.success) {
            throw new InternalServerError("Problem service returned failure");
        }

        return response.data.data;

    } catch (error) {

        if (error instanceof AxiosError) {
            const status = error.response?.status;

            logger.error("Problem API error", {
                problemId,
                status,
                data: error.response?.data
            });

            if (status === 404) {
                throw new NotFoundError("Problem not found");
            }

            throw new InternalServerError("Problem service unavailable");
        }

        logger.error("Unexpected error", { problemId, error });

        throw new InternalServerError("Unexpected error occurred");
    }
}