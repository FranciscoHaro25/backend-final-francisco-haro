// Gestión del icono del carrito en navbar
var cartUpdateInterval = null;
var isUpdating = false;
var lastCartData = null;

function irAlCarrito() {
  var cartId = localStorage.getItem("currentCartId");
  if (cartId) {
    window.location.href = "/carts/" + cartId;
  } else {
    if (window.notifications) {
      window.notifications.warning("No tienes un carrito activo");
    } else {
      alert("No tienes un carrito activo");
    }
  }
}

function actualizarIconoCarrito() {
  if (isUpdating) return;

  var cartId = localStorage.getItem("currentCartId");
  var cartIcon = document.getElementById("cartIcon");
  var cartBadge = document.getElementById("cartBadge");

  if (cartId) {
    isUpdating = true;

    fetch("/api/carts/" + cartId)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        var dataStr = JSON.stringify(data);
        if (lastCartData === dataStr) {
          isUpdating = false;
          return;
        }
        lastCartData = dataStr;

        if (data.error) {
          localStorage.removeItem("currentCartId");
          cartIcon.style.display = "none";
          stopCartPolling();
        } else {
          cartIcon.style.display = "block";

          if (data.products && data.products.length > 0) {
            var totalItems = data.products.reduce(function (total, item) {
              return total + item.quantity;
            }, 0);
            cartBadge.style.display = "block";
            cartBadge.textContent = totalItems;
          } else {
            cartBadge.style.display = "none";
          }
        }
      })
      .catch(function (error) {
        console.error("Error al obtener carrito:", error);
        cartIcon.style.display = "none";
      })
      .finally(function () {
        isUpdating = false;
      });
  } else {
    cartIcon.style.display = "none";
    stopCartPolling();
  }
}

function startCartPolling() {
  stopCartPolling();
  cartUpdateInterval = setInterval(actualizarIconoCarrito, 30000);
}

function stopCartPolling() {
  if (cartUpdateInterval) {
    clearInterval(cartUpdateInterval);
    cartUpdateInterval = null;
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  actualizarIconoCarrito();
  startCartPolling();
});

window.addEventListener("beforeunload", function () {
  stopCartPolling();
});

// API pública
window.actualizarCarrito = actualizarIconoCarrito;
window.startCartPolling = startCartPolling;
window.stopCartPolling = stopCartPolling;
