const fs = require("fs").promises;
const path = require("path");

// Administrador de datos para carritos de compra - maneja la persistencia en JSON
// Se encarga de leer y escribir la información de carritos en el sistema de archivos
class CartManager {
  constructor() {
    this.path = path.join(__dirname, "../../data/carts.json");
  }

  // Lee todos los carritos guardados en el archivo JSON
  async readCarts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, devolvemos un array vacío para empezar
      if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  // Guarda la lista de carritos actualizada en el archivo
  async writeCarts(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      throw error;
    }
  }

  // Crea un carrito nuevo y vacío con ID único
  async createCart() {
    try {
      const carts = await this.readCarts();
      // Calculamos el próximo ID disponible sumando 1 al ID más alto
      const newId =
        carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1;

      const newCart = {
        id: newId,
        products: [], // El carrito inicia sin productos
      };

      carts.push(newCart);
      await this.writeCarts(carts);
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  // Busca un carrito específico por su ID
  async getCartById(id) {
    try {
      const carts = await this.readCarts();
      const cart = carts.find((c) => c.id === parseInt(id));
      return cart || null;
    } catch (error) {
      throw error;
    }
  }

  // Agrega un producto al carrito o aumenta su cantidad si ya existe
  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.readCarts();
      const cartIndex = carts.findIndex((c) => c.id === parseInt(cartId));

      if (cartIndex === -1) {
        throw new Error("Carrito no encontrado");
      }

      const cart = carts[cartIndex];
      // Verificamos si el producto ya está en el carrito
      const existingProduct = cart.products.find(
        (p) => p.product === parseInt(productId)
      );

      if (existingProduct) {
        // Si ya existe, aumentamos la cantidad en 1
        existingProduct.quantity += 1;
      } else {
        // Si es nuevo, lo agregamos con cantidad 1
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
