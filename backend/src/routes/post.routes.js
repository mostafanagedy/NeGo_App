const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const upload = require("../config/multer");
const {
  createPostSchema,
  updatePostSchema,
  reactSchema,
  sharePostSchema,
} = require("../validations/post.schema");
const {
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
} = require("../controllers/post.controller");

router.post("/", protect, upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]), validate(createPostSchema), create);
router.get("/:postId", getPost);
router.get("/user/:username", getPostsByUser);
router.put("/:postId", protect, validate(updatePostSchema), update);
router.delete("/:postId", protect, removePost);

// Reactions
router.put("/:postId/react", protect, validate(reactSchema), react);
router.delete("/:postId/react", protect, unreact);
router.get("/:postId/reactions", getReactions);

// Saved Posts
router.post("/:postId/save", protect, save);
router.delete("/:postId/save", protect, unsave);

// Shares
router.post("/:postId/share", protect, validate(sharePostSchema), share);
router.get("/:postId/shares", getShares);

module.exports = router;
