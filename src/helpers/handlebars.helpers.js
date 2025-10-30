// Helpers personalizados para Handlebars
// Funciones auxiliares para mejorar la experiencia de usuario en las vistas

const handlebarsHelpers = {
  // Helper para comparaciones
  eq: function (a, b) {
    return a === b;
  },

  // Helper para verificar si un número es mayor que otro
  gt: function (a, b) {
    return a > b;
  },

  // Helper para verificar si un número es menor que otro
  lt: function (a, b) {
    return a < b;
  },

  // Helper para operación AND lógica
  and: function (a, b) {
    return a && b;
  },

  // Helper para operación OR lógica
  or: function (a, b) {
    return a || b;
  },

  // Helper para negación lógica
  not: function (a) {
    return !a;
  },

  // Helper para multiplicar dos números
  multiply: function (a, b) {
    return (a * b).toFixed(2);
  },

  // Helper para formatear precio
  formatPrice: function (price) {
    return `$${parseFloat(price).toFixed(2)}`;
  },

  // Helper para formatear fecha
  formatDate: function (date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  // Helper para truncar texto
  truncate: function (text, length = 100) {
    if (!text) return "";
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  },

  // Helper para capitalizar primera letra
  capitalize: function (text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  // Helper para crear rango de números (útil para paginación)
  range: function (start, end) {
    const result = [];

    // Si end es menor que start, intercambiar
    if (end < start) {
      [start, end] = [end, start];
    }

    // Limitar el rango para evitar páginas excesivas
    const maxPages = 10;
    if (end - start > maxPages) {
      const current = this.page || start;
      start = Math.max(1, current - Math.floor(maxPages / 2));
      end = Math.min(end, start + maxPages - 1);
    }

    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  },

  // Helper para generar URL con query params
  buildUrl: function (baseUrl, params) {
    if (!params || Object.keys(params).length === 0) {
      return baseUrl;
    }

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  },

  // Helper para generar clase CSS basada en condición
  conditionalClass: function (condition, trueClass, falseClass = "") {
    return condition ? trueClass : falseClass;
  },

  // Helper para generar badge de estado
  statusBadge: function (status, stock) {
    if (status && stock > 0) {
      return '<span class="badge bg-success">Disponible</span>';
    } else if (status && stock === 0) {
      return '<span class="badge bg-warning">Sin stock</span>';
    } else {
      return '<span class="badge bg-secondary">No disponible</span>';
    }
  },

  // Helper para generar indicador de stock
  stockIndicator: function (stock) {
    if (stock > 10) {
      return '<span class="text-success">En stock</span>';
    } else if (stock > 0) {
      return '<span class="text-warning">Pocas unidades</span>';
    } else {
      return '<span class="text-danger">Sin stock</span>';
    }
  },

  // Helper para pluralizar palabras
  pluralize: function (count, singular, plural) {
    return count === 1 ? singular : plural || singular + "s";
  },

  // Helper para generar JSON seguro para JavaScript
  json: function (context) {
    return JSON.stringify(context);
  },

  // Helper para escapar HTML
  escapeHtml: function (text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  },

  // Helper para verificar si es el primer elemento
  isFirst: function (index) {
    return index === 0;
  },

  // Helper para verificar si es el último elemento
  isLast: function (index, array) {
    return index === array.length - 1;
  },

  // Helper para generar ID único
  uniqueId: function (prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
};

module.exports = handlebarsHelpers;
