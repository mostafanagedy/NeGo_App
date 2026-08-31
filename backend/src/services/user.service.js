const { query } = require("express-validator");
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
const unfollowUser = async (currentUserId, targetUserId) => {
  const currentUser = await User.findById(currentUserId);

  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    throw new AppError("User not found", 404);
  }

  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== targetUserId,
  );

  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== currentUserId.toString(),
  );

  await currentUser.save();
  await targetUser.save();

  return true;
};
const getFollowers = async(username) => {
  const user = await User.findOne({ username }).populate("followers",
    "firstName lastName username profilePicture")
  if(!user){
    throw new AppError("User not found",404)
  }return user.followers
}
const getFollowing = async(username)=>{
  const user = await User.findOne({ username }).populate("following",
    "firstName lastName username profilePicture")
  if(!user){
    throw new AppError("User not found",404)
  }return user.following
}

const searchUsers = async (query) => {
  const users = await User.find({
    $or: [
      {
        username: {
          $regex: query,
          $options: "i",
        },
      },
      {
        firstName: {
          $regex: query,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: query,
          $options: "i",
        },
      },
    ],
  })
    .select("firstName lastName username profilePicture isVerified")
    .limit(20);

  return users;
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  updateUserImage,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
};
