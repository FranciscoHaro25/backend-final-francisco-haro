const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

// Rutas para productos
router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);

module.exports = router;
