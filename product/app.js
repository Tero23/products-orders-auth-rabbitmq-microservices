const express = require("express");
const morgan = require("morgan");

const productRouter = require("./routes/product");

const AppError = require("../utils/AppError");
const globalErrorHandler = require("./controllers/error");

// Start express app
const app = express();

// Development logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());

// 3) Routes
app.use("/api/v1/products", productRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
