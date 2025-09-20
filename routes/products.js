const express = require("express");
const ProductManager = require("../managers/ProductManager");

const router = express.Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
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

router.delete("/:pid", async (req, res) => {
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

module.exports = router;
