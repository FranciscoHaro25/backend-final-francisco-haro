const express = require("express");
const productController = require("../controllers/productController");

// Router para endpoints de productos
const router = express.Router();

// Rutas para API de productos
router.get("/", productController.getProducts); // Listar productos
router.get("/:pid", productController.getProductById); // Obtener por ID
router.post("/", productController.createProduct); // Crear producto
router.put("/:pid", productController.updateProduct); // Actualizar producto
router.delete("/:pid", productController.deleteProduct); // Eliminar producto

module.exports = router;
