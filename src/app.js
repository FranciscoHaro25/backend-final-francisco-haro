// Configuración principal de Express
// Francisco Haro - Entrega Backend

const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");

// Importar middlewares personalizados
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

// Importar las rutas del proyecto
const apiRoutes = require("./routes/index.routes");
const viewsRouter = require("./routes/views.routes");

const app = express();

// Configuración del motor de plantillas Handlebars
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    extname: ".handlebars",
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Configuración de middlewares principales
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Configuración de rutas
app.use("/api", apiRoutes);
app.use("/", viewsRouter);

// El middleware de errores siempre va al final
app.use(errorHandler);

module.exports = app;
