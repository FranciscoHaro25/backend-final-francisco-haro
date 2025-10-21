// Validador de IDs universal - compatible con FileSystem y MongoDB
const mongoose = require("mongoose");

// Función para validar IDs según el tipo de persistencia
const validateId = (id, fieldName = "ID") => {
  const persistenceType = process.env.PERSISTENCE || "MONGODB";

  if (persistenceType.toUpperCase() === "MONGODB") {
    // Validar ObjectId de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`${fieldName} de MongoDB inválido`);
    }
    return id;
  } else {
    // Validar ID numérico para FileSystem
    const numericId = Number(id);
    if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
      throw new Error(`${fieldName} debe ser un número entero positivo`);
    }
    return numericId;
  }
};

// Middleware para validar ID de productos
const validateProductId = (req, res, next) => {
  try {
    const { pid } = req.params;

    if (!pid) {
      return res.status(400).json({
        error: "Error de validación",
        message: "ID de producto es requerido",
      });
    }

    const validatedId = validateId(pid, "ID del producto");
    req.params.pid = validatedId;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Error de validación",
      message: error.message,
    });
  }
};

// Middleware para validar ID de carritos
const validateCartId = (req, res, next) => {
  try {
    const { cid } = req.params;

    if (!cid) {
      return res.status(400).json({
        error: "Error de validación",
        message: "ID de carrito es requerido",
      });
    }

    const validatedId = validateId(cid, "ID del carrito");
    req.params.cid = validatedId;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Error de validación",
      message: error.message,
    });
  }
};

// Función para validar IDs en sockets
const socketValidateProductId = (productId, socket) => {
  try {
    if (!productId) {
      throw new Error("ID de producto es requerido");
    }

    return validateId(productId, "ID del producto");
  } catch (error) {
    throw error;
  }
};

// Validar parámetros de consulta para paginación
const validateQueryParams = (req, res, next) => {
  try {
    const { page, limit, sort, category, status } = req.query;

    // Validar página
    if (page !== undefined) {
      const pageNum = parseInt(page);
      if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({
          error: "Error de validación",
          message: "El parámetro 'page' debe ser un número entero mayor a 0",
        });
      }
      req.query.page = pageNum;
    }

    // Validar límite
    if (limit !== undefined) {
      const limitNum = parseInt(limit);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        return res.status(400).json({
          error: "Error de validación",
          message: "El parámetro 'limit' debe ser un número entre 1 y 100",
        });
      }
      req.query.limit = limitNum;
    }

    // Validar ordenamiento
    if (sort !== undefined) {
      if (!["asc", "desc"].includes(sort.toLowerCase())) {
        return res.status(400).json({
          error: "Error de validación",
          message: "El parámetro 'sort' debe ser 'asc' o 'desc'",
        });
      }
      req.query.sort = sort.toLowerCase();
    }

    // Validar categoría
    if (category !== undefined) {
      const allowedCategories = [
        "electronica",
        "ropa",
        "hogar",
        "deportes",
        "libros",
        "juguetes",
        "belleza",
        "automotriz",
        "jardin",
        "mascotas",
      ];

      if (!allowedCategories.includes(category.toLowerCase())) {
        return res.status(400).json({
          error: "Error de validación",
          message: `Categoría inválida. Debe ser una de: ${allowedCategories.join(
            ", "
          )}`,
        });
      }
      req.query.category = category.toLowerCase();
    }

    // Validar status
    if (status !== undefined) {
      if (!["true", "false"].includes(status.toLowerCase())) {
        return res.status(400).json({
          error: "Error de validación",
          message: "El parámetro 'status' debe ser 'true' o 'false'",
        });
      }
      req.query.status = status.toLowerCase() === "true";
    }

    next();
  } catch (error) {
    return res.status(400).json({
      error: "Error de validación",
      message: error.message,
    });
  }
};

module.exports = {
  validateId,
  validateProductId,
  validateCartId,
  socketValidateProductId,
  validateQueryParams,
};
