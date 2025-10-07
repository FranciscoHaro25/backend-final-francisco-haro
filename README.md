# Tienda Virtual Backend - Segunda Entrega

Proyecto de backend para manejo de productos y carritos desarrollado con Node.js, Express y WebSockets. Incluye funcionalidad en tiempo real para la gestión de inventario.

## ¿Qué hace esta aplicación?

Esta aplicación permite gestionar una tienda virtual con productos y carritos de compra. Los usuarios pueden ver productos, crear carritos y agregar items. Todo funciona en tiempo real gracias a WebSockets, así que si alguien agrega o elimina un producto, todos los usuarios conectados lo ven al instante.

## Instalación y uso

Para usar este proyecto necesitas tener Node.js instalado en tu computadora.

```bash
# Descargar el proyecto
git clone https://github.com/FranciscoHaro25/backend-entrega-2-francisco-haro.git

# Entrar a la carpeta
cd entrega-1

# Instalar las dependencias
npm install

# Ejecutar el servidor
npm start
```

Después de esto, abre tu navegador y ve a `http://localhost:3000`

## Comandos disponibles

- `npm start` - Inicia el servidor normal
- `npm run dev` - Inicia el servidor con recarga automática (para desarrollo)

## Cómo está organizado el código

El proyecto sigue una estructura modular para mantener todo ordenado:

```
src/
├── controllers/     # Aquí van las funciones que manejan las peticiones
├── services/       # Lógica de negocio separada
├── routes/         # Definición de las rutas de la API
├── dao/           # Managers que guardan y leen datos del JSON
├── views/         # Plantillas HTML con Handlebars
├── sockets/       # Configuración de WebSockets
├── middlewares/   # Validaciones y seguridad
└── config/        # Configuración general
```

## Endpoints de la API

### Para productos:

- `GET /api/products` - Ver todos los productos (opcional: ?limit=10)
- `GET /api/products/:id` - Ver un producto específico
- `POST /api/products` - Crear producto nuevo
- `PUT /api/products/:id` - Modificar un producto
- `DELETE /api/products/:id` - Borrar producto

### Para carritos:

- `POST /api/carts` - Crear un carrito vacío
- `GET /api/carts/:id` - Ver qué hay en un carrito
- `POST /api/carts/:cid/product/:pid` - Meter un producto al carrito

### Páginas web:

- `/` - Página principal con lista de productos
- `/realtimeproducts` - Página para administrar productos en tiempo real

## Tecnologías usadas

- **Node.js** - Para el servidor
- **Express** - Framework web
- **Socket.IO** - Para funcionalidad en tiempo real
- **Handlebars** - Para las vistas HTML
- **Bootstrap** - Para que se vea bonito
- **JSON** - Para guardar los datos

## Funcionamiento en tiempo real

La aplicación usa WebSockets para mantener sincronizados a todos los usuarios. Cuando alguien:

- Agrega un producto nuevo
- Elimina un producto
- Modifica el inventario

Todos los demás usuarios ven el cambio inmediatamente sin recargar la página.

## Autor

Francisco Haro  
Estudiante del curso de Desarrollo Backend - Coderhouse

---

_Este proyecto fue desarrollado como parte de la segunda entrega del curso de Backend en Coderhouse_
