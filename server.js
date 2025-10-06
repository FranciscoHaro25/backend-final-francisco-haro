/**
 * Servidor principal de la aplicación
 * Integra Express + Socket.IO para funcionalidad en tiempo real
 *
 * @author Francisco Haro
 * @version 1.0.0
 */

const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const { configureSocket } = require("./src/sockets/socketEvents");
const { port } = require("./src/config/config");

// Crear servidor HTTP base
const server = createServer(app);

// Configurar Socket.IO con CORS habilitado
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Configurar eventos de Socket.IO
configureSocket(io);

// Iniciar el servidor
server.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📡 Socket.IO configurado para tiempo real`);
});
