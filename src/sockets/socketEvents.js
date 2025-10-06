// WebSocket events para tiempo real

const ProductManager = require("../dao/productManager");

const productManager = new ProductManager();

// Configurar eventos de Socket.IO
const configureSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    // Mandar productos cuando se conecta
    loadAndSendProducts(socket);

    // Crear producto
    socket.on("newProduct", async (productData) => {
      try {
        await productManager.addProduct(productData);
        await broadcastProducts(io);
      } catch (error) {
        socket.emit("error", { message: error.message });
      }
    });

    // Manejar eliminación de producto
    socket.on("deleteProduct", async (productId) => {
      try {
        await productManager.deleteProduct(productId);
        await broadcastProducts(io);
      } catch (error) {
        socket.emit("error", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
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
