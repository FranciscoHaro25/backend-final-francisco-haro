// Middleware básico de autenticación
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token || token !== "Bearer secret123") {
    return res.status(401).json({
      error: "No autorizado",
      message: "Se requiere token de autorización",
    });
  }

  next();
}

module.exports = auth;
