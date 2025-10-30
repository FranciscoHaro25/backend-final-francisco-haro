// Configuración principal de Express
const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");

const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const handlebarsHelpers = require("./helpers/handlebars.helpers");

const apiRoutes = require("./routes/index.routes");
const viewsRouter = require("./routes/views.routes");

const app = express();

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    extname: ".handlebars",
    helpers: handlebarsHelpers,
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
