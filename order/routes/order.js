const router = require("express").Router();
const orderController = require("../controllers/order");
const { isAuthenticated } = require("../../isAuthenticated");

router.use(isAuthenticated);

router.route("/").get(orderController.getAllOrders);

module.exports = router;
