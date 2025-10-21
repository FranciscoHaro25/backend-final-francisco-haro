const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// Schema para productos con validaciones completas
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minlength: [3, "El título debe tener al menos 3 caracteres"],
      maxlength: [100, "El título no puede exceder 100 caracteres"],
      index: true, // Índice para búsquedas
    },

    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
      minlength: [10, "La descripción debe tener al menos 10 caracteres"],
      maxlength: [500, "La descripción no puede exceder 500 caracteres"],
    },

    code: {
      type: String,
      required: [true, "El código es obligatorio"],
      trim: true,
      unique: [true, "El código debe ser único"],
      minlength: [2, "El código debe tener al menos 2 caracteres"],
      maxlength: [50, "El código no puede exceder 50 caracteres"],
      validate: {
        validator: function (value) {
          return /^[A-Za-z0-9._-]+$/.test(value);
        },
        message:
          "El código solo puede contener letras, números, puntos, guiones y guiones bajos",
      },
      index: { unique: true }, // Índice único
    },

    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0.01, "El precio debe ser mayor a 0"],
      max: [999999, "El precio no puede exceder 999,999"],
      validate: {
        validator: function (value) {
          return Number.isFinite(value) && value > 0;
        },
        message: "El precio debe ser un número válido mayor a 0",
      },
      index: true, // Índice para ordenamiento por precio
    },

    status: {
      type: Boolean,
      default: true,
      index: true, // Índice para filtrar por disponibilidad
    },

    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
      max: [999999, "El stock no puede exceder 999,999"],
      validate: {
        validator: function (value) {
          return Number.isInteger(value) && value >= 0;
        },
        message: "El stock debe ser un número entero no negativo",
      },
    },

    category: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true,
      lowercase: true, // Convertir a minúsculas automáticamente
      enum: {
        values: [
          "electronica",
          "ropa",
          "hogar",
          "deportes",
          "libros",
          "juguetes",
          "belleza",
          "automotriz",
          "jardin",
          "mascotas",
        ],
        message: "Categoría no válida",
      },
      index: true, // Índice para filtrar por categoría
    },

    thumbnails: {
      type: [String],
      default: [],
      validate: {
        validator: function (array) {
          return array.length <= 5;
        },
        message: "No se pueden tener más de 5 thumbnails",
      },
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    versionKey: false, // Deshabilita __v
    // Índices compuestos para consultas optimizadas
    index: [
      { category: 1, status: 1 }, // Para filtrar por categoría y disponibilidad
      { price: 1, status: 1 }, // Para ordenar por precio con productos disponibles
      { title: "text", description: "text" }, // Para búsqueda de texto
    ],
  }
);

// Índices adicionales para optimizar consultas
productSchema.index({ category: 1, status: 1, price: 1 }); // Índice compuesto principal
productSchema.index({ createdAt: -1 }); // Para ordenar por fecha de creación

// Middleware pre-save para validaciones adicionales
productSchema.pre("save", function (next) {
  // Convertir categoría a minúsculas
  if (this.category) {
    this.category = this.category.toLowerCase();
  }

  // Validar URLs de thumbnails
  if (this.thumbnails && this.thumbnails.length > 0) {
    for (let thumb of this.thumbnails) {
      try {
        new URL(thumb); // Validar formato URL
      } catch (error) {
        return next(new Error(`URL de thumbnail inválida: ${thumb}`));
      }
    }
  }

  next();
});

// Middleware pre-update para validaciones
productSchema.pre(
  ["updateOne", "findOneAndUpdate", "updateMany"],
  function (next) {
    const update = this.getUpdate();

    // Si se actualiza la categoría, convertir a minúsculas
    if (update.category) {
      update.category = update.category.toLowerCase();
    }

    next();
  }
);

// Métodos virtuales
productSchema.virtual("isAvailable").get(function () {
  return this.status === true && this.stock > 0;
});

productSchema.virtual("priceFormatted").get(function () {
  return `$${this.price.toFixed(2)}`;
});

// Métodos estáticos para consultas comunes
productSchema.statics.findByCategory = function (category) {
  return this.find({
    category: category.toLowerCase(),
    status: true,
  });
};

productSchema.statics.findAvailable = function () {
  return this.find({
    status: true,
    stock: { $gt: 0 },
  });
};

productSchema.statics.findByPriceRange = function (min, max) {
  return this.find({
    price: { $gte: min, $lte: max },
    status: true,
  });
};

// Agregar plugin de paginación
productSchema.plugin(mongoosePaginate);

// Configurar opciones de JSON
productSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

productSchema.set("toObject", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

// Crear y exportar el modelo
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
