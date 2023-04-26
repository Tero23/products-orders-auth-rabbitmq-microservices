const router = require("express").Router();
const productController = require("../controllers/product");
const { isAuthenticated } = require("../../isAuthenticated");

router.use(isAuthenticated);

router.route("/").post(productController.createProduct);

router.route("/buy").post(productController.buyProducts);

module.exports = router;
