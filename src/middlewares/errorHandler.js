// Middleware para manejo centralizado de errores
const errorHandler = (err, req, res, next) => {
  console.error("Error capturado:", err.stack);

  // Error de validación
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Error de validación",
      message: err.message,
    });
  }

  // Error de producto no encontrado
  if (err.message.includes("no encontrado")) {
    return res.status(404).json({
      error: "Recurso no encontrado",
      message: err.message,
    });
  }

  // Error por defecto
  res.status(500).json({
    error: "Error interno del servidor",
    message: "Algo salió mal",
  });
};

module.exports = errorHandler;
