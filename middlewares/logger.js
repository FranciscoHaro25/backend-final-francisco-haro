// Middleware para registrar las peticiones
function logger(req, res, next) {
  const timestamp = new Date().toLocaleString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
}

module.exports = logger;
