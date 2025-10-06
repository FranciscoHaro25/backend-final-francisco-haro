const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

// Rutas de carritos
router.post("/", cartController.createCart);
router.get("/:cid", cartController.getCartById);
router.post("/:cid/product/:pid", cartController.addProductToCart);

module.exports = router;
