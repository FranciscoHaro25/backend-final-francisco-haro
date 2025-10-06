const express = require("express");
const cartController = require("../controllers/cartController");
const {
  validateCartId,
  validateProductId,
} = require("../middlewares/validation");

const router = express.Router();

// Rutas para carritos
router.post("/", cartController.createCart);
router.get("/:cid", validateCartId, cartController.getCartById);
router.post(
  "/:cid/product/:pid",
  validateCartId,
  validateProductId,
  cartController.addProductToCart
);

module.exports = router;
