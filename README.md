# Tienda Virtual Backend - Proyecto Final

Sistema de e-commerce backend desarrollado con Node.js, Express, MongoDB y WebSockets. Maneja productos, carritos de compra y procesos de compra con actualizaciones en tiempo real.

## Funcionalidades principales

Esta aplicación permite gestionar una tienda online completa. Los usuarios pueden navegar productos con filtros avanzados, agregar items a su carrito y realizar compras. El sistema actualiza stock y estados en tiempo real usando WebSockets.

## Instalación

Requisitos: Node.js y acceso a MongoDB Atlas.

```bash
# Clonar repositorio
git clone https://github.com/FranciscoHaro25/backend-final-francisco-haro.git

# Instalar dependencias
cd backend-final-francisco-haro
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MongoDB

# Iniciar servidor
npm start
```

Acceder en: `http://localhost:3000`

## Scripts disponibles

- `npm start` - Servidor de producción
- `npm run dev` - Desarrollo con auto-reload
- `npm run seed` - Poblar base de datos con productos de ejemplo

## Arquitectura del proyecto

```
src/
├── controllers/     # Controladores de rutas
├── services/       # Lógica de negocio
├── routes/         # Definición de endpoints
├── dao/           # Capa de acceso a datos (MongoDB/FileSystem)
├── models/        # Esquemas de MongoDB con Mongoose
├── views/         # Templates Handlebars
├── sockets/       # Configuración WebSocket
├── middlewares/   # Validaciones y logging
└── config/        # Configuración de base de datos
```

## API Endpoints

### Productos

- `GET /api/products` - Lista productos con paginación y filtros
- `GET /api/products/:pid` - Obtener producto específico
- `POST /api/products` - Crear producto
- `PUT /api/products/:pid` - Actualizar producto
- `DELETE /api/products/:pid` - Eliminar producto

### Carritos

- `POST /api/carts` - Crear carrito
- `GET /api/carts/:cid` - Obtener carrito con productos
- `POST /api/carts/:cid/product/:pid` - Agregar producto
- `PUT /api/carts/:cid/products/:pid` - Actualizar cantidad
- `DELETE /api/carts/:cid/products/:pid` - Quitar producto
- `DELETE /api/carts/:cid` - Vaciar carrito
- `POST /api/carts/:cid/purchase` - Procesar compra

### Vistas

- `/` - Catálogo con paginación y filtros
- `/carts/:cid` - Vista detallada del carrito
- `/realtimeproducts` - Panel de administración

## Tecnologías implementadas

- **Node.js & Express** - Servidor web
- **MongoDB & Mongoose** - Base de datos con ODM
- **Socket.IO** - Comunicación en tiempo real
- **Handlebars** - Motor de plantillas
- **Bootstrap** - Framework CSS
- **Mongoose Paginate** - Paginación avanzada

## Características técnicas

### Persistencia MongoDB

- Modelos con validaciones y middlewares
- Referencias entre documentos con populate
- Índices para optimización de consultas
- Paginación nativa con mongoose-paginate-v2

### WebSockets en tiempo real

- Sincronización automática de stock después de compras
- Actualizaciones de carrito entre sesiones
- Notificaciones instantáneas de cambios

### Sistema de filtros

- Búsqueda por texto, categoría y disponibilidad
- Ordenamiento por precio (ascendente/descendente)
- Paginación con navegación completa
- URLs amigables con parámetros de query

## Autor

Francisco Haro  
Curso Backend I - Coderhouse 2025
