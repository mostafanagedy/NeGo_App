const bcrypt = require("bcryptjs");
const User = require("../models/User.model")

const registerUser = async (userData) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
  } = userData;
  const existingEmail = await User.findOne({email})
  if (existingEmail) {
    throw new Error("Email already existes")
  }
  const existingUsername = await User.findOne({username})
  if (existingUsername) {
    throw new Error ("Username already exists")
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

  if(!user){
    throw new Error("Invalid email or password")
  }
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  )
  if(!isPasswordCorrect){
    throw new Error("Invalid email or password")

  }
  return user;
}

module.exports = {
  registerUser,
  loginUser,
};

