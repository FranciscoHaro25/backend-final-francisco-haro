// Gestor de productos - persistencia en JSON
// TODO: migrar a base de datos en el futuro

const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "../../data/products.json");
  }

  // Leer archivo de productos
  async readProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  async writeProducts(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      throw error;
    }
  }

  async getProducts(limit) {
    try {
      const products = await this.readProducts();
      if (limit && limit > 0) {
        return products.slice(0, limit);
      }
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.readProducts();
      const product = products.find((p) => p.id === parseInt(id));
      return product || null;
    } catch (error) {
      throw error;
    }
  }

  async addProduct(productData) {
    try {
      const {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails = [],
      } = productData;

      // Validaciones
      if (!title || !description || !code || !price || !stock || !category) {
        throw new Error("Todos los campos son obligatorios excepto thumbnails");
      }

      const products = await this.readProducts();

      // Verificar código único
      if (products.some((p) => p.code === code)) {
        throw new Error(`El código ${code} ya existe`);
      }

      // Generar ID
      const newId =
        products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

      const newProduct = {
        id: newId,
        title,
        description,
        code,
        price: parseFloat(price),
        status: true,
        stock: parseInt(stock),
        category,
        thumbnails,
      };

      products.push(newProduct);
      await this.writeProducts(products);
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, updateData) {
    try {
      const products = await this.readProducts();
      const index = products.findIndex((p) => p.id === parseInt(id));

      if (index === -1) {
        throw new Error("Producto no encontrado");
      }

      // No permitir cambiar ID
      delete updateData.id;

      // Verificar código único si se está actualizando
      if (updateData.code) {
        const existingProduct = products.find(
          (p) => p.code === updateData.code && p.id !== parseInt(id)
        );
        if (existingProduct) {
          throw new Error(`El código ${updateData.code} ya existe`);
        }
      }

      // Actualizar campos
      products[index] = { ...products[index], ...updateData };

      await this.writeProducts(products);
      return products[index];
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.readProducts();
      const index = products.findIndex((p) => p.id === parseInt(id));

      if (index === -1) {
        throw new Error("Producto no encontrado");
      }

      const deletedProduct = products[index];
      products.splice(index, 1);

      await this.writeProducts(products);
      return deletedProduct;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductManager;
