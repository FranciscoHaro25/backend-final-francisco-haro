const Product = require("../../models/product.model");

class ProductDAO {
  constructor() {
    this.model = Product;
  }

  async getProducts(options = {}) {
    try {
      if (typeof options === "number") {
        const simpleResult = await this.model.find().limit(options).lean();
        return simpleResult;
      }

      const {
        page = 1,
        limit = 10,
        sort = null,
        query = null,
        category = null,
        availability = null,
      } = options;

      const filter = {};

      if (query) {
        filter.$or = [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ];
      }

      if (category) {
        filter.category = { $regex: new RegExp(category, "i") };
      }

      // Filtro por disponibilidad (stock > 0 y status = true)
      if (availability !== null && availability !== undefined) {
        if (availability === true || availability === "true") {
          filter.status = true;
          filter.stock = { $gt: 0 };
        } else if (availability === false || availability === "false") {
          filter.$or = [{ status: false }, { stock: { $lte: 0 } }];
        }
      }

      // Opciones de paginación
      const paginationOptions = {
        page: parseInt(page),
        limit: Math.min(parseInt(limit), 50), // Máximo 50 productos por página
        lean: true, // Retornar objetos planos para mejor rendimiento
        customLabels: {
          docs: "docs",
          totalDocs: "totalDocs",
          limit: "limit",
          page: "page",
          totalPages: "totalPages",
          hasNextPage: "hasNextPage",
          hasPrevPage: "hasPrevPage",
          nextPage: "nextPage",
          prevPage: "prevPage",
          pagingCounter: "pagingCounter",
        },
      };

      // Configurar ordenamiento
      if (sort) {
        if (sort === "asc") {
          paginationOptions.sort = { price: 1 };
        } else if (sort === "desc") {
          paginationOptions.sort = { price: -1 };
        }
      } else {
        // Ordenamiento por defecto: más recientes primero
        paginationOptions.sort = { createdAt: -1 };
      }

      // Ejecutar consulta con paginación
      const result = await this.model.paginate(filter, paginationOptions);

      // Retornar directamente el resultado de mongoose-paginate-v2
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Construir links de navegación
  buildLink(options, page) {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", options.limit || 10);

    if (options.sort) params.append("sort", options.sort);
    if (options.category) params.append("category", options.category);
    if (options.status !== null) params.append("status", options.status);

    return `/api/products?${params.toString()}`;
  }

  // Obtener producto por ID
  async getProductById(id) {
    try {
      const product = await this.model.findById(id).lean();
      return product;
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID de producto inválido");
      }
      throw error;
    }
  }

  // Crear nuevo producto
  async createProduct(productData) {
    try {
      const product = new this.model(productData);
      const savedProduct = await product.save();
      return savedProduct.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("El código del producto ya existe");
      }
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        throw new Error(`Errores de validación: ${messages.join(", ")}`);
      }
      throw error;
    }
  }

  // Actualizar producto
  async updateProduct(id, updateData) {
    try {
      // Eliminar campos que no se pueden actualizar
      delete updateData._id;
      delete updateData.id;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      const updatedProduct = await this.model.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true, // Retornar documento actualizado
          runValidators: true, // Ejecutar validaciones
          lean: false,
        }
      );

      if (!updatedProduct) {
        throw new Error("Producto no encontrado");
      }

      return updatedProduct.toObject();
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID de producto inválido");
      }
      if (error.code === 11000) {
        throw new Error("El código del producto ya existe");
      }
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        throw new Error(`Errores de validación: ${messages.join(", ")}`);
      }
      throw error;
    }
  }

  // Eliminar producto
  async deleteProduct(id) {
    try {
      const deletedProduct = await this.model.findByIdAndDelete(id).lean();

      if (!deletedProduct) {
        throw new Error("Producto no encontrado");
      }

      return deletedProduct;
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID de producto inválido");
      }
      throw error;
    }
  }

  // Métodos adicionales útiles

  // Buscar productos por categoría
  async getProductsByCategory(category) {
    try {
      const products = await this.model.findByCategory(category).lean();
      return products;
    } catch (error) {
      throw error;
    }
  }

  // Buscar productos disponibles
  async getAvailableProducts() {
    try {
      const products = await this.model.findAvailable().lean();
      return products;
    } catch (error) {
      throw error;
    }
  }

  // Buscar productos por rango de precio
  async getProductsByPriceRange(minPrice, maxPrice) {
    try {
      const products = await this.model
        .findByPriceRange(minPrice, maxPrice)
        .lean();
      return products;
    } catch (error) {
      throw error;
    }
  }

  // Búsqueda de texto
  async searchProducts(searchTerm) {
    try {
      const products = await this.model
        .find({
          $text: { $search: searchTerm },
          status: true,
        })
        .lean();
      return products;
    } catch (error) {
      throw error;
    }
  }

  // Obtener estadísticas de productos
  async getProductStats() {
    try {
      const stats = await this.model.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            averagePrice: { $avg: "$price" },
            totalStock: { $sum: "$stock" },
            activeProducts: {
              $sum: { $cond: [{ $eq: ["$status", true] }, 1, 0] },
            },
          },
        },
      ]);

      const categoryStats = await this.model.aggregate([
        { $match: { status: true } },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            averagePrice: { $avg: "$price" },
          },
        },
        { $sort: { count: -1 } },
      ]);

      return {
        general: stats[0] || {},
        byCategory: categoryStats,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductDAO;
