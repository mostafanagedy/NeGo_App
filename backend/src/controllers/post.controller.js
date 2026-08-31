const asyncHandler = require("../utils/asyncHandler");
const {
  createPost,
  getPostById,
  getUserPosts,
  updatePost,
  deletePost,
  sharePost,
  getPostShares,
} = require("../services/post.service");
const {
  reactToPost,
  removeReaction,
  getPostReactions,
} = require("../services/reaction.service");
const {
  savePost,
  unsavePost,
} = require("../services/savedPost.service");

const create = asyncHandler(async (req, res) => {
  const postData = {
    content: req.body.content || "",
    visibility: req.body.visibility || "public",
  };

  if (req.files?.image?.[0]) {
    postData.image = `/uploads/${req.files.image[0].filename}`;
  } else if (req.body.image) {
    postData.image = req.body.image;
  }

  if (req.files?.video?.[0]) {
    postData.video = `/uploads/${req.files.video[0].filename}`;
  } else if (req.body.video) {
    postData.video = req.body.video;
  }

  if (req.body.link) {
    postData.link = req.body.link;
  }

  const post = await createPost(req.user._id, postData);

  return res.status(201).json({
    success: true,
    message: "Post created successfully",
    post,
  });
});

const getPost = asyncHandler(async (req, res) => {
  const post = await getPostById(req.params.postId);

  return res.status(200).json({
    success: true,
    post,
  });
});

const getPostsByUser = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await getUserPosts(req.params.username, page, limit);

  return res.status(200).json({
    success: true,
    data: result.posts,
    pagination: result.pagination,
  });
});

const update = asyncHandler(async (req, res) => {
  const post = await updatePost(req.params.postId, req.user._id, req.body);

  return res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post,
  });
});

const removePost = asyncHandler(async (req, res) => {
  await deletePost(req.params.postId, req.user._id);

  return res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});

const react = asyncHandler(async (req, res) => {
  const { type } = req.body;
  const result = await reactToPost(req.params.postId, req.user._id, type);

  return res.status(200).json({
    success: true,
    message: `Reacted with ${type}`,
    data: result,
  });
});

const unreact = asyncHandler(async (req, res) => {
  const result = await removeReaction(req.params.postId, req.user._id);

  return res.status(200).json({
    success: true,
    message: "Reaction removed",
    data: result,
  });
});

const getReactions = asyncHandler(async (req, res) => {
  const { page, limit, type } = req.query;
  const result = await getPostReactions(req.params.postId, page, limit, type);

  return res.status(200).json({
    success: true,
    data: result.reactions,
    reactionsCount: result.reactionsCount,
    pagination: result.pagination,
  });
});

const save = asyncHandler(async (req, res) => {
  const result = await savePost(req.params.postId, req.user._id);

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});

const unsave = asyncHandler(async (req, res) => {
  const result = await unsavePost(req.params.postId, req.user._id);

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});

const share = asyncHandler(async (req, res) => {
  const { shareComment } = req.body;
  const post = await sharePost(req.params.postId, req.user._id, shareComment);

  return res.status(201).json({
    success: true,
    message: "Post shared successfully",
    post,
  });
});

const getShares = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await getPostShares(req.params.postId, page, limit);

  return res.status(200).json({
    success: true,
    data: result.shares,
    pagination: result.pagination,
  });
});

module.exports = {
  create,
  getPost,
  getPostsByUser,
  update,
  removePost,
  react,
  unreact,
  getReactions,
  save,
  unsave,
  share,
  getShares,
};
