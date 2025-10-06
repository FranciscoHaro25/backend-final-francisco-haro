const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const { configureSocket } = require("./src/sockets/socketEvents");
const socketMiddleware = require("./src/middlewares/socketMiddleware");
const { createRateLimit } = require("./src/middlewares/validation");
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

// Aplicar rate limiting global antes de otros middlewares
app.use(createRateLimit());

// Integrar Socket.IO con Express
app.use(socketMiddleware(io));

// Configurar eventos de websocket
configureSocket(io);

// Iniciar servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Socket.IO configurado`);
});
