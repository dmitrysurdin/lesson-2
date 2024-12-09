import { Router } from 'express';
import { blogControllers } from '../entities/blogs/blog.controller';
import {
	blogIdParamValidator,
	blogInputValidators,
	postForABlogInputValidators,
} from '../entities/blogs/middlewares';
import { inputCheckErrorsMiddleware } from '../middlewares/inputCheckErrorsMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';
import { mongoIdParamsValidator, paginationQueryValidator } from '../middlewares/validators';
import { paramsCheckErrorsMiddleware } from '../middlewares/paramsCheckErrorsMiddleware';
import { searchNameTermValidator } from '../entities/blogs/validators';

export const blogsRouter = Router();

blogsRouter.get(
	'/',
	[...paginationQueryValidator, searchNameTermValidator],
	inputCheckErrorsMiddleware,
	blogControllers.getAll,
);
blogsRouter.get(
	'/:blogId/posts',
	blogIdParamValidator,
	paramsCheckErrorsMiddleware,
	[...paginationQueryValidator, searchNameTermValidator],
	inputCheckErrorsMiddleware,
	blogControllers.getAllPostsByBlogId,
);
blogsRouter.get(
	'/:id',
	mongoIdParamsValidator,
	inputCheckErrorsMiddleware,
	blogControllers.findById,
);

blogsRouter.post(
	'/',
	authMiddleware,
	blogInputValidators,
	inputCheckErrorsMiddleware,
	blogControllers.create,
);
blogsRouter.post(
	'/:blogId/posts',
	authMiddleware,
	blogIdParamValidator,
	paramsCheckErrorsMiddleware,
	postForABlogInputValidators,
	inputCheckErrorsMiddleware,
	blogControllers.createPostForBlog,
);
blogsRouter.put(
	'/:id',
	authMiddleware,
	blogInputValidators,
	mongoIdParamsValidator,
	inputCheckErrorsMiddleware,
	blogControllers.update,
);
blogsRouter.delete(
	'/:id',
	authMiddleware,
	mongoIdParamsValidator,
	inputCheckErrorsMiddleware,
	blogControllers.remove,
);
