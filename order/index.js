require("dotenv").config();
const mongoose = require("mongoose");
const amqp = require("amqplib");
const amqpUrl = "amqp://localhost:5672";
const Order = require("./models/Order");
const catchAsync = require("../utils/catchAsync");

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("Uncaught Exception! Shutting down...");
  process.exit(1);
});

const app = require("./app");

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  })
  .then((con) => console.log("DB connection successful! - Order Service"));

const port = process.env.PORT || 8001;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

const createOrder = catchAsync(async (products, user) => {
  const totalPrice = products.reduce((acc, product) => acc + product.price, 0);

  const newProducts = products.map((product) => {
    return { productId: product._id };
  });

  const order = await Order.create({
    products: newProducts,
    user: user.id,
    totalPrice,
  });
  return order;
});

const connectToRabbitmq = async () => {
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue("ORDER");
  channel.consume("ORDER", async (data) => {
    console.log("Consuming order queue");
    const { products, user } = JSON.parse(data.content);
    const newOrder = createOrder(products, user);
    await channel.ack(data);
    channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify({ newOrder })));
  });
};

connectToRabbitmq();

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! Shutting down...");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
