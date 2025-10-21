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
}

module.exports = new CartController();
