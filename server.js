const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const { configureSocket } = require("./src/sockets/socketEvents");
const { port } = require("./src/config/config");

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

configureSocket(io);

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Socket.IO configurado`);
});
