// Configuración principal de Express
const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");

const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

const apiRoutes = require("./routes/index.routes");
const viewsRouter = require("./routes/views.routes");

const app = express();

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    extname: ".handlebars",
    helpers: {
      eq: (a, b) => a === b,
      ne: (a, b) => a !== b,
      gt: (a, b) => a > b,
      lt: (a, b) => a < b,
      gte: (a, b) => a >= b,
      lte: (a, b) => a <= b,
      and: (a, b) => a && b,
      or: (a, b) => a || b,

      multiply: (a, b) => (a * b).toFixed(2),

      range: (start, end) => {
        const result = [];
        for (let i = start; i <= end; i++) {
          result.push(i);
        }
        return result;
      },

      currency: (amount) => `$${Number(amount).toFixed(2)}`,
      ifCond: function (v1, operator, v2, options) {
        switch (operator) {
          case "==":
            return v1 == v2 ? options.fn(this) : options.inverse(this);
          case "===":
            return v1 === v2 ? options.fn(this) : options.inverse(this);
          case "!=":
            return v1 != v2 ? options.fn(this) : options.inverse(this);
          case "!==":
            return v1 !== v2 ? options.fn(this) : options.inverse(this);
          case "<":
            return v1 < v2 ? options.fn(this) : options.inverse(this);
          case "<=":
            return v1 <= v2 ? options.fn(this) : options.inverse(this);
          case ">":
            return v1 > v2 ? options.fn(this) : options.inverse(this);
          case ">=":
            return v1 >= v2 ? options.fn(this) : options.inverse(this);
          case "&&":
            return v1 && v2 ? options.fn(this) : options.inverse(this);
          case "||":
            return v1 || v2 ? options.fn(this) : options.inverse(this);
          default:
            return options.inverse(this);
        }
      },
    },
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
