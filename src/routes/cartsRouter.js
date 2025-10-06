const express = require("express");
const cartController = require("../controllers/cartController");

// Router para endpoints de carritos
const router = express.Router();

// Rutas para API de carritos
router.post("/", cartController.createCart); // Crear carrito
router.get("/:cid", cartController.getCartById); // Obtener carrito
router.post("/:cid/product/:pid", cartController.addProductToCart); // Agregar producto

module.exports = router;
