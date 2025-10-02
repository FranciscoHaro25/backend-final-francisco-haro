const express = require("express");
const CartManager = require("../dao/cartManager");

const router = express.Router();
const cartManager = new CartManager();

// POST /api/carts
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({
      error: "Error al crear carrito",
      message: error.message,
    });
  }
});

// GET /api/carts/:cid
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({
      error: "Error del servidor",
      message: error.message,
    });
  }
});

// POST /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await cartManager.addProductToCart(
      req.params.cid,
      req.params.pid
    );
    res.json(cart);
  } catch (error) {
    res.status(400).json({
      error: "Error al agregar producto al carrito",
      message: error.message,
    });
  }
});

module.exports = router;
