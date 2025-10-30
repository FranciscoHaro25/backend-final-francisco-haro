const Cart = require("../../models/cart.model");

class CartDAO {
  constructor() {
    this.model = Cart;
  }

  async createCart(cartData = {}) {
    try {
      const cart = new this.model({
        products: [],
        status: "active",
        ...cartData,
      });

      const savedCart = await cart.save();
      return savedCart.toObject();
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        throw new Error(`Errores de validación: ${messages.join(", ")}`);
      }
      throw error;
    }
  }

  async getCartById(id) {
    try {
      const cart = await this.model
        .findById(id)
        .populate({
          path: "products.product",
          select: "title description price stock status category thumbnails",
          match: { status: true },
        })
        .lean();

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      cart.products = cart.products.filter((item) => item.product !== null);
      return cart;
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID de carrito inválido");
      }
      throw error;
    }
  }

  async getCarts() {
    try {
      const carts = await this.model.find().lean();
      return carts;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.model.findById(cartId, null, {
        skipPopulate: true,
      });

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      await cart.addProduct(productId, quantity);
      return await this.getCartById(cartId);
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID inválido");
      }
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        throw new Error(`Errores de validación: ${messages.join(", ")}`);
      }
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.model.findById(cartId, null, {
        skipPopulate: true,
      });

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      await cart.removeProduct(productId);
      return await this.getCartById(cartId);
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID inválido");
      }
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await this.model.findById(cartId, null, {
        skipPopulate: true,
      });

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      await cart.updateProductQuantity(productId, quantity);
      return await this.getCartById(cartId);
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID inválido");
      }
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        throw new Error(`Errores de validación: ${messages.join(", ")}`);
      }
      throw error;
    }
  }

  async updateCart(cartId, productsArray) {
    try {
      const cart = await this.model.findById(cartId, null, {
        skipPopulate: true,
      });

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      if (!Array.isArray(productsArray)) {
        throw new Error("Los productos deben ser un array");
      }

      const validatedProducts = productsArray.map((item) => {
        if (!item.product || !item.quantity) {
          throw new Error('Cada producto debe tener "product" y "quantity"');
        }

        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
          throw new Error("La cantidad debe ser un número entero positivo");
        }

        return {
          product: item.product,
          quantity: item.quantity,
        };
      });

      cart.products = validatedProducts;
      await cart.save();

      return await this.getCartById(cartId);
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID inválido");
      }
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        throw new Error(`Errores de validación: ${messages.join(", ")}`);
      }
      throw error;
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await this.model.findById(cartId, null, {
        skipPopulate: true,
      });

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      await cart.clearCart();
      return cart.toObject();
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID inválido");
      }
      throw error;
    }
  }

  async deleteCart(cartId) {
    try {
      const deletedCart = await this.model.findByIdAndDelete(cartId).lean();

      if (!deletedCart) {
        throw new Error("Carrito no encontrado");
      }

      return deletedCart;
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID inválido");
      }
      throw error;
    }
  }

  async getActiveCarts() {
    try {
      const carts = await this.model.findActive().lean();
      return carts;
    } catch (error) {
      throw error;
    }
  }

  async getCartsByUser(userId) {
    try {
      const carts = await this.model.findByUser(userId).lean();
      return carts;
    } catch (error) {
      throw error;
    }
  }

  async getCartsWithProducts() {
    try {
      const carts = await this.model.findWithProducts().lean();
      return carts;
    } catch (error) {
      throw error;
    }
  }

  async updateCartStatus(cartId, status) {
    try {
      const validStatuses = ["active", "completed", "abandoned"];

      if (!validStatuses.includes(status)) {
        throw new Error("Estado de carrito inválido");
      }

      const updatedCart = await this.model
        .findByIdAndUpdate(
          cartId,
          { status },
          { new: true, runValidators: true }
        )
        .lean();

      if (!updatedCart) {
        throw new Error("Carrito no encontrado");
      }

      return updatedCart;
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID inválido");
      }
      throw error;
    }
  }

  async getCartStats() {
    try {
      const stats = await this.model.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalItems: {
              $sum: {
                $sum: "$products.quantity",
              },
            },
          },
        },
      ]);

      const totalCarts = await this.model.countDocuments();
      const averageItemsPerCart = await this.model.aggregate([
        {
          $group: {
            _id: null,
            avgItems: {
              $avg: {
                $sum: "$products.quantity",
              },
            },
          },
        },
      ]);

      return {
        byStatus: stats,
        totalCarts,
        averageItemsPerCart: averageItemsPerCart[0]?.avgItems || 0,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartDAO;
