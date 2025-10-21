const Cart = require("../../models/cart.model");

// DAO para carritos usando MongoDB con Mongoose
class CartDAO {
  constructor() {
    this.model = Cart;
  }

  // Crear nuevo carrito
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

  // Obtener carrito por ID con productos populados
  async getCartById(id) {
    try {
      const cart = await this.model
        .findById(id)
        .populate({
          path: "products.product",
          select: "title description price stock status category thumbnails",
          match: { status: true }, // Solo productos activos
        })
        .lean();

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Filtrar productos que no existen o están inactivos
      cart.products = cart.products.filter((item) => item.product !== null);

      return cart;
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID de carrito inválido");
      }
      throw error;
    }
  }

  // Obtener todos los carritos
  async getCarts() {
    try {
      const carts = await this.model.find().lean();
      return carts;
    } catch (error) {
      throw error;
    }
  }

  // Agregar producto al carrito
  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.model.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Verificar si el producto ya existe en el carrito
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId.toString()
      );

      if (existingProductIndex >= 0) {
        // Si existe, actualizar cantidad
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // Si no existe, agregar nuevo producto
        cart.products.push({
          product: productId,
          quantity: quantity,
        });
      }

      const updatedCart = await cart.save();

      // Retornar carrito populado
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

  // Eliminar producto específico del carrito
  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.model.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Filtrar el producto a eliminar
      const initialLength = cart.products.length;
      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId.toString()
      );

      if (cart.products.length === initialLength) {
        throw new Error("Producto no encontrado en el carrito");
      }

      await cart.save();

      // Retornar carrito populado
      return await this.getCartById(cartId);
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID inválido");
      }
      throw error;
    }
  }

  // Actualizar cantidad de producto específico
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await this.model.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId.toString()
      );

      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }

      if (quantity <= 0) {
        // Si la cantidad es 0 o negativa, eliminar el producto
        cart.products.splice(productIndex, 1);
      } else {
        // Actualizar cantidad
        cart.products[productIndex].quantity = quantity;
      }

      await cart.save();

      // Retornar carrito populado
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

  // Actualizar carrito completo con array de productos
  async updateCart(cartId, productsArray) {
    try {
      const cart = await this.model.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Validar formato de productos
      if (!Array.isArray(productsArray)) {
        throw new Error("Los productos deben ser un array");
      }

      // Validar cada producto en el array
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

      // Actualizar productos del carrito
      cart.products = validatedProducts;
      await cart.save();

      // Retornar carrito populado
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

  // Vaciar carrito completo
  async clearCart(cartId) {
    try {
      const cart = await this.model.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      cart.products = [];
      await cart.save();

      return cart.toObject();
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID inválido");
      }
      throw error;
    }
  }

  // Eliminar carrito completo
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

  // Métodos adicionales útiles

  // Obtener carritos activos
  async getActiveCarts() {
    try {
      const carts = await this.model.findActive().lean();
      return carts;
    } catch (error) {
      throw error;
    }
  }

  // Obtener carritos de un usuario específico
  async getCartsByUser(userId) {
    try {
      const carts = await this.model.findByUser(userId).lean();
      return carts;
    } catch (error) {
      throw error;
    }
  }

  // Obtener carritos que tienen productos
  async getCartsWithProducts() {
    try {
      const carts = await this.model.findWithProducts().lean();
      return carts;
    } catch (error) {
      throw error;
    }
  }

  // Cambiar estado del carrito
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

  // Obtener estadísticas de carritos
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

  // Actualizar cantidad específica de un producto en el carrito
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      if (quantity <= 0) {
        throw new Error("La cantidad debe ser mayor a 0");
      }

      const cart = await this.model.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }

      cart.products[productIndex].quantity = quantity;
      const updatedCart = await cart.save();

      return updatedCart.toObject();
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID de carrito o producto inválido");
      }
      throw error;
    }
  }

  // Eliminar un producto específico del carrito
  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.model.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }

      cart.products.splice(productIndex, 1);
      const updatedCart = await cart.save();

      return updatedCart.toObject();
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID de carrito o producto inválido");
      }
      throw error;
    }
  }

  // Limpiar todos los productos del carrito
  async clearCart(cartId) {
    try {
      const cart = await this.model.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      cart.products = [];
      const updatedCart = await cart.save();

      return updatedCart.toObject();
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error("ID de carrito inválido");
      }
      throw error;
    }
  }

  // Obtener carrito con productos para vistas (alias de getCartById)
  async getCartWithProducts(cartId) {
    try {
      const cart = await this.getCartById(cartId);

      // Calcular totales para la vista
      let total = 0;
      let totalItems = 0;

      cart.products.forEach((item) => {
        if (item.product && item.product.price) {
          total += item.product.price * item.quantity;
          totalItems += item.quantity;
        }
      });

      return {
        ...cart,
        summary: {
          total: Number(total.toFixed(2)),
          totalItems,
          productCount: cart.products.length,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartDAO;
