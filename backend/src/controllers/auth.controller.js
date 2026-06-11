const { registerUser } = require("../services/auth.service");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
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
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
};
