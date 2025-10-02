const express = require("express");
const ProductManager = require("../managers/ProductManager");

const router = express.Router();
const productManager = new ProductManager();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      limit: req.query.limit,
      page: req.query.page,
    };

    const products = await productManager.getProducts(filters);
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
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
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
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
    if (
      error.message.includes("requerido") ||
      error.message.includes("código")
    ) {
      return res.status(400).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
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
    if (error.message === "Producto no encontrado") {
      return res.status(404).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
  }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  try {
    await productManager.deleteProduct(req.params.pid);

    // Emitir evento WebSocket
    const io = req.app.get("io");
    if (io) {
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    if (error.message === "Producto no encontrado") {
      return res.status(404).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
  }
});

module.exports = router;
