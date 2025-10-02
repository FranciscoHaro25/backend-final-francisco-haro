const fs = require("fs").promises;
const path = require("path");

class CartManager {
  constructor() {
    this.path = path.join(__dirname, "../data/carts.json");
  }

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
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  async createCart() {
    const carts = await this.readCarts();

    // Generar ID único
    const id = carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1;

    const newCart = {
      id,
      products: [],
    };

    carts.push(newCart);
    await this.writeCarts(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.readCarts();
    return carts.find((cart) => cart.id === parseInt(id));
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.readCarts();
    const cartIndex = carts.findIndex((cart) => cart.id === parseInt(cartId));

    if (cartIndex === -1) {
      throw new Error("Carrito no encontrado");
    }

    const cart = carts[cartIndex];
    const existingProductIndex = cart.products.findIndex(
      (product) => product.product === parseInt(productId)
    );

    if (existingProductIndex !== -1) {
      // Si el producto ya existe, incrementar la cantidad
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Si el producto no existe, agregarlo con cantidad 1
      cart.products.push({
        product: parseInt(productId),
        quantity: 1,
      });
    }

    carts[cartIndex] = cart;
    await this.writeCarts(carts);
    return cart;
  }

  async getCarts() {
    return await this.readCarts();
  }
}

module.exports = CartManager;
