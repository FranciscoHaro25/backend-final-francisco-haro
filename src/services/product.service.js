// Servicio de productos - Lógica de negocio
// Maneja la comunicación entre controllers y el manager de datos

const ProductManager = require("../dao/product.manager");

class ProductService {
  constructor() {
    this.productManager = new ProductManager();
  }

  // Obtener lista de productos con posibilidad de limitar resultados
  async list(options = {}) {
    try {
      const { limit } = options;
      return await this.productManager.getProducts(limit);
    } catch (error) {
      throw error;
    }
  }

  // Buscar un producto específico por su ID
  async getById(id) {
    try {
      const product = await this.productManager.getProductById(id);
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
      return await this.productManager.addProduct(productData);
    } catch (error) {
      throw error;
    }
  }

  // Modificar los datos de un producto existente
  async update(id, updateData) {
    try {
      return await this.productManager.updateProduct(id, updateData);
    } catch (error) {
      throw error;
    }
  }

  // Quitar un producto del catálogo
  async remove(id) {
    try {
      return await this.productManager.deleteProduct(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;
