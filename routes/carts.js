const express = require("express");
const CartManager = require("../managers/CartManager");

const router = express.Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart.products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const updatedCart = await cartManager.addProductToCart(
      req.params.cid,
      req.params.pid
    );
    res.json(updatedCart);
  } catch (error) {
    if (error.message === "Carrito no encontrado") {
      return res.status(404).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
  }
});

module.exports = router;
