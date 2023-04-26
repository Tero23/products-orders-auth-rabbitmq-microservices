const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/User");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { email, name, password, passwordConfirm } = req.body;

  const userCheck = await User.findOne({ email });
  if (userCheck) return next(new AppError("User already exists!", 400));

  if (!email || !name || !password || !passwordConfirm)
    return next(new AppError("Please fill all the required fields!", 400));

  const user = await User.create({ email, name, password, passwordConfirm });

  const token = signToken(user?._id || user?.id);

  res.status(201).json({ user, token });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please fill all the required fields!", 400));

  const user = await User.findOne({ email });
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Invalid Credentials!", 400));

  const token = signToken(user?._id || user?.id);

  res.status(200).json({ user, token });
});
