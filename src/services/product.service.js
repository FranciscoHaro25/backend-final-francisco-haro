// Servicio de productos
const DAOFactory = require("../dao/factory.dao");

class ProductService {
  constructor() {
    this.productDAO = null;
    this.init();
  }

  async init() {
    this.productDAO = await DAOFactory.getProductDAO();
  }

  async list(options = {}) {
    try {
      if (!this.productDAO) {
        await this.init();
      }

      // Para MongoDB con paginación
      if (
        this.productDAO.getProducts &&
        typeof this.productDAO.getProducts === "function"
      ) {
        if (
          options.page !== undefined ||
          options.sort ||
          options.query ||
          options.category
        ) {
          return await this.productDAO.getProducts(options);
        }

        if (options.limit !== undefined) {
          return await this.productDAO.getProducts(options.limit);
        }

        return await this.productDAO.getProducts();
      }

      // Para FileSystem
      const { limit } = options;
      const products = await this.productDAO.getProducts(limit);

      // Si no hay paginación nativa, simular estructura de respuesta
      if (Array.isArray(products)) {
        return {
          docs: products,
          totalDocs: products.length,
          limit: limit || products.length,
          page: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          nextPage: null,
          prevPage: null,
          pagingCounter: 1,
        };
      }

      return products;
    } catch (error) {
      throw error;
    }
  }

  // Buscar un producto específico por su ID
  async getById(id) {
    try {
      if (!this.productDAO) {
        await this.init();
      }

      const product = await this.productDAO.getProductById(id);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  // Agregar un nuevo producto al catálogo
  async create(productData) {
    try {
      if (!this.productDAO) {
        await this.init();
      }

      // Usar método apropiado según el DAO
      if (this.productDAO.createProduct) {
        return await this.productDAO.createProduct(productData);
      }
      return await this.productDAO.addProduct(productData);
    } catch (error) {
      throw error;
    }
  }

  // Modificar los datos de un producto existente
  async update(id, updateData) {
    try {
      if (!this.productDAO) {
        await this.init();
      }

      return await this.productDAO.updateProduct(id, updateData);
    } catch (error) {
      throw error;
    }
  }

  // Quitar un producto del catálogo
  async remove(id) {
    try {
      if (!this.productDAO) {
        await this.init();
      }

      return await this.productDAO.deleteProduct(id);
    } catch (error) {
      throw error;
    }
  }

  // Métodos adicionales para la nueva funcionalidad

  // Buscar productos por categoría
  async getByCategory(category) {
    try {
      if (!this.productDAO) {
        await this.init();
      }

      if (this.productDAO.getProductsByCategory) {
        return await this.productDAO.getProductsByCategory(category);
      }

      // Fallback para implementación anterior
      const products = await this.productDAO.getProducts();
      return products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    } catch (error) {
      throw error;
    }
  }

  // Obtener productos disponibles
  async getAvailable() {
    try {
      if (!this.productDAO) {
        await this.init();
      }

      if (this.productDAO.getAvailableProducts) {
        return await this.productDAO.getAvailableProducts();
      }

      // Fallback para implementación anterior
      const products = await this.productDAO.getProducts();
      return products.filter((p) => p.status === true && p.stock > 0);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;
