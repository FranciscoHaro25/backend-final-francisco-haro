const CartManager = require("../dao/cartManager");
const cartManager = new CartManager();

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await cartManager.createCart();
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
      const cart = await cartManager.getCartById(req.params.cid);
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.json(cart);
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      res.status(500).json({
        error: "Error del servidor",
        message: error.message,
      });
    }
  }

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const updatedCart = await cartManager.addProductToCart(cid, pid);
      
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
