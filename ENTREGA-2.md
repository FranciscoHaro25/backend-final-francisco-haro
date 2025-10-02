# ENTREGA 2 - WebSockets y Tiempo Real

## Consigna Implementada

Esta entrega incorpora WebSockets para actualización en tiempo real de la lista de productos, tal como se solicitó en la consigna de Coderhouse.

## Funcionalidades Agregadas

### 1. WebSockets con Socket.IO

- Servidor WebSocket configurado en `app.js`
- Eventos implementados: `newProduct`, `deleteProduct`, `updateProducts`
- Conexión automática al cargar la página

### 2. Vista en Tiempo Real

- Ruta `/realtimeproducts` que muestra productos actualizados en vivo
- Formulario para agregar productos sin recargar página
- Botones para eliminar productos instantáneamente

### 3. Integración con Backend

- Los endpoints POST y DELETE de productos emiten eventos WebSocket
- Actualización automática de la vista cuando se modifican productos
- Logs del servidor muestran actividad WebSocket

## Rutas Disponibles

- `GET /` - Página principal con navegación
- `GET /home` - Lista estática de productos (Handlebars)
- `GET /realtimeproducts` - Lista dinámica con WebSockets
- `GET /products` - API de productos con query params
- `POST /api/products` - Crear producto (emite WebSocket)
- `DELETE /api/products/:pid` - Eliminar producto (emite WebSocket)

## Estructura de Archivos

```
entrega-1/
├── app.js              # Servidor principal con WebSockets
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── home.handlebars # Vista estática (Entrega 1)
│   └── realTimeProducts.hbs # Vista tiempo real (Entrega 2)
├── routes/
│   ├── products.js     # Rutas de productos con eventos WebSocket
│   └── carts.js        # Rutas de carritos
├── managers/
│   ├── ProductManager.js
│   └── CartManager.js
└── data/
    ├── products.json
    └── carts.json
```

## Cómo Probar WebSockets

1. Inicia el servidor: `npm run dev`
2. Ve a `http://localhost:3000/realtimeproducts`
3. Abre otra pestaña con la misma URL
4. Agrega o elimina productos en una pestaña
5. Observa cómo se actualiza automáticamente en la otra

## Eventos WebSocket

### Cliente → Servidor

- `newProduct`: Agregar nuevo producto
- `deleteProduct`: Eliminar producto por ID

### Servidor → Cliente

- `updateProducts`: Envía lista actualizada de productos
- `connect`: Confirmación de conexión
- `error`: Notificación de errores

## Diferencias con Entrega 1

- **Agregado**: Socket.IO para comunicación en tiempo real
- **Agregado**: Vista `realTimeProducts.hbs` con formulario dinámico
- **Modificado**: Rutas de productos emiten eventos WebSocket
- **Mejorado**: Logs del servidor más detallados

## Cumplimiento de Consigna

✅ Vista en `/realtimeproducts` con lista que se actualiza en tiempo real
✅ Formulario para agregar productos sin recargar página
✅ Comunicación bidireccional con WebSockets
✅ Eliminación de productos en tiempo real
✅ Integración con el backend existente de la Entrega 1
