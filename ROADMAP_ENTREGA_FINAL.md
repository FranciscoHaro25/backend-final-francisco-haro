889# 🗺️ ROADMAP - Entrega Final Backend I

## 📋 Resumen de Requerimientos

La entrega final requiere migrar de persistencia JSON a **MongoDB** y agregar funcionalidades avanzadas de paginación, filtros, ordenamiento y gestión completa de carritos.

---

## 🎯 Fase 1: Configuración MongoDB y Modelos

### 1.1 Instalación y Configuración

- [ ] Instalar dependencias: `mongoose`, `dotenv` (actualizar)
- [ ] Configurar conexión a MongoDB Atlas/Local
- [ ] Crear archivo de configuración de base de datos
- [ ] Variables de entorno para conexión

### 1.2 Modelos Mongoose

- [ ] **Modelo Product**: Schema con validaciones
- [ ] **Modelo Cart**: Schema con referencia a productos (populate)
- [ ] Validaciones a nivel de schema
- [ ] Índices para optimizar consultas

**Archivos a crear/modificar:**

- `src/config/database.js`
- `src/models/product.model.js`
- `src/models/cart.model.js`
- `src/dao/mongodb/product.dao.js`
- `src/dao/mongodb/cart.dao.js`

---

## 🎯 Fase 2: Migración de Persistencia

### 2.1 DAO MongoDB

- [ ] Crear ProductDAO con MongoDB
- [ ] Crear CartDAO con MongoDB
- [ ] Implementar patrón Factory para seleccionar persistencia
- [ ] Mantener compatibilidad con FileSystem (opcional)

### 2.2 Actualizar Services

- [ ] Modificar ProductService para nuevos métodos
- [ ] Modificar CartService para populate y nuevos endpoints
- [ ] Mantener la misma API pública

**Archivos a modificar:**

- `src/services/product.service.js`
- `src/services/cart.service.js`
- `src/dao/factory.dao.js` (nuevo)

---

## 🎯 Fase 3: Endpoints Avanzados de Productos

### 3.1 GET /api/products Profesional

- [ ] **Paginación**: `?page=1&limit=10`
- [ ] **Filtros**: `?query=categoria:electronica` o `?query=disponible:true`
- [ ] **Ordenamiento**: `?sort=asc` o `?sort=desc` (por precio)
- [ ] **Respuesta estructurada**:

```json
{
  "status": "success/error",
  "payload": [...productos],
  "totalPages": 5,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "/api/products?page=1",
  "nextLink": "/api/products?page=3"
}
```

**Archivos a modificar:**

- `src/controllers/product.controller.js`
- `src/services/product.service.js`
- `src/dao/mongodb/product.dao.js`

---

## 🎯 Fase 4: Endpoints Avanzados de Carritos

### 4.1 Nuevos Endpoints Requeridos

- [ ] `DELETE /api/carts/:cid/products/:pid` - Eliminar producto específico
- [ ] `PUT /api/carts/:cid` - Actualizar carrito completo con array
- [ ] `PUT /api/carts/:cid/products/:pid` - Actualizar cantidad específica
- [ ] `DELETE /api/carts/:cid` - Vaciar carrito completo

### 4.2 Populate de Productos

- [ ] Modificar `GET /api/carts/:cid` para traer productos completos
- [ ] Implementar populate en CartDAO
- [ ] Optimizar consultas con select de campos necesarios

**Archivos a modificar:**

- `src/routes/carts.routes.js`
- `src/controllers/cart.controller.js`
- `src/services/cart.service.js`
- `src/dao/mongodb/cart.dao.js`

---

## 🎯 Fase 5: Vistas Actualizadas

### 5.1 Vista Principal con Paginación

- [ ] Modificar `/products` para mostrar paginación
- [ ] Agregar controles de navegación (anterior/siguiente)
- [ ] Filtros en la interfaz (categoría, disponibilidad)
- [ ] Ordenamiento por precio
- [ ] Botón "Agregar al carrito" en cada producto

### 5.2 Vista Detalle de Producto

- [ ] Nueva ruta `/products/:pid`
- [ ] Vista completa con todos los detalles
- [ ] Botón para agregar al carrito
- [ ] Breadcrumb de navegación

### 5.3 Vista de Carrito

- [ ] Nueva ruta `/carts/:cid`
- [ ] Mostrar productos del carrito con populate
- [ ] Controles para modificar cantidades
- [ ] Botón eliminar productos
- [ ] Total del carrito

**Archivos a crear/modificar:**

- `src/views/products.handlebars` (mejorar existente home.handlebars)
- `src/views/productDetail.handlebars` (nuevo)
- `src/views/cart.handlebars` (nuevo)
- `src/controllers/view.controller.js`
- `src/routes/views.routes.js`

---

## 🎯 Fase 6: Validaciones y Middlewares

### 6.1 Actualizar Validaciones

- [ ] Validar parámetros de paginación
- [ ] Validar filtros y queries
- [ ] Validar ObjectIDs de MongoDB
- [ ] Mantener validaciones de seguridad existentes

### 6.2 Manejo de Errores

- [ ] Errores específicos de MongoDB
- [ ] Respuestas consistentes con nuevo formato
- [ ] Logging mejorado

**Archivos a modificar:**

- `src/middlewares/validation.js`
- `src/middlewares/errorHandler.js`

---

## 🎯 Fase 7: Frontend Mejorado

### 7.1 JavaScript para Nuevas Funcionalidades

- [ ] Paginación interactiva
- [ ] Filtros dinámicos
- [ ] Agregar al carrito (AJAX)
- [ ] Actualizar cantidades en carrito
- [ ] Notificaciones para operaciones de carrito

### 7.2 Estilos y UX

- [ ] Mejorar interfaz de paginación
- [ ] Loading states
- [ ] Confirmaciones de acciones
- [ ] Responsive design

**Archivos a crear/modificar:**

- `public/js/products.js` (nuevo)
- `public/js/productDetail.js` (nuevo)
- `public/js/cart.js` (nuevo)
- `public/css/styles.css` (nuevo, opcional)

---

## 🎯 Fase 8: Testing y Documentación

### 8.1 Testing

- [ ] Probar todos los endpoints nuevos con Postman
- [ ] Verificar paginación con diferentes parámetros
- [ ] Validar populate de productos en carritos
- [ ] Test de validaciones y errores

### 8.2 Documentación

- [ ] Actualizar README.md con nuevas funcionalidades
- [ ] Documentar variables de entorno
- [ ] Guía de uso de la API actualizada
- [ ] Capturas de pantalla de nuevas vistas

---

## 📦 Estructura Final Esperada

```
src/
├── config/
│   ├── config.js
│   └── database.js          (nuevo)
├── models/
│   ├── product.model.js     (nuevo)
│   └── cart.model.js        (nuevo)
├── dao/
│   ├── factory.dao.js       (nuevo)
│   ├── filesystem/          (mantener existente)
│   │   ├── product.manager.js
│   │   └── cart.manager.js
│   └── mongodb/             (nuevo)
│       ├── product.dao.js
│       └── cart.dao.js
├── controllers/             (actualizar)
├── services/                (actualizar)
├── routes/                  (actualizar)
├── views/                   (agregar nuevas)
├── middlewares/             (actualizar)
└── sockets/                 (mantener)
```

---

## 🚀 Orden de Implementación Recomendado

1. **Configurar MongoDB** (Fase 1)
2. **Crear modelos y DAOs** (Fase 2)
3. **Migrar productos** (Fase 3)
4. **Migrar carritos** (Fase 4)
5. **Actualizar vistas** (Fase 5)
6. **Ajustar validaciones** (Fase 6)
7. **Frontend y UX** (Fase 7)
8. **Testing final** (Fase 8)

---

## ⚠️ Consideraciones Importantes

- **No cambiar la lógica de negocio** existente, solo la persistencia
- **Mantener la funcionalidad WebSocket** actual
- **Backward compatibility** durante la migración
- **Variables de entorno** para configuración
- **Validaciones robustas** para nuevos parámetros
- **Manejo de errores** específico para MongoDB

---

## 🎯 Resultado Final

Al completar este roadmap tendrás:
✅ Sistema completo con MongoDB  
✅ API profesional con paginación y filtros  
✅ Gestión avanzada de carritos  
✅ Interfaz moderna y funcional  
✅ Código mantenible y escalable

¿Te parece bien este roadmap? ¿Por cuál fase quieres empezar?
