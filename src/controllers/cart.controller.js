const CartService = require("../services/cart.service");

const cartService = new CartService();

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await cartService.createCart();
      res.status(201).json({
        message: "Carrito creado exitosamente",
        cart: newCart,
      });
    } catch (error) {
      console.error("Error al crear carrito:", error);
      res.status(500).json({
        error: "Error del servidor",
        message: error.message,
      });
    }
  }

  async getCartById(req, res) {
    try {
      const cart = await cartService.getById(req.params.cid);
      res.json(cart);
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      if (error.message === "Carrito no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({
        error: "Error del servidor",
        message: error.message,
      });
    }
  }

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity = 1 } = req.body;

      const updatedCart = await cartService.addProduct(cid, pid, quantity);

      res.json({
        message: "Producto agregado al carrito exitosamente",
        cart: updatedCart,
      });
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);

      const status = error.message.includes("no encontrado") ? 404 : 400;

      res.status(status).json({
        error: "Error al agregar producto al carrito",
        message: error.message,
      });
    }
  }

  // DELETE /:cid/products/:pid - Eliminar producto específico del carrito
  async removeProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;

      const updatedCart = await cartService.removeProduct(cid, pid);

      res.json({
        message: "Producto eliminado del carrito exitosamente",
        cart: updatedCart,
      });
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);

      const status = error.message.includes("no encontrado") ? 404 : 400;

      res.status(status).json({
        error: "Error al eliminar producto del carrito",
        message: error.message,
      });
    }
  }

  // PUT /:cid - Actualizar carrito con arreglo de productos
  async updateCart(req, res) {
    try {
      const { cid } = req.params;
      const { products } = req.body;

      if (!Array.isArray(products)) {
        return res.status(400).json({
          error: "Formato inválido",
          message: "El campo 'products' debe ser un arreglo",
        });
      }

      const updatedCart = await cartService.updateCart(cid, products);

      res.json({
        message: "Carrito actualizado exitosamente",
        cart: updatedCart,
      });
    } catch (error) {
      console.error("Error al actualizar carrito:", error);

      const status = error.message.includes("no encontrado") ? 404 : 400;

      res.status(status).json({
        error: "Error al actualizar carrito",
        message: error.message,
      });
    }
  }

  // PUT /:cid/products/:pid - Actualizar cantidad de producto específico
  async updateProductQuantity(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          error: "Cantidad inválida",
          message: "La cantidad debe ser un número mayor a 0",
        });
      }

      const updatedCart = await cartService.updateProductQuantity(
        cid,
        pid,
        quantity
      );

      res.json({
        message: "Cantidad actualizada exitosamente",
        cart: updatedCart,
      });
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);

      const status = error.message.includes("no encontrado") ? 404 : 400;

      res.status(status).json({
        error: "Error al actualizar cantidad",
        message: error.message,
      });
    }
  }

  // DELETE /:cid - Eliminar todos los productos del carrito
  async clearCart(req, res) {
    try {
      const { cid } = req.params;

      const updatedCart = await cartService.clearCart(cid);

      res.json({
        message: "Carrito vaciado exitosamente",
        cart: updatedCart,
      });
    } catch (error) {
      console.error("Error al vaciar carrito:", error);

      const status = error.message.includes("no encontrado") ? 404 : 500;

      res.status(status).json({
        error: "Error al vaciar carrito",
        message: error.message,
      });
    }
  }

  // GET /:cid con población de productos (para vista)
  async getCartWithProducts(req, res) {
    try {
      const { cid } = req.params;

      const cart = await cartService.getCartWithProducts(cid);

      res.json({
        message: "Carrito obtenido exitosamente",
        cart: cart,
      });
    } catch (error) {
      console.error("Error al obtener carrito con productos:", error);

      const status = error.message.includes("no encontrado") ? 404 : 500;

      res.status(status).json({
        error: "Error al obtener carrito",
        message: error.message,
      });
    }
  }

  // DELETE /:cid/products/:pid - Eliminar producto específico del carrito
  async removeProduct(req, res) {
    try {
      const { cid, pid } = req.params;

      const updatedCart = await cartService.removeProduct(cid, pid);

      res.json({
        message: "Producto eliminado del carrito exitosamente",
        cart: updatedCart,
      });
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);

      const status = error.message.includes("no encontrado") ? 404 : 400;

      res.status(status).json({
        error: "Error al eliminar producto del carrito",
        message: error.message,
      });
    }
  }

  // POST /:cid/purchase - Procesar compra del carrito
  async purchaseCart(req, res) {
    try {
      const { cid } = req.params;

      // Obtener el carrito con productos
      const cart = await cartService.getCartWithProducts(cid);

      if (!cart || cart.products.length === 0) {
        return res.status(400).json({
          error: "Carrito vacío",
          message: "No hay productos en el carrito para procesar la compra",
        });
      }

      // Verificar stock disponible antes de procesar
      const ProductService = require("../services/product.service");
      const productService = new ProductService();

      const stockErrors = [];
      for (const item of cart.products) {
        if (item.product && item.product.stock < item.quantity) {
          stockErrors.push(
            `${item.product.title}: stock insuficiente (disponible: ${item.product.stock}, solicitado: ${item.quantity})`
          );
        }
      }

      if (stockErrors.length > 0) {
        return res.status(400).json({
          error: "Stock insuficiente",
          message: "Algunos productos no tienen stock suficiente",
          details: stockErrors,
        });
      }

      // Actualizar stock de productos
      const productUpdates = [];
      for (const item of cart.products) {
        if (item.product) {
          const newStock = item.product.stock - item.quantity;
          try {
            await productService.update(item.product._id, { stock: newStock });
            productUpdates.push({
              productId: item.product._id,
              oldStock: item.product.stock,
              newStock: newStock,
              quantityPurchased: item.quantity,
            });
          } catch (error) {
            console.error(
              `Error actualizando stock del producto ${item.product._id}:`,
              error
            );
            throw new Error(
              `No se pudo actualizar el stock del producto: ${item.product.title}`
            );
          }
        }
      }

      // Calcular total de la compra
      const total = cart.products.reduce((acc, item) => {
        return acc + item.product.price * item.quantity;
      }, 0);

      // Crear número de orden único
      const orderNumber = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Crear registro de la compra
      const purchase = {
        orderNumber,
        cartId: cid,
        products: cart.products.map((item) => ({
          productId: item.product._id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          subtotal: item.product.price * item.quantity,
        })),
        total,
        purchaseDate: new Date(),
        status: "completed",
        stockUpdates: productUpdates,
      };

      // Vaciar el carrito después de la compra exitosa
      await cartService.clearCart(cid);

      res.json({
        message: "Compra procesada exitosamente",
        purchase: purchase,
      });
    } catch (error) {
      console.error("Error al procesar compra:", error);

      const status = error.message.includes("no encontrado") ? 404 : 500;

      res.status(status).json({
        error: "Error al procesar compra",
        message: error.message,
      });
    }
  }
}

module.exports = new CartController();
