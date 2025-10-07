// Controlador que maneja las operaciones de carritos de compra
// Implementa los endpoints para crear, consultar y modificar carritos
const CartService = require("../services/cart.service");

// Instancia del servicio de carritos para las operaciones de negocio
const cartService = new CartService();

class CartController {
  // Método para crear un carrito vacío cuando el usuario lo solicita
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

  // Busca y devuelve un carrito específico usando su ID único
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

  // Agrega un producto al carrito, con cantidad especificada o por defecto 1
  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      // Si no se especifica cantidad, se agrega 1 unidad por defecto
      const { quantity = 1 } = req.body;

      const updatedCart = await cartService.addProduct(cid, pid, quantity);

      res.json({
        message: "Producto agregado al carrito exitosamente",
        cart: updatedCart,
      });
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);

      // Revisamos el tipo de error para enviar el código HTTP correcto
      const status = error.message.includes("no encontrado") ? 404 : 400;

      res.status(status).json({
        error: "Error al agregar producto al carrito",
        message: error.message,
      });
    }
  }
}

module.exports = new CartController();
