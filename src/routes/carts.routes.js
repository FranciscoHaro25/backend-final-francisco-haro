const express = require("express");
const cartController = require("../controllers/cart.controller");
const {
  validateCartId,
  validateProductId,
} = require("../middlewares/validation");

const router = express.Router();

router.post("/", cartController.createCart);
router.get("/:cid", validateCartId, cartController.getCartById);
router.post(
  "/:cid/product/:pid",
  validateCartId,
  validateProductId,
  cartController.addProductToCart
);

module.exports = router;
