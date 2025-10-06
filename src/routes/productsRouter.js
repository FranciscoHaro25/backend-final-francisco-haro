const express = require("express");
const productController = require("../controllers/productController");
const {
  validateProduct,
  validateProductId,
} = require("../middlewares/validation");

const router = express.Router();

// Rutas para productos
router.get("/", productController.getProducts);
router.get("/:pid", validateProductId, productController.getProductById);
router.post("/", validateProduct, productController.createProduct);
router.put(
  "/:pid",
  validateProductId,
  validateProduct,
  productController.updateProduct
);
router.delete("/:pid", validateProductId, productController.deleteProduct);

module.exports = router;
