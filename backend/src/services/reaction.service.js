const Reaction = require("../models/Reaction.model");
const Post = require("../models/Post.model");
const AppError = require("../utils/AppError");

const VALID_TYPES = ["like", "love", "haha", "wow", "sad", "angry"];

const reactToPost = async (postId, userId, type) => {
  if (!VALID_TYPES.includes(type)) {
    throw new AppError("Invalid reaction type", 400);
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (!post.reactionsCount) {
    post.reactionsCount = { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 };
  }

  const existingReaction = await Reaction.findOne({ post: postId, user: userId });

  if (existingReaction) {
    if (existingReaction.type === type) {
      return { reaction: existingReaction, reactionsCount: post.reactionsCount };
    }

    const oldType = existingReaction.type;
    existingReaction.type = type;
    await existingReaction.save();

    // Adjust post count breakdown
    if (post.reactionsCount[oldType] > 0) {
      post.reactionsCount[oldType] -= 1;
    }
    post.reactionsCount[type] = (post.reactionsCount[type] || 0) + 1;

    // Handle legacy likes array
    if (oldType === "like") {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    }
    if (type === "like" && !post.likes.includes(userId)) {
      post.likes.push(userId);
    }
    post.likesCount = post.likes.length;

    post.markModified("reactionsCount");
    await post.save();

    return { reaction: existingReaction, reactionsCount: post.reactionsCount };
  }

  const newReaction = await Reaction.create({
    post: postId,
    user: userId,
    type,
  });

  post.reactionsCount[type] = (post.reactionsCount[type] || 0) + 1;
  if (type === "like" && !post.likes.includes(userId)) {
    post.likes.push(userId);
  }
  post.likesCount = post.likes.length;

  post.markModified("reactionsCount");
  await post.save();

  return { reaction: newReaction, reactionsCount: post.reactionsCount };
};

const removeReaction = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const reaction = await Reaction.findOne({ post: postId, user: userId });
  if (!reaction) {
    throw new AppError("Reaction not found", 404);
  }

  const oldType = reaction.type;
  await reaction.deleteOne();

  if (post.reactionsCount && post.reactionsCount[oldType] > 0) {
    post.reactionsCount[oldType] -= 1;
  }

  if (oldType === "like") {
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    post.likesCount = post.likes.length;
  }

  post.markModified("reactionsCount");
  await post.save();

  return { success: true, reactionsCount: post.reactionsCount };
};

const getPostReactions = async (postId, page = 1, limit = 20, filterType = null) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const query = { post: postId };
  if (filterType && VALID_TYPES.includes(filterType)) {
    query.type = filterType;
  }

  const total = await Reaction.countDocuments(query);
  const reactions = await Reaction.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .populate("user", "firstName lastName username profilePicture");

  return {
    reactions,
    reactionsCount: post.reactionsCount,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
};

module.exports = {
  reactToPost,
  removeReaction,
  getPostReactions,
};
