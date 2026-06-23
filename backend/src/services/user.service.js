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

const followUser = async (currentUserId, targetUserId) => {
if (currentUserId.toString() === targetUserId.toString()) {
  throw new AppError("You cannot follow yourself", 400);
  }
const currentUser = await User.findById(currentUserId);
const targetUser = await User.findById(targetUserId);
if (!targetUser) {
  throw new AppError("User not found", 404);
}
if (currentUser.following.includes(targetUserId)) {
  throw new AppError("You are already following this user", 400);
}
currentUser.following.push(targetUserId);
targetUser.followers.push(currentUserId);
await currentUser.save();
await targetUser.save();
return true;
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  updateUserImage,
  followUser,
};
