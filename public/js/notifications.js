// Sistema de notificaciones global para toda la aplicación
// Utilizable en cualquier vista para mostrar mensajes al usuario

class NotificationSystem {
  constructor() {
    this.container = null;
    this.init();
  }

  // Inicializar el sistema de notificaciones
  init() {
    // Crear contenedor si no existe
    if (!document.getElementById("global-notification-container")) {
      const container = document.createElement("div");
      container.id = "global-notification-container";
      container.className = "position-fixed top-0 end-0 p-3";
      container.style.cssText = "z-index: 1055; margin-top: 70px;";
      document.body.appendChild(container);
    }
    this.container = document.getElementById("global-notification-container");
  }

  // Mostrar notificación con diferentes tipos
  show(message, type = "info", duration = 5000, title = null) {
    const notificationId = "notification-" + Date.now();
    const alertClass =
      {
        success: "alert-success",
        error: "alert-danger",
        warning: "alert-warning",
        info: "alert-info",
      }[type] || "alert-info";

    const iconClass =
      {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️",
      }[type] || "ℹ️";

    const notification = document.createElement("div");
    notification.id = notificationId;
    notification.className = `alert ${alertClass} alert-dismissible fade show`;
    notification.style.cssText =
      "min-width: 350px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);";

    const titleHtml = title ? `<strong>${title}</strong><br>` : "";

    notification.innerHTML = `
      <div class="d-flex align-items-start">
        <span class="me-2" style="font-size: 1.2em;">${iconClass}</span>
        <div class="flex-grow-1">
          ${titleHtml}${message}
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    this.container.appendChild(notification);

    // Auto-cerrar después del tiempo especificado
    if (duration > 0) {
      setTimeout(() => {
        if (document.getElementById(notificationId)) {
          notification.remove();
        }
      }, duration);
    }

    // Añadir evento de clic en el botón cerrar
    notification.querySelector(".btn-close").addEventListener("click", () => {
      notification.remove();
    });

    return notification;
  }

  // Métodos de conveniencia
  success(message, duration = 5000, title = "Éxito") {
    return this.show(message, "success", duration, title);
  }

  error(message, duration = 8000, title = "Error") {
    return this.show(message, "error", duration, title);
  }

  warning(message, duration = 6000, title = "Advertencia") {
    return this.show(message, "warning", duration, title);
  }

  info(message, duration = 5000, title = "Información") {
    return this.show(message, "info", duration, title);
  }

  // Mostrar errores de validación específicos
  validationError(errors, title = "Errores de validación") {
    if (Array.isArray(errors)) {
      const errorList = errors.map((err) => `• ${err}`).join("<br>");
      return this.error(errorList, 10000, title);
    } else {
      return this.error(errors, 8000, title);
    }
  }

  // Limpiar todas las notificaciones
  clear() {
    if (this.container) {
      this.container.innerHTML = "";
    }
  }
}

// Crear instancia global
window.notifications = new NotificationSystem();

// Funciones globales para compatibilidad
window.showNotification = (message, type, duration, title) => {
  return window.notifications.show(message, type, duration, title);
};

window.showSuccess = (message, duration, title) => {
  return window.notifications.success(message, duration, title);
};

window.showError = (message, duration, title) => {
  return window.notifications.error(message, duration, title);
};

window.showWarning = (message, duration, title) => {
  return window.notifications.warning(message, duration, title);
};

window.showInfo = (message, duration, title) => {
  return window.notifications.info(message, duration, title);
};

// Sistema de notificaciones global inicializado
