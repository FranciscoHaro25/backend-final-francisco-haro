const express = require("express");
const ProductManager = require("../dao/productManager");

const router = express.Router();
const productManager = new ProductManager();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts(
      limit ? parseInt(limit) : undefined
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({
      error: "Error del servidor",
      message: error.message,
    });
  }
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({
      error: "Error del servidor",
      message: error.message,
    });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);

    // Emitir evento WebSocket
    const io = req.app.get("io");
    if (io) {
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    }

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({
      error: "Error al crear producto",
      message: error.message,
    });
  }
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(
      req.params.pid,
      req.body
    );

    // Emitir evento WebSocket
    const io = req.app.get("io");
    if (io) {
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({
      error: "Error al actualizar producto",
      message: error.message,
    });
  }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await productManager.deleteProduct(req.params.pid);

    // Emitir evento WebSocket
    const io = req.app.get("io");
    if (io) {
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    }

    res.json({
      message: "Producto eliminado exitosamente",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(404).json({
      error: "Error al eliminar producto",
      message: error.message,
    });
  }
});

module.exports = router;
