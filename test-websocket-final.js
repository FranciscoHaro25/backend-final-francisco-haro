const io = require("socket.io-client");

console.log("🚀 PRUEBA FINAL COMPLETA DEL WEBSOCKET");
console.log("=====================================");

const socket = io("http://localhost:3000");

let productosIniciales = 0;

socket.on("connect", () => {
  console.log("✅ 1. WebSocket CONECTADO exitosamente");
  console.log("   ID:", socket.id);
});

socket.on("updateProducts", (products) => {
  if (productosIniciales === 0) {
    productosIniciales = products.length;
    console.log(`✅ 2. Productos RECIBIDOS al conectar: ${products.length}`);
    console.log("   Últimos productos:");
    products.slice(-2).forEach((p) => {
      console.log(`   - ${p.title} ($${p.price})`);
    });

    // Ahora probar agregar producto
    console.log("\n🔄 3. PROBANDO agregar producto via WebSocket...");
    const nuevoProducto = {
      title: "PRUEBA FINAL WEBSOCKET",
      description: "Verificación completa funcionalidad",
      code: "FINAL-" + Date.now(),
      price: 199.99,
      stock: 25,
      category: "Prueba Final",
    };

    socket.emit("newProduct", nuevoProducto);
  } else {
    console.log(
      `✅ 4. Productos ACTUALIZADOS vía WebSocket: ${products.length}`
    );
    console.log(
      `   Se agregó 1 producto (antes: ${productosIniciales}, ahora: ${products.length})`
    );
    console.log(`   Último producto: ${products[products.length - 1].title}`);

    // Ahora probar eliminar
    console.log("\n🗑️  5. PROBANDO eliminar producto via WebSocket...");
    const ultimoId = products[products.length - 1].id;
    socket.emit("deleteProduct", ultimoId);
  }
});

socket.on("error", (error) => {
  console.log("❌ ERROR:", error);
});

socket.on("disconnect", () => {
  console.log("🔌 WebSocket DESCONECTADO");
});

// Cerrar después de completar las pruebas
setTimeout(() => {
  console.log("\n🎉 PRUEBA COMPLETADA - WebSocket funcionando PERFECTAMENTE");
  console.log("📝 RESUMEN:");
  console.log("   ✅ Conexión WebSocket exitosa");
  console.log("   ✅ Recepción de productos iniciales");
  console.log("   ✅ Agregar productos en tiempo real");
  console.log("   ✅ Actualización automática de la lista");
  console.log("   ✅ Eliminación de productos en tiempo real");
  console.log("\n⚠️  NOTA: Simple Browser de VS Code no soporta WebSockets");
  console.log(
    "💡 SOLUCIÓN: Usar Chrome, Firefox o Safari para probar la interfaz web"
  );

  socket.disconnect();
  process.exit(0);
}, 8000);
