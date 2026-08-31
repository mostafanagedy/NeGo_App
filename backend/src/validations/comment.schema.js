const Joi = require("joi");

const createCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required(),
  parentComment: Joi.string().hex().length(24).optional().allow(null, ""),
});

const updateCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required(),
});

module.exports = {
  createCommentSchema,
  updateCommentSchema,
};
