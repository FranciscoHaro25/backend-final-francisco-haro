const ProductService = require("../services/product.service");

const productService = new ProductService();

class ProductController {
  async getProducts(req, res) {
    try {
      const {
        limit = 10,
        page = 1,
        sort,
        query,
        category,
        availability,
      } = req.query;
      const options = {
        limit: Math.min(parseInt(limit), 50),
        page: parseInt(page),
        sort,
        query,
        category,
        availability:
          availability === "true"
            ? true
            : availability === "false"
            ? false
            : undefined,
      };

      // Obtener productos con paginación
      const result = await productService.list(options);

      // Construir URLs para navegación
      const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;

      // Crear enlaces de navegación
      const buildLink = (newPage) => {
        const queryParams = new URLSearchParams(req.query);
        queryParams.set("page", newPage);
        return `${baseUrl}?${queryParams.toString()}`;
      };

      // Respuesta en formato requerido
      const response = {
        status: "success",
        payload: result.docs || result, // Para compatibilidad con sistemas sin paginación
        totalPages: result.totalPages || 1,
        prevPage: result.hasPrevPage ? result.prevPage : null,
        nextPage: result.hasNextPage ? result.nextPage : null,
        page: result.page || 1,
        hasPrevPage: result.hasPrevPage || false,
        hasNextPage: result.hasNextPage || false,
        prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
        nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
        totalDocs:
          result.totalDocs || (Array.isArray(result) ? result.length : 0),
        limit: result.limit || limit,
        pagingCounter: result.pagingCounter || 1,
      };

      res.json(response);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({
        status: "error",
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
        const result = await productService.list({});
        const products = result.docs || result;
        io.emit("updateProducts", products);
      }
    } catch (error) {
      console.error("Error al emitir WebSocket:", error);
    }
  }
}

module.exports = new ProductController();
