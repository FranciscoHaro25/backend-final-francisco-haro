// Servicio de carritos - Gestión de carritos de compra
// Coordina las operaciones entre controllers y el manager de carritos

const CartManager = require("../dao/cart.manager");

class CartService {
  constructor() {
    this.cartManager = new CartManager();
  }

  // Obtener todos los carritos disponibles
  async list() {
    try {
      return await this.cartManager.getCarts();
    } catch (error) {
      throw error;
    }
  }

  // Obtener carrito por ID
  async getById(id) {
    try {
      const cart = await this.cartManager.getCartById(id);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  // Crear nuevo carrito
  async create(cartData = {}) {
    try {
      return await this.cartManager.createCart(cartData);
    } catch (error) {
      throw error;
    }
  }

  // Agregar producto al carrito
  async addProduct(cartId, productId, quantity = 1) {
    try {
      return await this.cartManager.addProductToCart(
        cartId,
        productId,
        quantity
      );
    } catch (error) {
      throw error;
    }
  }

  // Actualizar carrito
  async update(id, updateData) {
    try {
      return await this.cartManager.updateCart(id, updateData);
    } catch (error) {
      throw error;
    }
  }

  // Eliminar carrito
  async remove(id) {
    try {
      return await this.cartManager.deleteCart(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartService;
