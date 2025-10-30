// Servidor principal - Inicialización HTTP y WebSocket
// Francisco Haro - Backend con Express y Socket.IO

const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const { configureSocket } = require("./sockets/socketEvents");
const { createRateLimit } = require("./middlewares/validation");
const { port } = require("./config/config");
const DAOFactory = require("./dao/factory.dao");

// Crear el servidor HTTP usando Express
const server = createServer(app);

// Configurar Socket.IO para WebSockets
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Aplicar protección contra spam
app.use(createRateLimit());

// Hacer que Socket.IO esté disponible en los controllers
app.set("io", io);

// Configurar los eventos de WebSocket
configureSocket(io);

// Función principal para inicializar el servidor
async function startServer() {
  try {
    await DAOFactory.initializePersistence();

    const persistenceInfo = DAOFactory.getPersistenceInfo();

    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al inicializar el servidor:", error);
    process.exit(1);
  }
}

// Iniciar el servidor
startServer();
