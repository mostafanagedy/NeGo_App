const { registerUser , loginUser} = require("../services/auth.service");
const generateToken = require("../utils/generateToken");
const asyncHandler  = require("../utils/asyncHandler")
const register = asyncHandler (
async (req, res) => {

    const user = await registerUser(req.body);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",

      token,

      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        coverPicture: user.coverPicture,
        bio: user.bio,
      },
    });
  }
)
// catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await loginUser(email, password);

  const token = generateToken(user._id);

  return res.status(200).json({
    success: true,
    message: "Login successful",

    token,

    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
      bio: user.bio,
    },
  });
});
// catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: error.message,
//     });
//   }
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};
module.exports = {
  register,
  login,
  getMe,
};
