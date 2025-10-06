const ProductManager = require("../dao/productManager");
const {
  socketLogger,
  socketValidateProduct,
  socketValidateProductId,
  socketErrorHandler,
  socketAuth,
} = require("../middlewares/socketSecurity");

const productManager = new ProductManager();

// Configurar eventos de WebSocket con seguridad
const configureSocket = (io) => {
  // Middleware de autenticación para todas las conexiones
  io.use(socketAuth);

  io.on("connection", (socket) => {
    socketLogger("connection", { socketId: socket.id }, socket);

    // Enviar productos al conectarse
    loadAndSendProducts(socket);

    // Manejar creación de productos con validaciones de seguridad
    socket.on("newProduct", async (productData) => {
      try {
        // Logging del evento
        socketLogger("newProduct", productData, socket);

        // Validar y sanitizar datos del producto
        const validatedProduct = socketValidateProduct(productData, socket);

        // Crear producto con datos seguros
        await productManager.addProduct(validatedProduct);
        await broadcastProducts(io);

        // Log de éxito
        console.log(
          `[${new Date().toISOString()}] Producto creado exitosamente via Socket.IO`
        );
      } catch (error) {
        socketErrorHandler(error, socket, "newProduct");
      }
    });

    // Manejar eliminación de productos con validaciones de seguridad
    socket.on("deleteProduct", async (productId) => {
      try {
        // Logging del evento
        socketLogger("deleteProduct", { productId }, socket);

        // Validar ID con rate limiting y sanitización
        const validatedId = socketValidateProductId(productId, socket);

        await productManager.deleteProduct(validatedId);
        await broadcastProducts(io);

        // Log de éxito
        console.log(
          `[${new Date().toISOString()}] Producto eliminado exitosamente via Socket.IO`
        );
      } catch (error) {
        socketErrorHandler(error, socket, "deleteProduct");
      }
    });

    socket.on("disconnect", () => {
      socketLogger("disconnect", { socketId: socket.id }, socket);
    });
  });
};

// Función auxiliar para cargar y enviar productos a un socket específico
const loadAndSendProducts = async (socket) => {
  try {
    const products = await productManager.getProducts();
    socket.emit("updateProducts", products);
  } catch (error) {
    socket.emit("error", { message: "Error al cargar productos" });
  }
};

// Función auxiliar para enviar productos a todos los clientes conectados
const broadcastProducts = async (io) => {
  try {
    const products = await productManager.getProducts();
    io.emit("updateProducts", products);
  } catch (error) {
    console.error("Error al enviar productos:", error);
  }
};

module.exports = { configureSocket };
