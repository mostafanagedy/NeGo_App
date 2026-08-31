const asyncHandler = require("../utils/asyncHandler");

const {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  updateUserImage,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
} = require("../services/user.service");
const router = require("../routes/user.routes");
const protect = require("../middlewares/auth.middleware");

const getProfile = asyncHandler(async (req, res) => {
  const user = await getUserProfile(
    req.params.username
  );

  return res.status(200).json({
    success: true,
    user,
  });
});

const updateProfile = asyncHandler(
  async (req, res) => {
    const user = await updateUserProfile(
      req.user._id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  }
);
const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image",
    });
  }

  const imagePath = `/uploads/${req.file.filename}`;

  const user = await updateProfilePicture(req.user._id, imagePath);

  return res.status(200).json({
    success: true,
    message: "Profile picture updated successfully",
    profilePicture: user.profilePicture,
  });
});
const  uploadCoverPicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image",
    });
  }
  const imagPath = `/uploads/${req.file.filename}`;
  const user = await updateUserImage(req.user._id, "coverPicture", imagPath);
  return res.status(200).json({
    success: true,
    message: "Cover picture updated successfully",
    coverPicture: user.coverPicture,
  });
})

//follow user
const follow = asyncHandler(async (req, res) => {
  await followUser(req.user._id, req.params.userId);

  // real-time notification to the target user
  const io = req.app.get("io");
  console.log(`[Follow] ${req.user._id} → ${req.params.userId}`);
  if (io) {
    const room = req.params.userId.toString();
    const sockets = await io.in(room).fetchSockets();
    console.log(`[Follow] sockets in room "${room}": ${sockets.length}`);
    io.to(room).emit("new_notification", {
      type: "follow",
      title: `${req.user.firstName} ${req.user.lastName} started following you`,
      avatar: req.user.profilePicture || "",
      fromUser: {
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        username: req.user.username,
        profilePicture: req.user.profilePicture,
      },
      time: new Date().toISOString(),
    });
  }

  return res.status(200).json({
    success: true,
    message: "User followed successfully",
  });
});
const unfollow = asyncHandler(async (req, res) => {
  await unfollowUser(req.user._id, req.params.userId);

  return res.status(200).json({
    success: true,
    message: "User unfollowed successfully",
  });
});

const followersList = asyncHandler(async (req, res) => {
  const followers = await getFollowers(req.params.username);
  return res.status(200).json({
    success: true,
    count: followers.length,
    followers,
  });
})
const followingList = asyncHandler(async (req, res) => {
  const following = await getFollowing(req.params.username);
  return res.status(200).json({
    success: true,
    count: following.length,
    following,
  });
})
const search = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  const users = await searchUsers(q);

  return res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

const getSavedPosts = asyncHandler(async (req, res) => {
  const { getUserSavedPosts } = require("../services/savedPost.service");
  const { page, limit } = req.query;
  const result = await getUserSavedPosts(req.user._id, page, limit);

  return res.status(200).json({
    success: true,
    data: result.posts,
    pagination: result.pagination,
  });
});

module.exports = {
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
};

