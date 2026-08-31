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
  uploadCoverPicture,
  follow,
  unfollow,
  followersList,
  followingList,
  search,
  getSavedPosts,
} = require("../controllers/user.controller");

router.get("/search", search);
router.get("/saved-posts", protect, getSavedPosts);
router.get("/profile/:username", getProfile);


router.put("/profile", protect, validate(updateProfileSchema), updateProfile);
router.put(
  "/profile-picture",
  protect,
  upload.single("profilePicture"),
  uploadProfilePicture,
);
router.put("/cover-picture", protect, upload.single("coverPicture"), uploadCoverPicture)


router.put("/follow/:userId", protect, follow);
router.put("/unfollow/:userId", protect, unfollow);



router.get("/:username/followers", followersList);

router.get("/:username/following", followingList);







module.exports = router;
