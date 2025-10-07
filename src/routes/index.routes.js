const express = require("express");
const productsRoutes = require("./products.routes");
const cartsRoutes = require("./carts.routes");
const viewsRoutes = require("./views.routes");

const router = express.Router();

// Endpoint raíz de la API
router.get("/", (req, res) => {
  res.json({
    name: "entrega-1",
    version: "v1",
    description: "API de productos y carritos con Socket.IO",
    endpoints: {
      products: "/api/products",
      carts: "/api/carts",
      views: "/api/views",
    },
  });
});

// Montar rutas específicas
router.use("/products", productsRoutes);
router.use("/carts", cartsRoutes);
router.use("/views", viewsRoutes);

module.exports = router;
