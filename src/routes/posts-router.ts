import { Router } from 'express';
import { postControllers } from '../entities/posts/post.controller';
import { postInputValidators } from '../entities/posts/middlewares';
import { inputCheckErrorsMiddleware } from '../middlewares/inputCheckErrorsMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';
import { mongoIdParamsValidator, paginationQueryValidator } from '../middlewares/validators';
import { searchNameTermValidator } from '../entities/posts/validators';

export const postsRouter = Router();

postsRouter.get(
	'/',
	[...paginationQueryValidator, searchNameTermValidator],
	inputCheckErrorsMiddleware,
	postControllers.getAll,
);
postsRouter.get(
	'/:id',
	mongoIdParamsValidator,
	inputCheckErrorsMiddleware,
	postControllers.findById,
);
postsRouter.post(
	'/',
	authMiddleware,
	postInputValidators,
	inputCheckErrorsMiddleware,
	postControllers.create,
);
postsRouter.put(
	'/:id',
	authMiddleware,
	postInputValidators,
	mongoIdParamsValidator,
	inputCheckErrorsMiddleware,
	postControllers.update,
);
postsRouter.delete(
	'/:id',
	authMiddleware,
	mongoIdParamsValidator,
	inputCheckErrorsMiddleware,
	postControllers.remove,
);
