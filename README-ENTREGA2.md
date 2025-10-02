# ENTREGA 2 - WebSockets y Tiempo Real 🚀

## 📋 Consigna Implementada

✅ **Handlebars configurado** como motor de plantillas  
✅ **Socket.IO** para WebSockets en tiempo real  
✅ **Vista `home.handlebars`** con lista estática de productos  
✅ **Vista `realTimeProducts.handlebars`** con actualizaciones en tiempo real  
✅ **Arquitectura modular** (routes, managers, views, public/js)  
✅ **Bootstrap 5** para interfaz responsive

## 🏗️ Estructura del Proyecto

```
entrega-1/
├── app.js                      # Servidor principal con Socket.IO
├── routes/
│   ├── products.js            # Rutas API con eventos WebSocket
│   └── carts.js              # Rutas de carritos
├── managers/
│   ├── ProductManager.js     # Lógica de negocio
│   └── CartManager.js        # Gestión de carritos
├── views/
│   ├── layouts/
│   │   └── main.handlebars   # Layout principal
│   ├── home.handlebars       # Vista estática
│   └── realTimeProducts.handlebars # Vista tiempo real
├── public/
│   └── js/
│       └── realtime.js       # Cliente WebSocket
└── data/
    ├── products.json         # Persistencia productos
    └── carts.json           # Persistencia carritos
```

## 🚦 Rutas Disponibles

| Método   | Ruta                | Descripción                          |
| -------- | ------------------- | ------------------------------------ |
| `GET`    | `/`                 | Vista home con productos estáticos   |
| `GET`    | `/realtimeproducts` | Vista tiempo real con WebSockets     |
| `GET`    | `/api/products`     | Lista productos (API REST)           |
| `POST`   | `/api/products`     | Crear producto + emit WebSocket      |
| `PUT`    | `/api/products/:id` | Actualizar producto + emit WebSocket |
| `DELETE` | `/api/products/:id` | Eliminar producto + emit WebSocket   |

## ⚡ Funcionalidades WebSocket

### Eventos Cliente → Servidor

- `newProduct`: Agregar producto desde formulario
- `deleteProduct`: Eliminar producto por ID

### Eventos Servidor → Cliente

- `updateProducts`: Lista actualizada de productos
- `connect`: Confirmación de conexión
- `error`: Notificación de errores

## 🎯 Flujo de Funcionamiento

1. **Cliente se conecta** → Recibe productos existentes
2. **Usuario agrega producto** → Formulario envía via WebSocket
3. **Servidor procesa** → Guarda en JSON + emite a todos los clientes
4. **Todos los clientes** → Actualizan lista automáticamente
5. **Usuario elimina producto** → Mismo flujo en tiempo real

## 🔧 Tecnologías Utilizadas

- **Node.js** + **Express.js** - Backend
- **Socket.IO** - WebSockets tiempo real
- **Handlebars** - Motor de plantillas
- **Bootstrap 5** - Framework CSS
- **JSON** - Persistencia de datos

## 🚀 Instrucciones de Uso

1. **Iniciar servidor:**

   ```bash
   npm run dev
   ```

2. **Abrir navegador:**

   - Vista estática: `http://localhost:3000`
   - Vista tiempo real: `http://localhost:3000/realtimeproducts`

3. **Probar funcionalidad:**
   - Agregar productos desde el formulario
   - Eliminar productos con el botón "Eliminar"
   - Abrir múltiples pestañas para ver sincronización

## ✨ Características Destacadas

- **Código limpio y modular** sin comentarios innecesarios
- **Separación de responsabilidades** (cliente/servidor)
- **Validaciones** tanto en cliente como servidor
- **Manejo de errores** robusto
- **Interfaz responsive** con Bootstrap
- **Prevención XSS** en renderizado dinámico

## 🧪 Testing

Ejecutar prueba automática:

```bash
node test-entrega2.js
```

La prueba verifica:

- Conexión WebSocket exitosa
- Envío y recepción de productos
- Actualización automática de listas

## 📝 Notas Importantes

- **Simple Browser de VS Code** tiene limitaciones con WebSockets
- **Usar Chrome/Firefox/Safari** para pruebas completas
- Los productos persisten en `data/products.json`
- El servidor maneja múltiples clientes simultáneos

---

**✅ Entrega 2 completada según consigna de Coderhouse**
