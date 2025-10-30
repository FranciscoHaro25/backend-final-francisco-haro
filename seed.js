require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./src/models/product.model");

// Datos de ejemplo con categorías válidas del modelo
const sampleProducts = [
  // Electrónica - Smartphones
  {
    title: "iPhone 15 Pro",
    description:
      "El último smartphone de Apple con chip A17 Pro y cámara profesional de 48MP con zoom óptico.",
    price: 999.99,
    category: "electronica",
    stock: 25,
    code: "IP15PRO001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=iPhone+15+Pro"],
  },
  {
    title: "Samsung Galaxy S24 Ultra",
    description:
      "Smartphone Android premium con S Pen integrado y cámara de 200MP con zoom espacial.",
    price: 899.99,
    category: "electronica",
    stock: 30,
    code: "SGS24U001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=Galaxy+S24"],
  },

  // Electrónica - Laptops
  {
    title: 'MacBook Pro 14"',
    description:
      "Laptop profesional con chip M3 Pro, 16GB RAM y SSD 512GB para desarrollo y diseño.",
    price: 1999.99,
    category: "electronica",
    stock: 15,
    code: "MBP14M3001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=MacBook+Pro"],
  },
  {
    title: "Dell XPS 13",
    description:
      "Ultrabook compacta con Intel Core i7 y pantalla InfinityEdge de 13.4 pulgadas.",
    price: 1299.99,
    category: "electronica",
    stock: 20,
    code: "DXPS13001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=Dell+XPS"],
  },

  // Electrónica - Tablets
  {
    title: "iPad Air",
    description:
      "Tablet versátil con chip M1 y compatibilidad con Apple Pencil de segunda generación.",
    price: 599.99,
    category: "electronica",
    stock: 40,
    code: "IPADAIR001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=iPad+Air"],
  },
  {
    title: "Samsung Galaxy Tab S9",
    description:
      "Tablet Android premium con S Pen incluido y pantalla Dynamic AMOLED 2X.",
    price: 649.99,
    category: "electronica",
    stock: 25,
    code: "GTABS9001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=Galaxy+Tab"],
  },

  // Juguetes - Gaming
  {
    title: "PlayStation 5",
    description:
      "Consola de videojuegos de nueva generación con SSD ultra rápido y ray tracing.",
    price: 499.99,
    category: "juguetes",
    stock: 50,
    code: "PS5001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=PlayStation+5"],
  },
  {
    title: "Xbox Series X",
    description:
      "Consola 4K con 12 teraflops y compatibilidad con miles de juegos de Xbox.",
    price: 499.99,
    category: "juguetes",
    stock: 45,
    code: "XBOXSX001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=Xbox+Series+X"],
  },

  // Electrónica - Accesorios
  {
    title: "AirPods Pro 2",
    description:
      "Auriculares inalámbricos con cancelación activa de ruido y audio espacial personalizado.",
    price: 249.99,
    category: "electronica",
    stock: 60,
    code: "AIRPODS2001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=AirPods+Pro"],
  },
  {
    title: "Logitech MX Master 3S",
    description:
      "Mouse inalámbrico premium con sensor de 8000 DPI y rueda MagSpeed electromagnética.",
    price: 99.99,
    category: "electronica",
    stock: 35,
    code: "MXMAST3S001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=MX+Master"],
  },

  // Hogar - Smart TV
  {
    title: "Samsung Neo QLED 65",
    description:
      "Smart TV 4K de 65 pulgadas con Quantum Matrix Technology y procesador Neural Quantum 4K.",
    price: 1899.99,
    category: "hogar",
    stock: 12,
    code: "QLED65001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=Samsung+QLED"],
  },
  {
    title: "LG OLED C3 55",
    description:
      "Smart TV OLED 4K de 55 pulgadas con procesador α9 Gen6 AI y webOS 23.",
    price: 1399.99,
    category: "hogar",
    stock: 18,
    code: "OLEDC355001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=LG+OLED"],
  },

  // Ropa
  {
    title: "Camiseta Nike Dri-FIT",
    description:
      "Camiseta deportiva con tecnología Dri-FIT que mantiene la piel seca y cómoda.",
    price: 29.99,
    category: "ropa",
    stock: 100,
    code: "NIKE001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=Nike+Dri-FIT"],
  },
  {
    title: "Jeans Levi's 501",
    description:
      "Jeans clásicos de corte recto con cinco bolsillos, fabricados en denim 100% algodón.",
    price: 79.99,
    category: "ropa",
    stock: 75,
    code: "LEVIS501001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=Levis+501"],
  },

  // Deportes
  {
    title: "Bicicleta Trek Marlin 7",
    description:
      "Bicicleta de montaña con cuadro Alpha Gold Aluminum y suspensión delantera SR Suntour.",
    price: 899.99,
    category: "deportes",
    stock: 20,
    code: "TREKMARL7001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=Trek+Marlin"],
  },
  {
    title: "Zapatillas Nike Air Max 270",
    description:
      "Zapatillas deportivas con amortiguación Max Air visible y diseño moderno para uso diario.",
    price: 149.99,
    category: "deportes",
    stock: 85,
    code: "AIRMAX270001",
    status: true,
    thumbnails: ["https://via.placeholder.com/300x300?text=Air+Max+270"],
  },
];

async function seedDatabase() {
  try {
    console.log("🔄 Conectando a MongoDB...");

    // Conectar a MongoDB usando la configuración del .env
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce_final"
    );

    console.log("✅ Conectado a MongoDB");

    // Limpiar productos existentes
    console.log("🧹 Limpiando productos existentes...");
    await Product.deleteMany({});

    // Insertar productos de ejemplo
    console.log("📦 Insertando productos de ejemplo...");
    const insertedProducts = await Product.insertMany(sampleProducts);

    console.log(
      `✅ ${insertedProducts.length} productos insertados exitosamente`
    );

    // Mostrar estadísticas
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          totalStock: { $sum: "$stock" },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    console.log("\n📊 Estadísticas por categoría:");
    stats.forEach((stat) => {
      console.log(
        `  ${stat._id}: ${
          stat.count
        } productos, Precio promedio: $${stat.avgPrice.toFixed(
          2
        )}, Stock total: ${stat.totalStock}`
      );
    });

    const totalProducts = await Product.countDocuments();
    const totalValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$price", "$stock"] } },
        },
      },
    ]);

    console.log(
      `\n💰 Valor total del inventario: $${
        totalValue[0]?.total.toFixed(2) || 0
      }`
    );
    console.log(`📈 Total de productos: ${totalProducts}`);
  } catch (error) {
    console.error("❌ Error al poblar la base de datos:", error);
  } finally {
    console.log("🔚 Desconectado de MongoDB");
    await mongoose.disconnect();
  }
}

// Ejecutar el seeding
seedDatabase();
