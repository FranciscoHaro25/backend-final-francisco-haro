# 🛒 E-commerce Backend - Entrega 2

Aplicación backend desarrollada con **Node.js**, **Express** y **WebSockets** para gestión de productos en tiempo real.

## 🚀 Características

- **API REST** completa para productos y carritos
- **WebSockets** para actualizaciones en tiempo real
- **Handlebars** como motor de plantillas
- **Arquitectura modular** con controladores y DAOs
- **Persistencia** en archivos JSON
- **Bootstrap 5** para interfaz responsive

## 📦 Instalación

```bash
# Clonar repositorio
git clone <url-repositorio>

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor
npm start
```

## 🛠️ Scripts Disponibles

- `npm start` - Ejecutar en producción
- `npm run dev` - Desarrollo con hot reload

## 📁 Estructura del Proyecto

```
src/
├── controllers/     # Lógica de negocio
├── routes/         # Definición de rutas
├── dao/           # Acceso a datos
├── views/         # Plantillas Handlebars
├── sockets/       # Configuración WebSocket
└── config/        # Variables de entorno
```

## 🌐 Endpoints

### Productos

- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Carritos

- `POST /api/carts` - Crear carrito
- `GET /api/carts/:id` - Obtener carrito
- `POST /api/carts/:cid/product/:pid` - Agregar producto

### Vistas

- `/` - Página principal
- `/realtimeproducts` - Gestión en tiempo real

## 🔧 Tecnologías

- **Node.js** v18+
- **Express.js** 5.x
- **Socket.IO** 4.x
- **Handlebars** 8.x
- **Bootstrap** 5.x

## 👨‍💻 Autor

**Francisco Haro** - Estudiante Coderhouse Backend

---

> Proyecto desarrollado para la **Entrega 2** del curso de Backend en Coderhouse
