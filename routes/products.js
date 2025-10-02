const express = require("express");
const ProductManager = require("../managers/ProductManager");
const auth = require("../middlewares/auth");

const router = express.Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    // Obtener query parameters
    const filters = {
      category: req.query.category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      stock: req.query.stock,
      search: req.query.search,
      sortBy: req.query.sortBy,
      order: req.query.order,
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

router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
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

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(
      req.params.pid,
      req.body
    );
    res.json(updatedProduct);
  } catch (error) {
    if (error.message === "Producto no encontrado") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes("código")) {
      return res.status(400).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
  }
});

router.delete("/:pid", auth, async (req, res) => {
  try {
    const deletedProduct = await productManager.deleteProduct(req.params.pid);
    res.json({ message: "Producto eliminado", product: deletedProduct });
  } catch (error) {
    if (error.message === "Producto no encontrado") {
      return res.status(404).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
  }
});

// Endpoints extras para filtros
router.get("/category/:category", async (req, res) => {
  try {
    const products = await productManager.getProducts({
      category: req.params.category,
    });
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
  }
});

router.get("/stats/general", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const stats = {
      total: products.length,
      categories: [...new Set(products.map((p) => p.category))],
      averagePrice:
        products.length > 0
          ? (
              products.reduce((sum, p) => sum + p.price, 0) / products.length
            ).toFixed(2)
          : 0,
      inStock: products.filter((p) => p.stock > 0).length,
      outOfStock: products.filter((p) => p.stock === 0).length,
    };
    res.json(stats);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error del servidor", message: error.message });
  }
});

module.exports = router;
