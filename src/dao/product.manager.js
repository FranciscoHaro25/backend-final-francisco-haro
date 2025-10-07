const fs = require("fs").promises;
const path = require("path");

// Funciones auxiliares para validar los datos que llegan del formulario
// Estas funciones se encargan de convertir y validar tipos de datos
const toInt = (v, field) => {
  const n = Number.parseInt(v, 10);
  if (!Number.isFinite(n)) throw new Error(`Campo ${field} debe ser entero`);
  return n;
};

const toNumber = (v, field) => {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new Error(`Campo ${field} debe ser numérico`);
  return n;
};

const ensureString = (v, field) => {
  if (typeof v !== "string" || v.trim() === "") {
    throw new Error(`Campo ${field} es obligatorio`);
  }
  return v.trim();
};

const ensureThumbs = (val) => {
  if (val == null) return [];
  if (!Array.isArray(val)) throw new Error("thumbnails debe ser un array");
  return val.map(String);
};

// Administrador de productos - maneja la persistencia de productos en JSON
// Este manager se encarga de todas las operaciones CRUD con productos
class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "../../data/products.json");
    // Cola para evitar problemas de concurrencia en las operaciones de archivo
    this._queue = Promise.resolve();
  }

  // M\u00e9todo para poner las operaciones en cola y evitar conflictos
  enqueue(fn) {
    this._queue = this._queue.then(fn, fn);
    return this._queue;
  }

  // Lee todos los productos del archivo JSON
  async readProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe todavía, devolvemos un array vacío
      if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  // Escribe la lista de productos actualizada en el archivo
  async writeProducts(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      throw error;
    }
  }

  // Obtiene todos los productos, con opción de limitar la cantidad
  async getProducts(limit) {
    try {
      const products = await this.readProducts();
      const n = Number.parseInt(limit, 10);
      // Si se especifica un límite válido, devolvemos solo esa cantidad
      if (Number.isFinite(n) && n > 0) {
        return products.slice(0, n);
      }
      return products;
    } catch (error) {
      throw error;
    }
  }

  // Busca un producto específico por su ID
  async getProductById(id) {
    try {
      const products = await this.readProducts();
      const product = products.find((p) => p.id === parseInt(id));
      return product || null;
    } catch (error) {
      throw error;
    }
  }

  // Agrega un producto nuevo después de validar todos los campos requeridos
  async addProduct(productData) {
    return this.enqueue(async () => {
      try {
        // Validamos y limpiamos todos los campos obligatorios
        const title = ensureString(productData.title, "title");
        const description = ensureString(
          productData.description,
          "description"
        );
        const code = ensureString(productData.code, "code");
        const category = ensureString(productData.category, "category");

        const price = toNumber(productData.price, "price");
        const stock = toInt(productData.stock, "stock");
        const thumbnails = ensureThumbs(productData.thumbnails);

        const products = await this.readProducts();

        // Revisamos que no exista otro producto con el mismo código
        if (products.some((p) => p.code === code)) {
          throw new Error(`El código ${code} ya existe`);
        }

        // Calculamos el siguiente ID disponible
        const newId =
          products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

        const newProduct = {
          id: newId,
          title,
          description,
          code,
          price,
          status: productData.status ?? true,
          stock,
          category,
          thumbnails,
        };

        products.push(newProduct);
        await this.writeProducts(products);
        return newProduct;
      } catch (error) {
        throw error;
      }
    });
  }

  // Actualiza un producto existente con los nuevos datos proporcionados
  async updateProduct(id, updateData) {
    return this.enqueue(async () => {
      try {
        const products = await this.readProducts();
        const index = products.findIndex((p) => p.id === parseInt(id));
        if (index === -1) {
          throw new Error("Producto no encontrado");
        }

        // El ID no se puede cambiar, lo eliminamos de los datos
        delete updateData.id;

        // Si se quiere cambiar el código, verificamos que sea único
        if (updateData.code !== undefined) {
          const newCode = ensureString(updateData.code, "code");
          const existingProduct = products.find(
            (p) => p.code === newCode && p.id !== parseInt(id)
          );
          if (existingProduct) {
            throw new Error(`El código ${newCode} ya existe`);
          }
          updateData.code = newCode;
        }

        // Normalizar tipos si vienen
        if (updateData.price !== undefined) {
          updateData.price = toNumber(updateData.price, "price");
        }
        if (updateData.stock !== undefined) {
          updateData.stock = toInt(updateData.stock, "stock");
        }
        if (updateData.title !== undefined) {
          updateData.title = ensureString(updateData.title, "title");
        }
        if (updateData.description !== undefined) {
          updateData.description = ensureString(
            updateData.description,
            "description"
          );
        }
        if (updateData.category !== undefined) {
          updateData.category = ensureString(updateData.category, "category");
        }
        if (updateData.thumbnails !== undefined) {
          updateData.thumbnails = ensureThumbs(updateData.thumbnails);
        }
        if (updateData.status !== undefined) {
          updateData.status = Boolean(updateData.status);
        }

        products[index] = { ...products[index], ...updateData };
        await this.writeProducts(products);
        return products[index];
      } catch (error) {
        throw error;
      }
    });
  }

  async deleteProduct(id) {
    return this.enqueue(async () => {
      const products = await this.readProducts();
      const index = products.findIndex((p) => p.id === parseInt(id, 10));
      if (index === -1) throw new Error("Producto no encontrado");

      const deletedProduct = products[index];
      products.splice(index, 1);
      await this.writeProducts(products);
      return deletedProduct;
    });
  }
}

module.exports = ProductManager;
