const asyncHandler = require("../utils/asyncHandler");
const {getUserProfile} = require("../services/user.service");

const getProfile = asyncHandler(async (req, res) => {

  const user = await getUserProfile(
  req.params.username,
  )
  return res.status(200).json({
    success: true,
    user,
  })
});
module.exports = {
  getProfile,
}
