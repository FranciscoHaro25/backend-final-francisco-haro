// Servidor principal - Francisco Haro
// Entrega 2: WebSockets + Express

const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const { configureSocket } = require("./src/sockets/socketEvents");
const { port } = require("./src/config/config");

// Servidor HTTP
const server = createServer(app);

// Socket.IO config
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],

// Configurar eventos de Socket.IO
configureSocket(io);

// Iniciar el servidor
server.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📡 Socket.IO configurado para tiempo real`);
});
