const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");

// Importar middlewares
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

// Importar routers
const productsRouter = require("./routes/productsRouter");
const cartsRouter = require("./routes/cartsRouter");
const viewsRouter = require("./routes/viewsRouter");

const app = express();

// Configurar Handlebars
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    extname: ".handlebars",
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

module.exports = app;
