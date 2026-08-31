const Post = require("../models/Post.model");
const User = require("../models/User.model");

const getPersonalizedFeed = async (userId, page = 1, limit = 20) => {
  const currentUser = await User.findById(userId);
  const followingIds = currentUser ? currentUser.following || [] : [];
  const authorIds = [...followingIds, userId];

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;

  // Fetch recent posts from followed users + own + public posts within last 30 days
  const candidatePosts = await Post.find({
    $or: [
      { author: { $in: authorIds } },
      { visibility: "public" },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("author", "firstName lastName username profilePicture isVerified")
    .populate({
      path: "originalPost",
      populate: {
        path: "author",
        select: "firstName lastName username profilePicture",
      },
    });

  const now = new Date();

  // Calculate ranking score for each post
  const scoredPosts = candidatePosts.map((post) => {
    const ageInHours = (now - new Date(post.createdAt)) / (1000 * 60 * 60);
    const recencyScore = Math.max(0, 100 - ageInHours * 2.5);

    const likes = post.likesCount || (post.likes ? post.likes.length : 0);
    const comments = post.commentsCount || 0;
    const shares = post.sharesCount || 0;
    const engagementScore = likes * 1 + comments * 2 + shares * 3;

    const isOwn = post.author && post.author._id.toString() === userId.toString();
    const isFollowing = post.author && followingIds.some((id) => id.toString() === post.author._id.toString());
    const relationshipScore = isFollowing ? 50 : isOwn ? 30 : 0;

    const totalScore = recencyScore + engagementScore + relationshipScore;

    return {
      post,
      score: totalScore,
    };
  });

  // Sort candidate posts by calculated score descending
  scoredPosts.sort((a, b) => b.score - a.score);

  const total = scoredPosts.length;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedPosts = scoredPosts
    .slice(startIndex, startIndex + limitNum)
    .map((item) => item.post);

  return {
    posts: paginatedPosts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
};

module.exports = {
  getPersonalizedFeed,
};
