const express = require("express");
const viewController = require("../controllers/viewController");

const router = express.Router();

// Vistas principales
router.get("/", viewController.renderHome);
router.get("/realtimeproducts", viewController.renderRealTimeProducts);

module.exports = router;
