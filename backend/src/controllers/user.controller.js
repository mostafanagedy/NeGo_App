const asyncHandler = require("../utils/asyncHandler");

const {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
} = require("../services/user.service");

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
module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture,
};
