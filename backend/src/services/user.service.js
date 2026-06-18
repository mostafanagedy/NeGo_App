const User = require("../models/User.model");
const AppError = require("../utils/AppError")



const getUserProfile = async (username) => {
  const user = await User.findOne({
    username,
  }).select("-password");
  if (!user) {
    throw new AppError(
      "User not found",404
    )
  }return user
}
const updateUserProfile = async(
  userId,
  updateData,
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators:true,
    }
  ).select("-password")

  if(!user){
    throw new AppError(
      "User not found",404
    )
  }return user
}
const updateProfilePicture = async (
  userId,
  imagePath
) => {
  const user =await User.findByIdAndUpdate(
    userId,
    {
      profilePicture: imagePath,
    },
    {new:true,}
).select("-password")
  if (!user) {
    throw new AppError("User not found",404)
  }return user
}
const updateUserImage = async (

  userId,
  field,
  imagePath
) => {
  const user = await User.findByIdAndUpdate(
    userId, { [field]: imagePath, }, {new:true,}
  ).select("-password")
  if (!user) {
    throw new AppError("User not found",404)
  } return user
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  updateUserImage,
};
