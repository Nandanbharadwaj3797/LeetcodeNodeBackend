import { ITestcase } from "../models/problem.model";


export interface CreateProblemDto {
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";

    constraints: string;
    tags?: string[]; 

    editorial?: string;

    testcases: ITestcase[];          
    hiddenTestcases?: ITestcase[];    

    starterCode?: Record<string, string>; 

    timeLimit?: number;  
    memoryLimit?: number; 
}


export interface UpdateProblemDto {
    title?: string;
    description?: string;
    difficulty?: "easy" | "medium" | "hard";

    constraints?: string;
    tags?: string[];

    editorial?: string;

    testcases?: ITestcase[];
    hiddenTestcases?: ITestcase[];

    starterCode?: Record<string, string>;

    timeLimit?: number;
    memoryLimit?: number;
}