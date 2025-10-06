const express = require("express");
const viewController = require("../controllers/viewController");

const router = express.Router();

// Vistas principales
router.get("/", viewController.renderHome);
router.get("/realtimeproducts", viewController.renderRealTimeProducts);

module.exports = router;
quire("express");
const viewController = require("../controllers/viewController");

const router = express.Router();

// Vistas principales
router.get("/", viewController.renderHome);
router.get("/realtimeproducts", viewController.renderRealTimeProducts);
ress = require("express");
const viewController = require("../controllers/viewController");

// Router para las vistas de la aplicación
const router = express.Router();

// Rutas de vistas con Handlebars
router.get("/", viewController.renderHome); // Página principal
router.get("/realtimeproducts", viewController.renderRealTimeProducts); // Vista tiempo real

module.exports = router;
