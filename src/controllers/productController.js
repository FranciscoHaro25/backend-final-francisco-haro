const ProductManager = require("../dao/productManager");

const productManager = new ProductManager();

class ProductController {
  // Obtener lista de productos
  async getProducts(req, res) {
    try {
      const { limit } = req.query;
      const products = await productManager.getProducts(
        limit ? parseInt(limit) : undefined
      );
      res.json(products);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({
        error: "Error del servidor",
        message: error.message,
      });
    }
  }

  // Obtener producto por ID
  async getProductById(req, res) {
    try {
      const product = await productManager.getProductById(req.params.pid);
      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error al obtener producto:", error);
      res.status(500).json({
        error: "Error del servidor",
        message: error.message,
      });
    }
  }

  // Crear nuevo producto
  async createProduct(req, res) {
    try {
      const newProduct = await productManager.addProduct(req.body);

      // Notificar cambios a clientes conectados
      if (req.app && req.app.locals.io) {
        const products = await productManager.getProducts();
        req.app.locals.io.emit("updateProducts", products);
      }

      res.status(201).json({
        message: "Producto creado exitosamente",
        product: newProduct,
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      res.status(400).json({
        error: "Error al crear producto",
        message: error.message,
      });
    }
  }

  // Actualizar producto
  async updateProduct(req, res) {
    try {
      const updatedProduct = await productManager.updateProduct(
        req.params.pid,
        req.body
      );

      // Emitir evento WebSocket para tiempo real
      if (req.app && req.app.locals.io) {
        const products = await productManager.getProducts();
        req.app.locals.io.emit("updateProducts", products);
      }

      res.json({
        message: "Producto actualizado exitosamente",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(400).json({
        error: "Error al actualizar producto",
        message: error.message,
      });
    }
  }

  // Eliminar producto
  async deleteProduct(req, res) {
    try {
      const deletedProduct = await productManager.deleteProduct(req.params.pid);

      // Emitir evento WebSocket para tiempo real
      if (req.app && req.app.locals.io) {
        const products = await productManager.getProducts();
        req.app.locals.io.emit("updateProducts", products);
      }

      res.json({
        message: "Producto eliminado exitosamente",
        product: deletedProduct,
      });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res.status(404).json({
        error: "Error al eliminar producto",
        message: error.message,
      });
    }
  }

  // Notificar cambios via WebSocket
  async broadcastProductUpdate(app) {
    try {
      const io = app.get("io");
      if (io) {
        const products = await productManager.getProducts();
        io.emit("updateProducts", products);
      }
    } catch (error) {
      console.error("Error al emitir WebSocket:", error);
    }
  }
}

module.exports = new ProductController();
