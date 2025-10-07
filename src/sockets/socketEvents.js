const ProductService = require("../services/product.service");
const ProductController = require("../controllers/product.controller");
const {
  socketLogger,
  socketValidateProduct,
  socketValidateProductId,
  socketErrorHandler,
  socketAuth,
} = require("../middlewares/socketSecurity");

const productService = new ProductService();

const configureSocket = (io) => {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    socketLogger("connection", { socketId: socket.id }, socket);
    loadAndSendProducts(socket);

    socket.on("newProduct", async (productData) => {
      try {
        socketLogger("newProduct", productData, socket);
        const validatedProduct = socketValidateProduct(productData, socket);
        await productService.create(validatedProduct);
        await ProductController.broadcastProductUpdate(io);
        console.log(
          `[${new Date().toISOString()}] Producto creado via Socket.IO`
        );
      } catch (error) {
        socketErrorHandler(error, socket, "newProduct");
      }
    });

    socket.on("deleteProduct", async (productId) => {
      try {
        socketLogger("deleteProduct", { productId }, socket);
        const validatedId = socketValidateProductId(productId, socket);
        await productService.remove(validatedId);
        await ProductController.broadcastProductUpdate(io);
        console.log(
          `[${new Date().toISOString()}] Producto eliminado via Socket.IO`
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

const loadAndSendProducts = async (socket) => {
  try {
    const products = await productService.list({});
    socket.emit("updateProducts", products);
  } catch (error) {
    socket.emit("error", { message: "Error al cargar productos" });
  }
};

module.exports = { configureSocket };
