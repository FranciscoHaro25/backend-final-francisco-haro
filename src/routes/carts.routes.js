const express = require("express");
const cartController = require("../controllers/cart.controller");
const {
  validateCartId,
  validateProductId,
} = require("../middlewares/idValidator");

const router = express.Router();

// POST / - Crear nuevo carrito
router.post("/", cartController.createCart);

// GET /:cid - Obtener carrito por ID
router.get("/:cid", validateCartId, cartController.getCartById);

// POST /:cid/product/:pid - Agregar producto al carrito
router.post(
  "/:cid/product/:pid",
  validateCartId,
  validateProductId,
  cartController.addProductToCart
);

// DELETE /:cid/products/:pid - Eliminar producto específico del carrito
router.delete(
  "/:cid/products/:pid",
  validateCartId,
  validateProductId,
  cartController.removeProduct
);

// PUT /:cid - Actualizar carrito con arreglo de productos
router.put("/:cid", validateCartId, cartController.updateCart);

// PUT /:cid/products/:pid - Actualizar cantidad de producto específico
router.put(
  "/:cid/products/:pid",
  validateCartId,
  validateProductId,
  cartController.updateProductQuantity
);

// DELETE /:cid - Eliminar todos los productos del carrito
router.delete("/:cid", validateCartId, cartController.clearCart);

// POST /:cid/purchase - Procesar compra del carrito
router.post("/:cid/purchase", validateCartId, cartController.purchaseCart);

module.exports = router;
