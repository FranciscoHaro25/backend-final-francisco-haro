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
}

module.exports = new CartController();
