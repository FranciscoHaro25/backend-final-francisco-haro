// Configuración de eventos de WebSocket para funcionalidad en tiempo real
// Maneja las conexiones de socket y los eventos de productos
const ProductService = require("../services/product.service");
const {
  socketLogger,
  socketValidateProduct,
  socketValidateProductId,
  socketErrorHandler,
  socketAuth,
} = require("../middlewares/socketSecurity");

const productService = new ProductService();

// Función principal que configura todos los eventos de WebSocket
const configureSocket = (io) => {
  // Aplicamos middleware de autenticación a todas las conexiones
  io.use(socketAuth);

  io.on("connection", (socket) => {
    socketLogger("connection", { socketId: socket.id }, socket);

    // Cuando alguien se conecta, le enviamos la lista actual de productos
    loadAndSendProducts(socket);

    // Escuchamos cuando el cliente quiere crear un producto nuevo
    socket.on("newProduct", async (productData) => {
      try {
        // Registramos el evento para auditoria
        socketLogger("newProduct", productData, socket);

        // Validamos que los datos del producto sean seguros
        const validatedProduct = socketValidateProduct(productData, socket);

        // Creamos el producto y notificamos a todos los clientes conectados
        await productService.create(validatedProduct);
        await broadcastProducts(io);

        // Confirmamos que todo salió bien en los logs
        console.log(
          `[${new Date().toISOString()}] Producto creado exitosamente via Socket.IO`
        );
      } catch (error) {
        socketErrorHandler(error, socket, "newProduct");
      }
    });

    // Escuchamos cuando el cliente quiere eliminar un producto
    socket.on("deleteProduct", async (productId) => {
      try {
        // Guardamos el evento en los logs
        socketLogger("deleteProduct", { productId }, socket);

        // Validar ID con rate limiting y sanitización
        const validatedId = socketValidateProductId(productId, socket);

        await productService.remove(validatedId);
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
    const products = await productService.list({});
    socket.emit("updateProducts", products);
  } catch (error) {
    socket.emit("error", { message: "Error al cargar productos" });
  }
};

// Función auxiliar para enviar productos a todos los clientes conectados
const broadcastProducts = async (io) => {
  try {
    const products = await productService.list({});
    io.emit("updateProducts", products);
  } catch (error) {
    console.error("Error al enviar productos:", error);
  }
};

module.exports = { configureSocket };
