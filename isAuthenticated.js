require("dotenv").config();
const jwt = require("jsonwebtoken");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/AppError");

exports.isAuthenticated = catchAsync(async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];

  if (!token) return next(new AppError("You are not authenticated!", 403));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(new AppError("Invalid Token! Please relogin", 403));
    req.user = user;
    next();
  });
});
