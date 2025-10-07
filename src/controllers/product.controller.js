// Controller de productos - Maneja las peticiones HTTP
// Francisco Haro - Backend Express con servicios

const ProductService = require("../services/product.service");

const productService = new ProductService();

class ProductController {
  // Endpoint para obtener productos con opción de límite
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

  // Buscar un producto específico por su ID
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

  // Crear un nuevo producto y notificar via WebSocket
  async createProduct(req, res, next) {
    try {
      const newProduct = await productService.create(req.body);

      // Enviar actualización a todos los clientes conectados
      const io = req.app.get("io");
      if (io) {
        const products = await productService.list({});
        io.emit("updateProducts", products);
      }

      res.status(201).json({
        message: "Producto creado exitosamente",
        product: newProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  // Modificar un producto existente
  async updateProduct(req, res) {
    try {
      const updatedProduct = await productService.update(
        req.params.pid,
        req.body
      );

      // Actualizar la lista en tiempo real
      const io = req.app.get("io");
      if (io) {
        const products = await productService.list({});
        io.emit("updateProducts", products);
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

  // Eliminar un producto del catálogo
  async deleteProduct(req, res) {
    try {
      const deletedProduct = await productService.remove(req.params.pid);

      // Notificar a todos los clientes la eliminación
      const io = req.app.get("io");
      if (io) {
        const products = await productService.list({});
        io.emit("updateProducts", products);
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
