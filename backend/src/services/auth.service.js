const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const AppError = require("../utils/AppError");

const registerUser = async (userData) => {
  const { firstName, lastName, username, email, password } = userData;
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new AppError("Email already exists", 400);
  }
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new AppError("Username already exists", 400);
  }
  // بضيف ملح للباسورد عشان اغير طعمه
  // const salt = await bcrypt.genSalt(10)
  // const hashedPassword = await bcrypt.hash(password,salt)

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
  });

  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
};
