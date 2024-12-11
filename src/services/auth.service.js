const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt.utils');

exports.registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const user = new User(userData);
  await user.save();
  return generateToken(user._id);
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email }); // to check weather user exists in database or not
  
  if (!user || !(await user.comparePassword(password))) { // if user is not present or password is wrong then throw error
    throw new Error('Invalid credentials');
  }
  return generateToken(user._id);
};