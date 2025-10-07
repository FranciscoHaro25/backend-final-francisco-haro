const ProductService = require("../services/product.service");

const productService = new ProductService();

class ProductController {
  async getProducts(req, res) {
    try {
      const { limit } = req.query;
      const products = await productService.list({
        limit: limit ? parseInt(limit) : undefined,
      });
      res.json(products);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({
        error: "Error del servidor",
        message: error.message,
      });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getById(req.params.pid);
      res.json(product);
    } catch (error) {
      console.error("Error al obtener producto:", error);
      if (error.message === "Producto no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({
        error: "Error del servidor",
        message: error.message,
      });
    }
  }

  async createProduct(req, res, next) {
    try {
      const newProduct = await productService.create(req.body);

      const io = req.app.get("io");
      if (io) {
        this.broadcastProductUpdate(io);
      }

      res.status(201).json({
        message: "Producto creado exitosamente",
        product: newProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res) {
    try {
      const updatedProduct = await productService.update(
        req.params.pid,
        req.body
      );

      const io = req.app.get("io");
      if (io) {
        this.broadcastProductUpdate(io);
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

  async deleteProduct(req, res) {
    try {
      const deletedProduct = await productService.remove(req.params.pid);

      const io = req.app.get("io");
      if (io) {
        this.broadcastProductUpdate(io);
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

  async broadcastProductUpdate(io) {
    try {
      if (io) {
        const products = await productService.list({});
        io.emit("updateProducts", products);
        console.log(
          `[${new Date().toISOString()}] Productos actualizados via WebSocket`
        );
      }
    } catch (error) {
      console.error("Error al emitir WebSocket:", error);
    }
  }
}

module.exports = new ProductController();
