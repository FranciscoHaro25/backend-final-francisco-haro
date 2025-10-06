// Middleware para validar datos de productos
const validateProduct = (req, res, next) => {
  const { title, description, price, code, stock, category } = req.body;

  // Validaciones básicas
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      error: "Error de validación",
      message: "El título es obligatorio y debe ser una cadena válida",
    });
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.trim() === ""
  ) {
    return res.status(400).json({
      error: "Error de validación",
      message: "La descripción es obligatoria y debe ser una cadena válida",
    });
  }

  if (!price || typeof price !== "number" || price <= 0) {
    return res.status(400).json({
      error: "Error de validación",
      message: "El precio es obligatorio y debe ser un número mayor a 0",
    });
  }

  if (!code || typeof code !== "string" || code.trim() === "") {
    return res.status(400).json({
      error: "Error de validación",
      message: "El código es obligatorio y debe ser una cadena válida",
    });
  }

  if (!stock || typeof stock !== "number" || stock < 0) {
    return res.status(400).json({
      error: "Error de validación",
      message: "El stock es obligatorio y debe ser un número mayor o igual a 0",
    });
  }

  if (!category || typeof category !== "string" || category.trim() === "") {
    return res.status(400).json({
      error: "Error de validación",
      message: "La categoría es obligatoria y debe ser una cadena válida",
    });
  }

  next();
};

// Middleware para validar ID de productos
const validateProductId = (req, res, next) => {
  const { pid } = req.params;

  if (!pid || isNaN(parseInt(pid))) {
    return res.status(400).json({
      error: "Error de validación",
      message: "El ID del producto debe ser un número válido",
    });
  }

  next();
};

// Middleware para validar ID de carritos
const validateCartId = (req, res, next) => {
  const { cid } = req.params;

  if (!cid || isNaN(parseInt(cid))) {
    return res.status(400).json({
      error: "Error de validación",
      message: "El ID del carrito debe ser un número válido",
    });
  }

  next();
};

module.exports = {
  validateProduct,
  validateProductId,
  validateCartId,
};
