const io = require("socket.io-client");

console.log("Probando conexión WebSocket...");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("✅ WebSocket conectado exitosamente");
  console.log("ID de socket:", socket.id);

  // Probar envío de producto
  const testProduct = {
    title: "Producto Test WebSocket",
    description: "Prueba automática",
    code: "TEST-" + Date.now(),
    price: 99.99,
    stock: 10,
    category: "Test",
  };

  console.log("Enviando producto de prueba...");
  socket.emit("newProduct", testProduct);
});

socket.on("connect_error", (error) => {
  console.log("❌ Error de conexión:", error);
});

socket.on("disconnect", () => {
  console.log("🔌 WebSocket desconectado");
});

socket.on("updateProducts", (products) => {
  console.log("📦 Productos actualizados:", products.length, "productos");
  console.log("Último producto:", products[products.length - 1]?.title);
});

socket.on("error", (error) => {
  console.log("⚠️ Error:", error);
});

// Cerrar después de 5 segundos
setTimeout(() => {
  console.log("Cerrando conexión de prueba...");
  socket.disconnect();
  process.exit(0);
}, 5000);
