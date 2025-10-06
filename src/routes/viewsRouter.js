const express = require("express");
const viewController = require("../controllers/viewController");

// Router para las vistas de la aplicación
const router = express.Router();

// Rutas de vistas con Handlebars
router.get("/", viewController.renderHome); // Página principal
router.get("/realtimeproducts", viewController.renderRealTimeProducts); // Vista tiempo real

module.exports = router;
