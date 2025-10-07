// Router para las vistas del frontend

const express = require("express");
const viewController = require("../controllers/view.controller");

const router = express.Router();

// Rutas que devuelven vistas HTML renderizadas
router.get("/", viewController.renderHome); // Página principal con lista de productos
router.get("/realtimeproducts", viewController.renderRealTimeProducts); // Página con productos en tiempo real

module.exports = router;
