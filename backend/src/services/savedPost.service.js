const SavedPost = require("../models/SavedPost.model");
const Post = require("../models/Post.model");
const AppError = require("../utils/AppError");

const savePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const existing = await SavedPost.findOne({ user: userId, post: postId });
  if (existing) {
    return { saved: true, message: "Post already saved" };
  }

  await SavedPost.create({
    user: userId,
    post: postId,
  });

  return { saved: true, message: "Post saved successfully" };
};

const unsavePost = async (postId, userId) => {
  const savedPost = await SavedPost.findOne({ user: userId, post: postId });
  if (!savedPost) {
    throw new AppError("Saved post not found", 404);
  }

  await savedPost.deleteOne();
  return { saved: false, message: "Post unsaved successfully" };
};

const getUserSavedPosts = async (userId, page = 1, limit = 20) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const total = await SavedPost.countDocuments({ user: userId });
  const savedItems = await SavedPost.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .populate({
      path: "post",
      populate: {
        path: "author",
        select: "firstName lastName username profilePicture",
      },
    });

  const posts = savedItems.map((item) => item.post).filter(Boolean);

  return {
    posts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
};

module.exports = {
  savePost,
  unsavePost,
  getUserSavedPosts,
};
