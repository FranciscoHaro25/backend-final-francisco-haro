const express = require("express");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");
const logger = require("./middlewares/logger");

const ProductManager = require("./managers/ProductManager");
const CartManager = require("./managers/CartManager");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;

// Configurar Handlebars
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Instancias de managers
const productManager = new ProductManager();
const cartManager = new CartManager();

// Rutas de API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas de vistas web
app.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const carts = await cartManager.getCarts();

    // Estadísticas básicas
    const stats = {
      products: {
        total: products.length,
        inStock: products.filter((p) => p.stock > 0).length,
        categories: [...new Set(products.map((p) => p.category))],
      },
      carts: {
        total: carts.length,
        withProducts: carts.filter((c) => c.products.length > 0).length,
      },
    };

    res.render("home", {
      title: "Mi Tienda - Inicio",
      productCount: products.length,
      cartCount: carts.length,
      stats: stats,
    });
  } catch (error) {
    res.status(500).render("error", { error: "Error del servidor" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      category: req.query.category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      limit: req.query.limit || 20,
    };

    const products = await productManager.getProducts(filters);
    res.render("products", {
      title: "Productos",
      products: products,
      search: req.query.search,
      category: req.query.category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
    });
  } catch (error) {
    res.status(500).render("error", { error: "Error al cargar productos" });
  }
});

app.get("/carts", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.render("carts", {
      title: "Carritos",
      carts: carts,
    });
  } catch (error) {
    res.status(500).render("error", { error: "Error al cargar carritos" });
  }
});

app.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", {
      title: "Productos en Tiempo Real",
      products: products,
    });
  } catch (error) {
    res.status(500).render("error", { error: "Error al cargar productos" });
  }
});

// Ruta de API básica
app.get("/api", (req, res) => {
  res.json({
    message: "API de Mi Tienda",
    endpoints: {
      products: "/api/products",
      carts: "/api/carts",
    },
    version: "1.0.0",
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Configuración básica de Socket.io
io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // Evento para agregar producto
  socket.on("newProduct", async (productData) => {
    try {
      const newProduct = await productManager.addProduct(productData);
      const products = await productManager.getProducts();

      // Enviar lista actualizada a todos los clientes
      io.emit("updateProducts", products);
      console.log("Producto agregado:", newProduct.title);
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  // Evento para eliminar producto
  socket.on("deleteProduct", async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      const products = await productManager.getProducts();

      // Enviar lista actualizada a todos los clientes
      io.emit("updateProducts", products);
      console.log("Producto eliminado, ID:", productId);
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

// Hacer que io esté disponible en las rutas
app.set("io", io);

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
  console.log(`Visita: http://localhost:${PORT}`);
  console.log("WebSockets habilitados");
});

module.exports = app;
