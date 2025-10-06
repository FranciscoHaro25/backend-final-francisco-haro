// Script para manejar WebSockets en tiempo real
// Francisco Haro - Entrega 2

const socket = io();

// Referencias DOM
const connectionStatus = document.getElementById("connectionStatus");
const productForm = document.getElementById("productForm");
const productsList = document.getElementById("productsList");
const noProducts = document.getElementById("noProducts");

// Eventos de conexión
socket.on("connect", () => {
  console.log("Conectado al servidor WebSocket");
  connectionStatus.className = "alert alert-success";
  connectionStatus.textContent = "Conectado - WebSocket activo";
});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor");
  connectionStatus.className = "alert alert-danger";
  connectionStatus.textContent = "Desconectado - Reintentando conexión...";
});

socket.on("connect_error", (error) => {
  console.error("Error de conexión:", error);
  connectionStatus.className = "alert alert-danger";
  connectionStatus.textContent = "Error de conexión WebSocket";
});

// Eventos del servidor

// Actualizar cuando cambian los productos
socket.on("updateProducts", (products) => {
  console.log("Productos actualizados:", products);
  renderProducts(products);
});

// Mostrar errores
socket.on("error", (error) => {
  console.error("Error del servidor:", error);
  alert("Error: " + error.message);
});

// Manejo del formulario

// Enviar nuevo producto
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const productData = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    code: document.getElementById("code").value.trim(),
    price: parseFloat(document.getElementById("price").value),
    stock: parseInt(document.getElementById("stock").value),
    category: document.getElementById("category").value.trim(),
  };

  // Validaciones básicas
  if (!productData.title || !productData.description || !productData.code) {
    alert("Por favor completa todos los campos");
    return;
  }

  if (productData.price <= 0 || productData.stock < 0) {
    alert("El precio debe ser mayor a 0 y el stock no puede ser negativo");
    return;
  }

  console.log("Enviando producto:", productData);
  socket.emit("newProduct", productData);

  // Limpiar formulario
  productForm.reset();
});

// Eliminar producto
function deleteProduct(productId) {
  if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
    console.log("Eliminando producto:", productId);
    socket.emit("deleteProduct", productId);
  }
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
