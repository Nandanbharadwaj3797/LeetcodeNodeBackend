import express from 'express';
import {
    validateRequestBody,
    validateRequestParams,
    validateRequestQuery
} from '../../validators';

import {
    createProblemSchema,
    findByDifficultySchema,
    updateProblemSchema,
    searchSchema
} from '../../validators/problem.validator';

import { ProblemController } from '../../controllers/problem.controller';

const problemRouter = express.Router();



problemRouter.get(
    '/search',
    validateRequestQuery(searchSchema),
    ProblemController.searchProblems
);

problemRouter.get(
    '/difficulty/:difficulty',
    validateRequestParams(findByDifficultySchema),
    ProblemController.findByDifficulty
);



problemRouter.post(
    '/',
    validateRequestBody(createProblemSchema),
    ProblemController.createProblem
);

problemRouter.get(
    '/',
    ProblemController.getAllProblems
);

problemRouter.get(
    '/:id',
    ProblemController.getProblemById
);

problemRouter.put(
    '/:id',
    validateRequestBody(updateProblemSchema),
    ProblemController.updateProblem
);

problemRouter.delete(
    '/:id',
    ProblemController.deleteProblem
);

export default problemRouter;