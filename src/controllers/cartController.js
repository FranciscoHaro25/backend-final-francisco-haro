const CartManager = require("../dao/cartManager");

const cartManager = new CartManager();

// Controller de carritos
class CartController {
  // Crear carrito
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
        error: "Error al crear carrito",
        message: error.message,
      });
    }
  }

  // GET /api/carts/:cid
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

  // POST /api/carts/:cid/product/:pid
  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const cart = await cartManager.addProductToCart(cid, pid);

      res.json({
        message: "Producto agregado al carrito exitosamente",
        cart: cart,
      });
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      res.status(400).json({
        error: "Error al agregar producto al carrito",
        message: error.message,
      });
    }
  }
}

module.exports = new CartController();
