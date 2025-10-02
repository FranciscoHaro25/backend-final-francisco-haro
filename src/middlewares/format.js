// Middleware para formateo de fechas y responses
const format = {
  // Formatear fecha a formato legible
  formatDate: (date) => {
    return new Date(date).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  },

  // Middleware para añadir timestamp a responses
  addTimestamp: (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
      try {
        let responseData = typeof data === "string" ? JSON.parse(data) : data;

        if (typeof responseData === "object" && responseData !== null) {
          responseData.timestamp = format.formatDate(new Date());
          responseData.requestId =
            req.headers["x-request-id"] ||
            Math.random().toString(36).substr(2, 9);
        }

        originalSend.call(this, JSON.stringify(responseData));
      } catch (error) {
        originalSend.call(this, data);
      }
    };

    next();
  },

  // Formatear precios a moneda
  formatPrice: (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  },
};

module.exports = format;
