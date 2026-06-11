const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validate.middleware");

const { updateProfileSchema } = require("../validations/user.schema");
const upload = require("../config/multer");
const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
} = require("../controllers/user.controller");

router.get("/profile/:username", getProfile);

router.put("/profile", protect, validate(updateProfileSchema), updateProfile);
router.put(
  "/profile-picture",
  protect,
  upload.single("profilePicture"),
  uploadProfilePicture,
);
module.exports = router;
