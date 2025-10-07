// Servidor principal - Inicialización HTTP y WebSocket
// Francisco Haro - Backend con Express y Socket.IO

const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const { configureSocket } = require("./sockets/socketEvents");
const { createRateLimit } = require("./middlewares/validation");
const { port } = require("./config/config");

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

// Levantar el servidor en el puerto especificado
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log("Socket.IO configurado");
});
