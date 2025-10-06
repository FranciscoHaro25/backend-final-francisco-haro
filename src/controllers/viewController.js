const ProductManager = require("../dao/productManager");

// Instancia para manejar productos en vistas
const productManager = new ProductManager();

class ViewController {
  // Renderizar página principal
  async renderHome(req, res) {
    try {
      const products = await productManager.getProducts();
      res.render("home", {
        title: "Mi Tienda - Home",
        products,
        hasProducts: products.length > 0,
      });
    } catch (error) {
      console.error("Error al cargar vista home:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "Error al cargar productos",
        error: error.message,
      });
    }
  }

  // Renderizar vista de productos en tiempo real
  async renderRealTimeProducts(req, res) {
    try {
      const products = await productManager.getProducts();
      res.render("realTimeProducts", {
        title: "Productos en Tiempo Real",
        products,
        hasProducts: products.length > 0,
      });
    } catch (error) {
      console.error("Error al cargar vista tiempo real:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "Error al cargar productos en tiempo real",
        error: error.message,
      });
    }
  }
}

module.exports = new ViewController();
