const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const { configureSocket } = require("./src/sockets/socketEvents");
const { port } = require("./src/config/config");

// Crear servidor HTTP
const server = createServer(app);

// Configurar Socket.IO con CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Configurar eventos de websocket
configureSocket(io);

// Iniciar servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Socket.IO configurado`);
});
