const ProductManager = require("../dao/productManager");

const productManager = new ProductManager();

// Controller de vistas
class ViewController {
  // Página principal
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

  // GET /realtimeproducts - Vista tiempo real
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
