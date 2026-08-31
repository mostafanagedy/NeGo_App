const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createCommentSchema,
  updateCommentSchema,
} = require("../validations/comment.schema");
const {
  create,
  getComments,
  update,
  remove,
} = require("../controllers/comment.controller");

router.post("/:postId", protect, validate(createCommentSchema), create);
router.get("/post/:postId", getComments);
router.put("/:commentId", protect, validate(updateCommentSchema), update);
router.delete("/:commentId", protect, remove);

module.exports = router;
