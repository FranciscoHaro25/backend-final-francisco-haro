const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "../data/products.json");
  }

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
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  async getProducts() {
    return await this.readProducts();
  }

  async getProductById(id) {
    const products = await this.readProducts();
    return products.find((product) => product.id === parseInt(id));
  }

  async addProduct(productData) {
    const products = await this.readProducts();

    // Validar campos requeridos
    const requiredFields = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "category",
    ];
    for (const field of requiredFields) {
      if (!productData[field]) {
        throw new Error(`El campo ${field} es requerido`);
      }
    }

    // Verificar que no exista un producto con el mismo código
    const existingProduct = products.find(
      (product) => product.code === productData.code
    );
    if (existingProduct) {
      throw new Error("Ya existe un producto con ese código");
    }

    // Generar ID único
    const id =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const newProduct = {
      id,
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: productData.price,
      status: productData.status !== undefined ? productData.status : true,
      stock: productData.stock,
      category: productData.category,
      thumbnails: productData.thumbnails || [],
    };

    products.push(newProduct);
    await this.writeProducts(products);
    return newProduct;
  }

  async updateProduct(id, updateData) {
    const products = await this.readProducts();
    const productIndex = products.findIndex(
      (product) => product.id === parseInt(id)
    );

    if (productIndex === -1) {
      throw new Error("Producto no encontrado");
    }

    // No permitir actualizar el ID
    if (updateData.id) {
      delete updateData.id;
    }

    // Verificar código único si se está actualizando
    if (updateData.code) {
      const existingProduct = products.find(
        (product) =>
          product.code === updateData.code && product.id !== parseInt(id)
      );
      if (existingProduct) {
        throw new Error("Ya existe un producto con ese código");
      }
    }

    // Actualizar solo los campos proporcionados
    products[productIndex] = { ...products[productIndex], ...updateData };
    await this.writeProducts(products);
    return products[productIndex];
  }

  async deleteProduct(id) {
    const products = await this.readProducts();
    const productIndex = products.findIndex(
      (product) => product.id === parseInt(id)
    );

    if (productIndex === -1) {
      throw new Error("Producto no encontrado");
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    await this.writeProducts(products);
    return deletedProduct;
  }
}

module.exports = ProductManager;
