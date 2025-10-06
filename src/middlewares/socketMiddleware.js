// Middleware para integrar Socket.IO con Express
const socketMiddleware = (io) => {
  return (req, res, next) => {
    req.io = io;
    next();
  };
};

module.exports = socketMiddleware;
