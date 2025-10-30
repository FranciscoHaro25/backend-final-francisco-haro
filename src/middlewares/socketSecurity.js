// Middlewares avanzados para Socket.IO con validaciones de seguridad
const { socketValidateProductId } = require("./idValidator");

// Sanitizar y limpiar strings de entrada
const sanitizeString = (input, fieldName) => {
  if (typeof input !== "string") {
    throw new Error(`${fieldName} debe ser una cadena de texto`);
  }

  // Limpiar caracteres peligrosos
  const cleaned = input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remover scripts
    .replace(/<.*?>/g, "") // Remover HTML tags
    .replace(/[<>'"&]/g, "") // Remover caracteres peligrosos
    .substring(0, 500); // Limitar longitud

  if (cleaned.length === 0) {
    throw new Error(
      `${fieldName} no puede estar vacío después de la sanitización`
    );
  }

  return cleaned;
};

// Validar y sanitizar números
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

// Validar formato de código (solo alfanumérico, guiones y puntos)
const validateCode = (code) => {
  const cleanCode = sanitizeString(code, "Código");
  const codeRegex = /^[A-Za-z0-9._-]+$/;

  if (!codeRegex.test(cleanCode)) {
    throw new Error(
      "El código solo puede contener letras, números, puntos, guiones y guiones bajos"
    );
  }

  if (cleanCode.length < 2 || cleanCode.length > 50) {
    throw new Error("El código debe tener entre 2 y 50 caracteres");
  }

  return cleanCode;
};

// Rate limiting para Socket.IO (prevenir spam)
const socketRateLimit = (() => {
  const clients = new Map();
  const maxRequests = 10; // máximo 10 operaciones
  const windowTime = 60000; // en 1 minuto

  return (socket, eventName) => {
    const clientId = socket.id;
    const now = Date.now();

    if (!clients.has(clientId)) {
      clients.set(clientId, { count: 1, resetTime: now + windowTime });
      return true;
    }

    const client = clients.get(clientId);

    // Resetear contador si pasó el tiempo
    if (now >= client.resetTime) {
      client.count = 1;
      client.resetTime = now + windowTime;
      return true;
    }

    // Verificar si excede el límite
    if (client.count >= maxRequests) {
      throw new Error(
        `Demasiadas operaciones. Espera ${Math.ceil(
          (client.resetTime - now) / 1000
        )} segundos`
      );
    }

    client.count++;
    return true;
  };
})();

// Middleware para logging con información de seguridad
const socketLogger = (eventName, data, socket) => {
  const timestamp = new Date().toISOString();
  const socketId = socket.id;
  const ip = socket.handshake.address;
  const userAgent = socket.handshake.headers["user-agent"] || "Unknown";

  console.log(`[${timestamp}] Socket Event: ${eventName}`);
  console.log(`[${timestamp}] Socket ID: ${socketId}`);
  console.log(`[${timestamp}] IP: ${ip}`);
  console.log(`[${timestamp}] User Agent: ${userAgent.substring(0, 100)}`);

  if (data && Object.keys(data).length > 0) {
    // Log data pero sin información sensible
    const safeData = JSON.stringify(data, null, 2).substring(0, 1000);
    console.log(`[${timestamp}] Data: ${safeData}`);
  }
};

// Validación completa y segura de productos
const socketValidateProduct = (productData, socket) => {
  // Rate limiting
  socketRateLimit(socket, "newProduct");

  if (!productData || typeof productData !== "object") {
    throw new Error(
      "Los datos del producto son requeridos y deben ser un objeto"
    );
  }

  const { title, description, price, code, stock, category, thumbnails } =
    productData;

  // Validar y sanitizar título
  const cleanTitle = sanitizeString(title, "Título");
  if (cleanTitle.length < 3 || cleanTitle.length > 100) {
    throw new Error("El título debe tener entre 3 y 100 caracteres");
  }

  // Validar y sanitizar descripción
  const cleanDescription = sanitizeString(description, "Descripción");
  if (cleanDescription.length < 10 || cleanDescription.length > 500) {
    throw new Error("La descripción debe tener entre 10 y 500 caracteres");
  }

  // Validar precio
  const cleanPrice = validateNumber(price, "Precio", 0.01, 999999);

  // Validar y sanitizar código
  const cleanCode = validateCode(code);

  // Validar stock
  const cleanStock = validateNumber(stock, "Stock", 0, 999999);

  // Validar y sanitizar categoría
  const cleanCategory = sanitizeString(category, "Categoría");
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
    throw new Error(
      `Categoría inválida. Debe ser una de: ${allowedCategories.join(", ")}`
    );
  }

  // Validar thumbnails (opcional)
  let cleanThumbnails = [];
  if (thumbnails) {
    if (!Array.isArray(thumbnails)) {
      throw new Error("Thumbnails debe ser un array");
    }

    if (thumbnails.length > 5) {
      throw new Error("Máximo 5 thumbnails permitidos");
    }

    cleanThumbnails = thumbnails.map((thumb, index) => {
      if (typeof thumb !== "string") {
        throw new Error(`Thumbnail ${index + 1} debe ser una URL válida`);
      }

      // Validar que sea una URL básica
      try {
        new URL(thumb);
        return thumb;
      } catch {
        throw new Error(`Thumbnail ${index + 1} no es una URL válida`);
      }
    });
  }

  // Retornar datos limpios y validados
  return {
    title: cleanTitle,
    description: cleanDescription,
    price: cleanPrice,
    code: cleanCode,
    stock: cleanStock,
    category: cleanCategory,
    thumbnails: cleanThumbnails,
    status: true, // Siempre true por defecto
  };
};

// Validación de ID de producto
// Ahora se usa desde idValidator.js

// Middleware para manejo de errores con información de seguridad
const socketErrorHandler = (error, socket, eventName) => {
  const timestamp = new Date().toISOString();
  const socketId = socket.id;
  const ip = socket.handshake.address;

  // Log detallado del error
  console.error(`[${timestamp}] Socket Error:`);
  console.error(`[${timestamp}] Event: ${eventName}`);
  console.error(`[${timestamp}] Socket ID: ${socketId}`);
  console.error(`[${timestamp}] IP: ${ip}`);
  console.error(`[${timestamp}] Error: ${error.message}`);

  // Respuesta segura al cliente (sin información sensible)
  socket.emit("error", {
    event: eventName,
    message: error.message,
    timestamp: timestamp,
    code: "VALIDATION_ERROR",
  });
};

// Middleware de autenticación básica (para futuras implementaciones)
const socketAuth = (socket, next) => {
  // Por ahora solo registramos la conexión
  const ip = socket.handshake.address;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] Nueva conexión desde IP: ${ip}`);

  next();
};

module.exports = {
  socketLogger,
  socketValidateProduct,
  socketValidateProductId,
  socketErrorHandler,
  socketAuth,
  socketRateLimit,
};
