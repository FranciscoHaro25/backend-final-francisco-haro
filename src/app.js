const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");

const productsRouter = require("./routes/productsRouter");
const cartsRouter = require("./routes/cartsRouter");
const viewsRouter = require("./routes/viewsRouter");

const app = express();

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    extname: ".handlebars",
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

module.exports = app;
