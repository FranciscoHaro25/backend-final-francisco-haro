// Middlewares de validación con seguridad

// Función para sanitizar strings y prevenir XSS
const sanitizeString = (input, fieldName, minLength = 1, maxLength = 500) => {
  if (typeof input !== "string") {
    throw new Error(`${fieldName} debe ser una cadena de texto`);
  }

  // Limpiar caracteres peligrosos y HTML
  const cleaned = input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<.*?>/g, "")
    .replace(/[<>'"&]/g, "")
    .substring(0, maxLength);

  if (cleaned.length < minLength) {
    throw new Error(`${fieldName} debe tener al menos ${minLength} caracteres`);
  }

  return cleaned;
};

// Función para validar números con rangos
const validateNumber = (input, fieldName, min = 0, max = 999999999) => {
  const num = Number(input);

  if (isNaN(num) || !isFinite(num)) {
    throw new Error(`${fieldName} debe ser un número válido`);
  }

  if (num < min || num > max) {
    throw new Error(`${fieldName} debe estar entre ${min} y ${max}`);
  }

  return num;
};

// Rate limiting para API HTTP
const createRateLimit = () => {
  const clients = new Map();
  const maxRequests = 30; // máximo 30 peticiones
  const windowTime = 60000; // en 1 minuto

  return (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!clients.has(clientIp)) {
      clients.set(clientIp, { count: 1, resetTime: now + windowTime });
      return next();
    }

    const client = clients.get(clientIp);

    if (now >= client.resetTime) {
      client.count = 1;
      client.resetTime = now + windowTime;
      return next();
    }

    if (client.count >= maxRequests) {
      return res.status(429).json({
        error: "Demasiadas peticiones",
        message: `Límite excedido. Intenta en ${Math.ceil(
          (client.resetTime - now) / 1000
        )} segundos`,
        retryAfter: Math.ceil((client.resetTime - now) / 1000),
      });
    }

    client.count++;
    next();
  };
};

// Middleware principal de validación de productos con seguridad
const validateProduct = (req, res, next) => {
  try {
    const { title, description, price, code, stock, category, thumbnails } =
      req.body;

    // Validar que el cuerpo no esté vacío
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Error de validación",
        message: "El cuerpo de la petición no puede estar vacío",
      });
    }

    // Sanitizar y validar título
    const cleanTitle = sanitizeString(title, "Título", 3, 100);

    // Sanitizar y validar descripción
    const cleanDescription = sanitizeString(
      description,
      "Descripción",
      10,
      500
    );

    // Validar precio
    const cleanPrice = validateNumber(price, "Precio", 0.01, 999999);

    // Validar y sanitizar código
    const cleanCode = sanitizeString(code, "Código", 2, 50);
    const codeRegex = /^[A-Za-z0-9._-]+$/;
    if (!codeRegex.test(cleanCode)) {
      return res.status(400).json({
        error: "Error de validación",
        message:
          "El código solo puede contener letras, números, puntos, guiones y guiones bajos",
      });
    }

    // Validar stock
    const cleanStock = validateNumber(stock, "Stock", 0, 999999);

    // Validar y sanitizar categoría
    const cleanCategory = sanitizeString(category, "Categoría", 2, 50);
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

    if (!allowedCategories.includes(cleanCategory.toLowerCase())) {
      return res.status(400).json({
        error: "Error de validación",
        message: `Categoría inválida. Debe ser una de: ${allowedCategories.join(
          ", "
        )}`,
      });
    }

    // Validar thumbnails (opcional)
    let cleanThumbnails = [];
    if (thumbnails) {
      if (!Array.isArray(thumbnails)) {
        return res.status(400).json({
          error: "Error de validación",
          message: "Thumbnails debe ser un array",
        });
      }

      if (thumbnails.length > 5) {
        return res.status(400).json({
          error: "Error de validación",
          message: "Máximo 5 thumbnails permitidos",
        });
      }

      try {
        cleanThumbnails = thumbnails.map((thumb, index) => {
          if (typeof thumb !== "string") {
            throw new Error(`Thumbnail ${index + 1} debe ser una URL válida`);
          }
          new URL(thumb); // Validar formato URL
          return thumb;
        });
      } catch (error) {
        return res.status(400).json({
          error: "Error de validación",
          message: error.message,
        });
      }
    }

    // Guardar datos limpios en el request
    req.body = {
      title: cleanTitle,
      description: cleanDescription,
      price: cleanPrice,
      code: cleanCode,
      stock: cleanStock,
      category: cleanCategory,
      thumbnails: cleanThumbnails,
      status: true,
    };

    next();
  } catch (error) {
    return res.status(400).json({
      error: "Error de validación",
      message: error.message,
    });
  }
};

// Middleware para validar ID de productos
const validateProductId = (req, res, next) => {
  try {
    const { pid } = req.params;
    const cleanId = validateNumber(
      pid,
      "ID del producto",
      1,
      Number.MAX_SAFE_INTEGER
    );
    req.params.pid = cleanId;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Error de validación",
      message: error.message,
    });
  }
};

// Middleware para validar datos de carritos
const validateCart = (req, res, next) => {
  try {
    const { products } = req.body;

    if (products && !Array.isArray(products)) {
      return res.status(400).json({
        error: "Error de validación",
        message: "Products debe ser un array",
      });
    }

    if (products && products.length > 100) {
      return res.status(400).json({
        error: "Error de validación",
        message: "Máximo 100 productos por carrito",
      });
    }

    if (products) {
      for (let i = 0; i < products.length; i++) {
        const product = products[i];

        if (!product.product || !product.quantity) {
          return res.status(400).json({
            error: "Error de validación",
            message: `Producto ${i + 1}: debe incluir product y quantity`,
          });
        }

        validateNumber(product.product, `Producto ${i + 1} ID`, 1);
        validateNumber(product.quantity, `Producto ${i + 1} cantidad`, 1, 999);
      }
    }

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
    const cleanId = validateNumber(
      cid,
      "ID del carrito",
      1,
      Number.MAX_SAFE_INTEGER
    );
    req.params.cid = cleanId;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Error de validación",
      message: error.message,
    });
  }
};

// Middleware para validar cantidad de productos
const validateQuantity = (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (quantity !== undefined) {
      const cleanQuantity = validateNumber(quantity, "Cantidad", 1, 999);
      req.body.quantity = cleanQuantity;
    }

    next();
  } catch (error) {
    return res.status(400).json({
      error: "Error de validación",
      message: error.message,
    });
  }
};

// Exportar middlewares
module.exports = {
  validateProduct,
  validateProductId,
  validateCart,
  validateCartId,
  validateQuantity,
  createRateLimit,
  sanitizeString,
  validateNumber,
};
