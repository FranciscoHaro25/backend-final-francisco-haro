const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

// Rutas de carritos
router.post("/", cartController.createCart);
router.get("/:cid", cartController.getCartById);
router.post("/:cid/product/:pid", cartController.addProductToCart);

module.exports = router;
ire("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

// Rutas de carritos
router.post("/", cartController.createCart);
router.get("/:cid", cartController.getCartById);
router.post("/:cid/product/:pid", cartController.addProductToCart);
ess = require("express");
const cartController = require("../controllers/cartController");

// Router para endpoints de carritos
const router = express.Router();

// Rutas para API de carritos
router.post("/", cartController.createCart); // Crear carrito
router.get("/:cid", cartController.getCartById); // Obtener carrito
router.post("/:cid/product/:pid", cartController.addProductToCart); // Agregar producto

module.exports = router;
