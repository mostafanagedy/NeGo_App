const Joi = require("joi");

const createPostSchema = Joi.object({
  content: Joi.string().trim().max(5000).allow("").optional(),
  image: Joi.string().allow("").optional(),
  images: Joi.array().items(Joi.string()).optional(),
  video: Joi.string().allow("").optional(),
  visibility: Joi.string().valid("public", "followers", "private").optional(),
}).or("content", "image", "images", "video");

const updatePostSchema = Joi.object({
  content: Joi.string().trim().max(5000).optional(),
  visibility: Joi.string().valid("public", "followers", "private").optional(),
});

const reactSchema = Joi.object({
  type: Joi.string()
    .valid("like", "love", "haha", "wow", "sad", "angry")
    .required(),
});

const sharePostSchema = Joi.object({
  shareComment: Joi.string().trim().max(1000).allow("").optional(),
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  reactSchema,
  sharePostSchema,
};
