const Comment = require("../models/Comment.model");
const Post = require("../models/Post.model");
const AppError = require("../utils/AppError");

const createComment = async (postId, userId, content, parentCommentId = null) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  let parentComment = null;
  if (parentCommentId) {
    parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      throw new AppError("Parent comment not found", 404);
    }
    if (parentComment.post.toString() !== postId.toString()) {
      throw new AppError("Parent comment does not belong to this post", 400);
    }
  }

  const comment = await Comment.create({
    post: postId,
    author: userId,
    content,
    parentComment: parentCommentId || null,
  });

  if (parentComment) {
    parentComment.repliesCount += 1;
    await parentComment.save();
  }

  post.commentsCount += 1;
  await post.save();

  return await comment.populate("author", "firstName lastName username profilePicture");
};

const getPostComments = async (postId, page = 1, limit = 20, parentCommentId = null) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const query = {
    post: postId,
    parentComment: parentCommentId ? parentCommentId : null,
  };

  const total = await Comment.countDocuments(query);
  const comments = await Comment.find(query)
    .sort({ createdAt: parentCommentId ? 1 : -1 })
    .skip(skip)
    .limit(limitNum)
    .populate("author", "firstName lastName username profilePicture");

  return {
    comments,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
};

const updateComment = async (commentId, userId, content) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.author.toString() !== userId.toString()) {
    throw new AppError("Not authorized to update this comment", 403);
  }

  comment.content = content;
  await comment.save();

  return await comment.populate("author", "firstName lastName username profilePicture");
};

const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  const post = await Post.findById(comment.post);

  const isAuthor = comment.author.toString() === userId.toString();
  const isPostOwner = post && post.author.toString() === userId.toString();

  if (!isAuthor && !isPostOwner) {
    throw new AppError("Not authorized to delete this comment", 403);
  }

  // Count nested replies to update post commentsCount properly
  const repliesCount = await Comment.countDocuments({ parentComment: commentId });
  await Comment.deleteMany({ parentComment: commentId });
  await comment.deleteOne();

  if (comment.parentComment) {
    await Comment.findByIdAndUpdate(comment.parentComment, {
      $inc: { repliesCount: -1 },
    });
  }

  if (post) {
    const totalDeleted = 1 + repliesCount;
    post.commentsCount = Math.max(0, post.commentsCount - totalDeleted);
    await post.save();
  }

  return true;
};

module.exports = {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
};
