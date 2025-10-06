// Middleware para logging en eventos de Socket.IO
const socketLogger = (eventName, data, socket) => {
  const timestamp = new Date().toISOString();
  const socketId = socket.id;

  console.log(
    `[${timestamp}] Socket Event: ${eventName} - Socket ID: ${socketId}`
  );
  if (data && Object.keys(data).length > 0) {
    console.log(`[${timestamp}] Data:`, JSON.stringify(data, null, 2));
  }
};

// Middleware para validación en Socket.IO
const socketValidateProduct = (productData) => {
  const { title, description, price, code, stock, category } = productData;

  if (!title || typeof title !== "string" || title.trim() === "") {
    throw new Error("El título es obligatorio y debe ser una cadena válida");
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.trim() === ""
  ) {
    throw new Error(
      "La descripción es obligatoria y debe ser una cadena válida"
    );
  }

  if (!price || typeof price !== "number" || price <= 0) {
    throw new Error("El precio es obligatorio y debe ser un número mayor a 0");
  }

  if (!code || typeof code !== "string" || code.trim() === "") {
    throw new Error("El código es obligatorio y debe ser una cadena válida");
  }

  if (stock === undefined || typeof stock !== "number" || stock < 0) {
    throw new Error(
      "El stock es obligatorio y debe ser un número mayor o igual a 0"
    );
  }

  if (!category || typeof category !== "string" || category.trim() === "") {
    throw new Error("La categoría es obligatoria y debe ser una cadena válida");
  }

  return true;
};

// Middleware para manejo de errores en Socket.IO
const socketErrorHandler = (error, socket, eventName) => {
  const timestamp = new Date().toISOString();

  console.error(`[${timestamp}] Socket Error en ${eventName}:`, error.message);

  socket.emit("error", {
    event: eventName,
    message: error.message,
    timestamp: timestamp,
  });
};

module.exports = {
  socketLogger,
  socketValidateProduct,
  socketErrorHandler,
};
