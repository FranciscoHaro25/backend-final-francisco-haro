const fs = require("fs").promises;
const path = require("path");

// Gestor de carritos - persistencia JSON
class CartManager {
  constructor() {
    this.path = path.join(__dirname, "../../data/carts.json");
  }

  // Leer carritos del archivo
  async readCarts() {
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

  async writeCarts(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      throw error;
    }
  }

  async createCart() {
    try {
      const carts = await this.readCarts();
      const newId =
        carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1;

      const newCart = {
        id: newId,
        products: [],
      };

      carts.push(newCart);
      await this.writeCarts(carts);
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.readCarts();
      const cart = carts.find((c) => c.id === parseInt(id));
      return cart || null;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.readCarts();
      const cartIndex = carts.findIndex((c) => c.id === parseInt(cartId));

      if (cartIndex === -1) {
        throw new Error("Carrito no encontrado");
      }

      const cart = carts[cartIndex];
      const existingProduct = cart.products.find(
        (p) => p.product === parseInt(productId)
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({
          product: parseInt(productId),
          quantity: 1,
        });
      }

      await this.writeCarts(carts);
      return cart;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartManager;
