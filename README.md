# Entrega Nº1 - Coderhouse Backend

Servidor en Node.js + Express para gestionar productos y carritos.

## Instalación y Ejecución

```bash
npm install
npm start
```

El servidor corre en `http://localhost:8080`

## Estructura del Proyecto

```
entrega-1/
├── data/
│   ├── products.json
│   └── carts.json
├── managers/
│   ├── ProductManager.js
│   └── CartManager.js
├── routes/
│   ├── products.js
│   └── carts.js
├── app.js
├── package.json
└── README.md
```

## API - Productos

| Método | Endpoint             | Descripción         |
| ------ | -------------------- | ------------------- |
| GET    | `/api/products`      | Listar productos    |
| GET    | `/api/products/:pid` | Producto por ID     |
| POST   | `/api/products`      | Crear producto      |
| PUT    | `/api/products/:pid` | Actualizar producto |
| DELETE | `/api/products/:pid` | Eliminar producto   |

Ejemplo producto:

```json
{
  "id": 1,
  "title": "Producto ejemplo",
  "description": "Descripción",
  "code": "ABC123",
  "price": 100,
  "status": true,
  "stock": 50,
  "category": "Categoría",
  "thumbnails": []
}
```

## API - Carritos

| Método | Endpoint                       | Descripción      |
| ------ | ------------------------------ | ---------------- |
| POST   | `/api/carts`                   | Crear carrito    |
| GET    | `/api/carts/:cid`              | Ver carrito      |
| POST   | `/api/carts/:cid/product/:pid` | Agregar producto |

Ejemplo carrito:

```json
{
  "id": 1,
  "products": [
    {
      "product": 1,
      "quantity": 2
    }
  ]
}
```

## Notas

- Los IDs se generan automáticamente
- Los datos se persisten en archivos JSON
- Se validan campos requeridos y códigos únicos
- Separación en managers y rutas

## Uso

Crear producto:

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Smartphone",
    "description": "Teléfono último modelo",
    "code": "SM001",
    "price": 599.99,
    "stock": 25,
    "category": "Electrónicos"
  }'
```

Crear carrito:

```bash
curl -X POST http://localhost:8080/api/carts
```

Agregar al carrito:

```bash
curl -X POST http://localhost:8080/api/carts/1/product/1
```
