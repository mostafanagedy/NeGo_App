const asyncHandler = require("../utils/asyncHandler");

const {
  getUserProfile,
  updateUserProfile,
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

module.exports = {
  getProfile,
  updateProfile,
};
