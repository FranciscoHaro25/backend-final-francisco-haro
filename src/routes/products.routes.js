// Definición de rutas para la gestión de productos
// Incluye endpoints para crear, leer, actualizar y eliminar productos
const express = require("express");
const productController = require("../controllers/product.controller");
const {
  validateProduct,
  validateProductId,
} = require("../middlewares/validation");

const router = express.Router();

// Definimos todas las rutas relacionadas con productos
router.get("/", productController.getProducts); // Obtener todos los productos
router.get("/:pid", validateProductId, productController.getProductById); // Obtener producto por ID
router.post("/", validateProduct, productController.createProduct); // Crear nuevo producto
router.put(
  "/:pid",
  validateProductId,
  validateProduct,
  productController.updateProduct
); // Actualizar producto existente
router.delete("/:pid", validateProductId, productController.deleteProduct); // Eliminar producto

module.exports = router;
