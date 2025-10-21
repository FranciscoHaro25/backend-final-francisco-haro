// Script para manejar WebSockets en tiempo real

const socket = io();

// Referencias DOM
const connectionStatus = document.getElementById("connectionStatus");
const productForm = document.getElementById("productForm");
const productsList = document.getElementById("productsList");
const noProducts = document.getElementById("noProducts");
const notificationContainer = document.getElementById("notificationContainer");

// Sistema de notificaciones
const showNotification = (message, type = "info", duration = 5000) => {
  const notificationId = "notification-" + Date.now();
  const alertClass = {
    success: "alert-success",
    error: "alert-danger",
    warning: "alert-warning",
    info: "alert-info",
  }[type];

  const notification = document.createElement("div");
  notification.id = notificationId;
  notification.className = `alert ${alertClass} alert-dismissible fade show`;
  notification.style.minWidth = "300px";
  notification.innerHTML = `
    <strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong> ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  notificationContainer.appendChild(notification);

  // Auto-cerrar después del tiempo especificado
  if (duration > 0) {
    setTimeout(() => {
      if (document.getElementById(notificationId)) {
        notification.remove();
      }
    }, duration);
  }

  return notification;
};

// Validación de formulario en tiempo real
const validateField = (field, showFeedback = true) => {
  const value = field.value.trim();
  const fieldName = field.id;
  let isValid = true;
  let errorMessage = "";

  // Limpiar estilos anteriores
  field.classList.remove("is-valid", "is-invalid");

  switch (fieldName) {
    case "title":
      if (value.length < 3) {
        isValid = false;
        errorMessage = "El título debe tener al menos 3 caracteres";
      } else if (value.length > 100) {
        isValid = false;
        errorMessage = "El título no puede tener más de 100 caracteres";
      }
      break;

    case "description":
      if (value.length < 10) {
        isValid = false;
        errorMessage = "La descripción debe tener al menos 10 caracteres";
      } else if (value.length > 500) {
        isValid = false;
        errorMessage = "La descripción no puede tener más de 500 caracteres";
      }
      break;

    case "code":
      const codeRegex = /^[A-Za-z0-9._-]+$/;
      if (value.length < 2) {
        isValid = false;
        errorMessage = "El código debe tener al menos 2 caracteres";
      } else if (value.length > 50) {
        isValid = false;
        errorMessage = "El código no puede tener más de 50 caracteres";
      } else if (!codeRegex.test(value)) {
        isValid = false;
        errorMessage =
          "El código solo puede contener letras, números, puntos, guiones y guiones bajos";
      }
      break;

    case "price":
      const price = parseFloat(value);
      if (isNaN(price) || price <= 0) {
        isValid = false;
        errorMessage = "El precio debe ser mayor a 0";
      } else if (price > 999999) {
        isValid = false;
        errorMessage = "El precio no puede ser mayor a 999,999";
      }
      break;

    case "stock":
      const stock = parseInt(value);
      if (isNaN(stock) || stock < 0) {
        isValid = false;
        errorMessage = "El stock debe ser un número entero no negativo";
      } else if (stock > 999999) {
        isValid = false;
        errorMessage = "El stock no puede ser mayor a 999,999";
      }
      break;

    case "category":
      if (!value) {
        isValid = false;
        errorMessage = "Debes seleccionar una categoría";
      }
      break;
  }

  // Mostrar feedback visual si está habilitado
  if (showFeedback) {
    if (isValid) {
      field.classList.add("is-valid");
    } else {
      field.classList.add("is-invalid");
      const feedback = field.parentNode.querySelector(".invalid-feedback");
      if (feedback) {
        feedback.textContent = errorMessage;
      }
    }
  }

  return { isValid, errorMessage };
};

// Eventos de conexión
socket.on("connect", () => {
  console.log("Conectado al servidor WebSocket");
  connectionStatus.className = "alert alert-success";
  connectionStatus.textContent = "Conectado - WebSocket activo";
  showNotification("Conectado exitosamente al servidor", "success", 3000);
});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor");
  connectionStatus.className = "alert alert-danger";
  connectionStatus.textContent = "Desconectado - Reintentando conexión...";
  showNotification("Conexión perdida. Reintentando...", "warning", 0);
});

socket.on("connect_error", (error) => {
  console.error("Error de conexión:", error);
  connectionStatus.className = "alert alert-danger";
  connectionStatus.textContent = "Error de conexión WebSocket";
  showNotification("Error de conexión con el servidor", "error");
});

// Eventos del servidor

// Actualizar cuando cambian los productos
socket.on("updateProducts", (products) => {
  console.log("Productos actualizados:", products);
  renderProducts(products);
});

// Mostrar errores con el nuevo sistema de notificaciones
socket.on("error", (error) => {
  console.error("Error del servidor:", error);
  showNotification(error.message || "Error en el servidor", "error", 7000);
});

// Eventos de éxito
socket.on("productAdded", (product) => {
  showNotification(
    `Producto "${product.title}" agregado exitosamente`,
    "success"
  );
});

socket.on("productDeleted", (product) => {
  showNotification(`Producto eliminado exitosamente`, "success");
});

// Manejo del formulario

// Agregar validación en tiempo real a los campos
["title", "description", "code", "price", "stock", "category"].forEach(
  (fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      // Validar mientras el usuario escribe (con debounce)
      let timeoutId;
      field.addEventListener("input", () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (field.value.trim()) {
            validateField(field);
          } else {
            field.classList.remove("is-valid", "is-invalid");
          }
        }, 500);
      });

      // Validar cuando el campo pierde el foco
      field.addEventListener("blur", () => {
        if (field.value.trim()) {
          validateField(field);
        }
      });
    }
  }
);

// Enviar nuevo producto
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validar todos los campos
  const fields = ["title", "description", "code", "price", "stock", "category"];
  let isFormValid = true;
  const errors = [];

  fields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    const validation = validateField(field, true);
    if (!validation.isValid) {
      isFormValid = false;
      errors.push(`${fieldId}: ${validation.errorMessage}`);
    }
  });

  if (!isFormValid) {
    showNotification(
      `Errores en el formulario:<br>• ${errors.join("<br>• ")}`,
      "error",
      10000
    );
    return;
  }

  const productData = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    code: document.getElementById("code").value.trim(),
    price: parseFloat(document.getElementById("price").value),
    stock: parseInt(document.getElementById("stock").value),
    category: document.getElementById("category").value,
  };

  console.log("Enviando producto:", productData);
  showNotification("Enviando producto...", "info", 3000);

  socket.emit("newProduct", productData);

  // Limpiar formulario y estilos de validación
  productForm.reset();
  fields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    field.classList.remove("is-valid", "is-invalid");
  });
});

// Eliminar producto
function deleteProduct(productId) {
  // Crear una modal de confirmación personalizada
  const modalHtml = `
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar eliminación</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ¿Estás seguro de que quieres eliminar este producto?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" id="confirmDelete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Agregar modal al DOM temporalmente
  document.body.insertAdjacentHTML("beforeend", modalHtml);
  const modal = new bootstrap.Modal(document.getElementById("deleteModal"));

  // Manejar confirmación
  document.getElementById("confirmDelete").addEventListener("click", () => {
    console.log("Eliminando producto:", productId);
    showNotification("Eliminando producto...", "info", 3000);
    socket.emit("deleteProduct", productId);
    modal.hide();
  });

  // Limpiar modal del DOM cuando se cierre
  document
    .getElementById("deleteModal")
    .addEventListener("hidden.bs.modal", () => {
      document.getElementById("deleteModal").remove();
    });

  modal.show();
}

// Renderizar productos en la vista
function renderProducts(products) {
  if (products.length === 0) {
    productsList.innerHTML = "";
    noProducts.style.display = "block";
    return;
  }

  noProducts.style.display = "none";

  productsList.innerHTML = products
    .map(
      (product) => `
    <div class="col-md-4 mb-4" data-product-id="${product.id}">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${escapeHtml(product.title)}</h5>
          <p class="card-text">${escapeHtml(product.description)}</p>
          <p class="text-muted">Código: ${escapeHtml(product.code)}</p>
          <h6 class="text-success">$${product.price}</h6>
          <p class="small">Stock: ${product.stock} | Categoría: ${escapeHtml(
        product.category
      )}</p>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${
            product.id
          })">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// Función para escapar HTML y prevenir XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Hacer función global para los botones
window.deleteProduct = deleteProduct;

console.log("Cliente WebSocket inicializado");
