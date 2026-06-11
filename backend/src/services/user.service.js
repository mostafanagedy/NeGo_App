const Uesr = require("../models/User.model")
const AppError = require("../utils/AppError")



const getUserProfile = async (username) => {
  const user = await Uesr.findOne({
    username,
  }).select("-password");
  if (!user) {
    throw new AppError(
      "User not found",404
    )
  }return user
}

module.exports = {
  getUserProfile,
}
