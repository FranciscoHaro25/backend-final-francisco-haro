// Middleware de autenticación básica
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Para desarrollo, permitir acceso sin autenticación
  if (process.env.NODE_ENV === "development") {
    return next();
  }

  if (!authHeader) {
    return res.status(401).json({
      error: "Acceso no autorizado",
      message: "Se requiere autenticación",
    });
  }

  // Verificación básica de token (en producción usar JWT)
  const token = authHeader.split(" ")[1];

  if (!token || token !== "coderhouse-token") {
    return res.status(403).json({
      error: "Token inválido",
      message: "El token proporcionado no es válido",
    });
  }

  next();
};

module.exports = auth;
