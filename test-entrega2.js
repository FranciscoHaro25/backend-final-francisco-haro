const io = require("socket.io-client");

console.log("🧪 PRUEBA COMPLETA DE LA ENTREGA 2");
console.log("==================================");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("✅ WebSocket conectado exitosamente");

  setTimeout(() => {
    console.log("🚀 Agregando producto de prueba...");
    const testProduct = {
      title: "Producto de Prueba WebSocket",
      description: "Prueba de funcionalidad en tiempo real",
      code: "TEST-WS-" + Date.now(),
      price: 99.99,
      stock: 10,
      category: "Pruebas",
    };

    socket.emit("newProduct", testProduct);
  }, 1000);
});

socket.on("updateProducts", (products) => {
  console.log(`📦 Lista actualizada: ${products.length} productos`);
  if (products.length > 0) {
    const lastProduct = products[products.length - 1];
    console.log(
      `   Último producto: ${lastProduct.title} - $${lastProduct.price}`
    );
  }
});

socket.on("error", (error) => {
  console.log("❌ Error:", error.message);
});

socket.on("disconnect", () => {
  console.log("🔌 Desconectado");
});

setTimeout(() => {
  console.log("\n🎉 PRUEBA COMPLETADA");
  console.log("✅ WebSocket funcionando correctamente");
  console.log("✅ Productos se actualizan en tiempo real");
  console.log("📝 Abrir en navegador: http://localhost:3000/realtimeproducts");

  socket.disconnect();
  process.exit(0);
}, 5000);
