// Middleware para logging de requests
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  // Log del body si existe (solo para POST/PUT)
  if (
    (method === "POST" || method === "PUT") &&
    req.body &&
    Object.keys(req.body).length > 0
  ) {
    console.log(`[${timestamp}] Body:`, JSON.stringify(req.body, null, 2));
  }

  next();
};

module.exports = logger;
