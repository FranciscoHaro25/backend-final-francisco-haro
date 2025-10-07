// Router para manejo de carritos de compra
// Define las rutas para crear carritos y agregar productos
const express = require("express");
const cartController = require("../controllers/cart.controller");
const {
  validateCartId,
  validateProductId,
} = require("../middlewares/validation");

const router = express.Router();

// Rutas disponibles para operaciones con carritos
router.post("/", cartController.createCart); // Crear carrito nuevo y vacío
router.get("/:cid", validateCartId, cartController.getCartById); // Consultar carrito por ID
router.post(
  "/:cid/product/:pid",
  validateCartId,
  validateProductId,
  cartController.addProductToCart
); // Agregar producto al carrito

module.exports = router;
