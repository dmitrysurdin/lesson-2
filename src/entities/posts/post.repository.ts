import { CommentForPostDbModel, PostModel } from './post.types';
import { ObjectId, SortDirection, WithId } from 'mongodb';
import { commentsCollection, postCollection } from '../../db/mongo-db';

const create = async (post: PostModel): Promise<string> => {
	const result = await postCollection.insertOne({ ...post });

	return result.insertedId.toString();
};

const getAll = async ({
	limit,
	skip,
	sortDirection,
	sortBy,
	searchNameTerm,
}: {
	limit: number;
	skip: number;
	sortDirection: SortDirection;
	sortBy: string;
	searchNameTerm: string | null;
}): Promise<{
	totalCount: number;
	items: Array<WithId<PostModel>>;
}> => {
	const filter = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};
	const sortOption: [string, SortDirection][] = [[sortBy, sortDirection]];

	const items = await postCollection
		.find(filter)
		.sort(sortOption)
		.skip(skip)
		.limit(limit)
		.toArray();
	const totalCount = await postCollection.countDocuments(filter);

	return { items, totalCount };
};

const findById = async (id: string): Promise<WithId<PostModel> | null> => {
	return postCollection.findOne({ _id: new ObjectId(id) });
};

const update = async (id: string, updatedPost: PostModel): Promise<boolean> => {
	const { title, shortDescription, content, blogId } = updatedPost;
	const result = await postCollection.updateOne(
		{ _id: new ObjectId(id) },
		{ $set: { title, shortDescription, content, blogId } },
	);

	return !!result.matchedCount;
};

const remove = async (id: string): Promise<boolean> => {
	const result = await postCollection.deleteOne({ _id: new ObjectId(id) });

	return !!result.deletedCount;
};

const createCommentForPost = async (comment: CommentForPostDbModel): Promise<string> => {
	const result = await commentsCollection.insertOne({ ...comment });

	return result.insertedId.toString();
};

const getAllCommentsForPost = async ({
	limit,
	skip,
	sortDirection,
	sortBy,
	postId,
}: {
	limit: number;
	skip: number;
	sortDirection: SortDirection;
	sortBy: string;
	postId: string;
}): Promise<{
	totalCount: number;
	items: Array<WithId<CommentForPostDbModel>>;
}> => {
	const sortOption: [string, SortDirection][] = [[sortBy, sortDirection]];

	const items = await commentsCollection
		.find({ postId })
		.sort(sortOption)
		.skip(skip)
		.limit(limit)
		.toArray();
	const totalCount = await commentsCollection.countDocuments({ postId });

	return { items, totalCount };
};

export const postRepositories = {
	create,
	getAll,
	findById,
	update,
	remove,
	createCommentForPost,
	getAllCommentsForPost,
};
