const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.post("/", cartController.createCart);
router.get("/:cid", cartController.getCartById);
router.post("/:cid/product/:pid", cartController.addProductToCart);

module.exports = router;
