const User = require("../models/User.model");
const Post = require("../models/Post.model");
const AppError = require("../utils/AppError");

// Helper function to extract hashtags from text content
const extractHashtags = (text) => {
  if (!text) return [];
  const matches = text.match(/#[\w\u0600-\u06FF]+/g);
  if (!matches) return [];
  return [...new Set(matches.map((tag) => tag.substring(1).toLowerCase()))];
};

// Helper function to extract mentioned usernames from text content
const extractMentions = async (text) => {
  if (!text) return [];
  const matches = text.match(/@[\w.]+/g);
  if (!matches) return [];
  const usernames = [...new Set(matches.map((m) => m.substring(1).toLowerCase()))];
  const users = await User.find({ username: { $in: usernames } }).select("_id");
  return users.map((u) => u._id);
};

const createPost = async (userId, postData) => {
  const { content = "", image = "", images = [], video = "", link = "", visibility = "public" } = postData;

  const hashtags = extractHashtags(content);
  const mentions = await extractMentions(content);

  const post = await Post.create({
    author: userId,
    content,
    image,
    images: images.length > 0 ? images : image ? [image] : [],
    video,
    link,
    visibility,
    hashtags,
    mentions,
  });

  return await post.populate("author", "firstName lastName username profilePicture isVerified");
};

const getPostById = async (postId) => {
  const post = await Post.findById(postId)
    .populate("author", "firstName lastName username profilePicture isVerified")
    .populate("mentions", "firstName lastName username profilePicture")
    .populate({
      path: "originalPost",
      populate: {
        path: "author",
        select: "firstName lastName username profilePicture",
      },
    });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  return post;
};

const getUserPosts = async (username, page = 1, limit = 20) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const total = await Post.countDocuments({ author: user._id });
  const posts = await Post.find({ author: user._id })
    .populate("author", "firstName lastName username profilePicture isVerified")
    .populate({
      path: "originalPost",
      populate: {
        path: "author",
        select: "firstName lastName username profilePicture",
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

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

const updatePost = async (postId, userId, updateData) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.author.toString() !== userId.toString()) {
    throw new AppError("Not authorized to update this post", 403);
  }

  if (updateData.content !== undefined) {
    post.content = updateData.content;
    post.hashtags = extractHashtags(updateData.content);
    post.mentions = await extractMentions(updateData.content);
  }

  if (updateData.visibility !== undefined) {
    post.visibility = updateData.visibility;
  }

  await post.save();

  return await post.populate("author", "firstName lastName username profilePicture isVerified");
};

const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.author.toString() !== userId.toString()) {
    throw new AppError("Not authorized", 403);
  }

  await post.deleteOne();
  return true;
};

const sharePost = async (postId, userId, shareComment = "") => {
  const originalPost = await Post.findById(postId);
  if (!originalPost) {
    throw new AppError("Original post not found", 404);
  }

  const sharedPost = await Post.create({
    author: userId,
    content: shareComment,
    shareComment,
    originalPost: postId,
    visibility: "public",
  });

  originalPost.sharesCount += 1;
  await originalPost.save();

  return await sharedPost.populate([
    { path: "author", select: "firstName lastName username profilePicture isVerified" },
    {
      path: "originalPost",
      populate: { path: "author", select: "firstName lastName username profilePicture" },
    },
  ]);
};

const getPostShares = async (postId, page = 1, limit = 20) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const total = await Post.countDocuments({ originalPost: postId });
  const shares = await Post.find({ originalPost: postId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .populate("author", "firstName lastName username profilePicture isVerified");

  return {
    shares,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
};

module.exports = {
  createPost,
  getPostById,
  getUserPosts,
  updatePost,
  deletePost,
  sharePost,
  getPostShares,
};
