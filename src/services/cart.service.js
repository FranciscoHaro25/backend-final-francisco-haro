// Servicio de carritos - Gestión de carritos de compra
// Coordina las operaciones entre controllers y el DAO de carritos

const DAOFactory = require("../dao/factory.dao");

class CartService {
  constructor() {
    this.cartDAO = null;
    this.init();
  }

  // Inicializar el DAO correspondiente
  async init() {
    this.cartDAO = await DAOFactory.getCartDAO();
  }

  // Obtener todos los carritos disponibles
  async list() {
    try {
      if (!this.cartDAO) {
        await this.init();
      }

      return await this.cartDAO.getCarts();
    } catch (error) {
      throw error;
    }
  }

  // Obtener carrito por ID
  async getById(id) {
    try {
      if (!this.cartDAO) {
        await this.init();
      }

      const cart = await this.cartDAO.getCartById(id);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  // Crear nuevo carrito
  async createCart(cartData = {}) {
    try {
      if (!this.cartDAO) {
        await this.init();
      }

      return await this.cartDAO.createCart(cartData);
    } catch (error) {
      throw error;
    }
  }

  // Actualizar carrito con array de productos
  async updateCart(cartId, products) {
    try {
      if (!this.cartDAO) {
        await this.init();
      }

      if (this.cartDAO.updateCart) {
        return await this.cartDAO.updateCart(cartId, products);
      }

      throw new Error("Funcionalidad no disponible con la persistencia actual");
    } catch (error) {
      throw error;
    }
  }

  // Obtener carrito con productos populados
  async getCartWithProducts(cartId) {
    try {
      if (!this.cartDAO) {
        await this.init();
      }

      if (this.cartDAO.getCartWithProducts) {
        return await this.cartDAO.getCartWithProducts(cartId);
      }

      // Fallback: obtener carrito normal
      return await this.getById(cartId);
    } catch (error) {
      throw error;
    }
  }

  // Agregar producto al carrito
  async addProduct(cartId, productId, quantity = 1) {
    try {
      if (!this.cartDAO) {
        await this.init();
      }

      return await this.cartDAO.addProductToCart(cartId, productId, quantity);
    } catch (error) {
      throw error;
    }
  }

  // Actualizar carrito completo
  async update(id, updateData) {
    try {
      if (!this.cartDAO) {
        await this.init();
      }

      // Verificar si es actualización de productos completa
      if (updateData.products && Array.isArray(updateData.products)) {
        return await this.cartDAO.updateCart(id, updateData.products);
      }

      // Compatibilidad con implementación anterior
      if (this.cartDAO.updateCart) {
        return await this.cartDAO.updateCart(id, updateData);
      }

      throw new Error("Método de actualización no soportado");
    } catch (error) {
      throw error;
    }
  }

  // Eliminar carrito
  async remove(id) {
    try {
      if (!this.cartDAO) {
        await this.init();
      }

      return await this.cartDAO.deleteCart(id);
    } catch (error) {
      throw error;
    }
  }

  // Métodos adicionales para funcionalidad extendida

  // Eliminar producto específico del carrito
  async removeProduct(cartId, productId) {
    try {
      if (!this.cartDAO) {
        await this.init();
      }

      if (this.cartDAO.removeProductFromCart) {
        return await this.cartDAO.removeProductFromCart(cartId, productId);
      }

      throw new Error("Funcionalidad no disponible con la persistencia actual");
    } catch (error) {
      throw error;
    }
  }

  // Actualizar cantidad de producto específico
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      if (!this.cartDAO) {
        await this.init();
      }

      if (this.cartDAO.updateProductQuantity) {
        return await this.cartDAO.updateProductQuantity(
          cartId,
          productId,
          quantity
        );
      }

      throw new Error("Funcionalidad no disponible con la persistencia actual");
    } catch (error) {
      throw error;
    }
  }

  // Vaciar carrito completo
  async clearCart(cartId) {
    try {
      if (!this.cartDAO) {
        await this.init();
      }

      if (this.cartDAO.clearCart) {
        return await this.cartDAO.clearCart(cartId);
      }

      // Fallback: actualizar con array vacío
      return await this.update(cartId, { products: [] });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartService;
