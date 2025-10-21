// Factory pattern para seleccionar el tipo de persistencia
// Permite cambiar entre FileSystem y MongoDB fácilmente

const config = require("../config/config");

// Tipo de persistencia desde variables de entorno o por defecto
const PERSISTENCE_TYPE = process.env.PERSISTENCE || "MONGODB";

class DAOFactory {
  static async getProductDAO() {
    let productDAO;

    switch (PERSISTENCE_TYPE.toUpperCase()) {
      case "FILESYSTEM":
      case "FILE":
        // Usar persistencia en archivos (implementación original)
        const ProductManager = await import(
          "../dao/filesystem/product.manager.js"
        );
        productDAO = new ProductManager.default();
        console.log("📁 Usando persistencia FileSystem para productos");
        break;

      case "MONGODB":
      case "MONGO":
      default:
        // Usar persistencia en MongoDB
        const ProductDAO = require("../dao/mongodb/product.dao");
        productDAO = new ProductDAO();
        console.log("🗄️ Usando persistencia MongoDB para productos");
        break;
    }

    return productDAO;
  }

  static async getCartDAO() {
    let cartDAO;

    switch (PERSISTENCE_TYPE.toUpperCase()) {
      case "FILESYSTEM":
      case "FILE":
        // Usar persistencia en archivos (implementación original)
        const CartManager = await import("../dao/filesystem/cart.manager.js");
        cartDAO = new CartManager.default();
        console.log("📁 Usando persistencia FileSystem para carritos");
        break;

      case "MONGODB":
      case "MONGO":
      default:
        // Usar persistencia en MongoDB
        const CartDAO = require("../dao/mongodb/cart.dao");
        cartDAO = new CartDAO();
        console.log("🗄️ Usando persistencia MongoDB para carritos");
        break;
    }

    return cartDAO;
  }

  // Método para inicializar la conexión según el tipo de persistencia
  static async initializePersistence() {
    const persistenceType = PERSISTENCE_TYPE.toUpperCase();

    switch (persistenceType) {
      case "MONGODB":
      case "MONGO":
        // Inicializar conexión a MongoDB
        const database = require("../config/database");
        await database.connect();
        console.log("✅ Persistencia MongoDB inicializada");
        break;

      case "FILESYSTEM":
      case "FILE":
        // Para FileSystem no hay inicialización especial
        console.log("✅ Persistencia FileSystem inicializada");
        break;

      default:
        console.log(
          "⚠️ Tipo de persistencia no reconocido, usando MongoDB por defecto"
        );
        const databaseDefault = require("../config/database");
        await databaseDefault.connect();
        break;
    }
  }

  // Obtener información sobre el tipo de persistencia actual
  static getPersistenceInfo() {
    return {
      type: PERSISTENCE_TYPE,
      description:
        PERSISTENCE_TYPE === "MONGODB"
          ? "Base de datos MongoDB"
          : "Sistema de archivos JSON",
      configured: true,
    };
  }

  // Método para cambiar el tipo de persistencia (para testing)
  static setPersistenceType(type) {
    process.env.PERSISTENCE = type;
    console.log(`🔄 Tipo de persistencia cambiado a: ${type}`);
  }
}

module.exports = DAOFactory;
