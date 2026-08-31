const asyncHandler = require("../utils/asyncHandler");
const {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
} = require("../services/comment.service");

const create = asyncHandler(async (req, res) => {
  const { content, parentComment } = req.body;
  const comment = await createComment(req.params.postId, req.user._id, content, parentComment);

  return res.status(201).json({
    success: true,
    message: "Comment created successfully",
    comment,
  });
});

const getComments = asyncHandler(async (req, res) => {
  const { page, limit, parentComment } = req.query;
  const result = await getPostComments(req.params.postId, page, limit, parentComment);

  return res.status(200).json({
    success: true,
    data: result.comments,
    pagination: result.pagination,
  });
});

const update = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await updateComment(req.params.commentId, req.user._id, content);

  return res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    comment,
  });
});

const remove = asyncHandler(async (req, res) => {
  await deleteComment(req.params.commentId, req.user._id);

  return res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});

module.exports = {
  create,
  getComments,
  update,
  remove,
};
