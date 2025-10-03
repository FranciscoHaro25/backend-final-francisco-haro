const express = require("express");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");

const productsRouter = require("./routes/productsRouter");
const cartsRouter = require("./routes/cartsRouter");
const ProductManager = require("./dao/productManager");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;

const productManager = new ProductManager();

// Configuración de Handlebars
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Hacer io disponible en las rutas
app.set("io", io);

// Rutas de API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas de vistas
app.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", {
      title: "Mi Tienda",
      products,
    });
  } catch (error) {
    res.status(500).send("Error al cargar productos");
  }
});

app.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", {
      title: "Productos en Tiempo Real",
      products,
    });
  } catch (error) {
    res.status(500).send("Error al cargar productos");
  }
});

// Configuración de Socket.IO
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Enviar productos al cliente recién conectado
  productManager.getProducts().then((products) => {
    socket.emit("updateProducts", products);
  });

  // Manejar nuevo producto
  socket.on("newProduct", async (productData) => {
    try {
      const newProduct = await productManager.addProduct(productData);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  // Manejar eliminación de producto
  socket.on("deleteProduct", async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
  console.log(`Visita: http://localhost:${PORT}`);
});

module.exports = app;
