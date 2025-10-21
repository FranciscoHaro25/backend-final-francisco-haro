const mongoose = require("mongoose");

// Sub-schema para productos en el carrito
const cartProductSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Referencia al modelo Product
      required: [true, "La referencia al producto es obligatoria"],
    },
    quantity: {
      type: Number,
      required: [true, "La cantidad es obligatoria"],
      min: [1, "La cantidad debe ser al menos 1"],
      max: [999, "La cantidad no puede exceder 999"],
      validate: {
        validator: function (value) {
          return Number.isInteger(value) && value > 0;
        },
        message: "La cantidad debe ser un número entero positivo",
      },
    },
  },
  {
    _id: false, // No generar _id para subdocumentos
  }
);

// Schema principal para carritos
const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [cartProductSchema],
      default: [],
      validate: {
        validator: function (array) {
          return array.length <= 100; // Máximo 100 productos diferentes
        },
        message: "El carrito no puede tener más de 100 productos diferentes",
      },
    },

    // Campos adicionales útiles para el carrito
    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
    },

    // Información de usuario (opcional para futuras implementaciones)
    userId: {
      type: String, // Puede ser ObjectId si tienes modelo de usuarios
      default: null,
    },

    // Fecha de última modificación automática
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt
    versionKey: false, // Deshabilita __v
  }
);

// Índices para optimizar consultas
cartSchema.index({ status: 1, updatedAt: -1 }); // Carritos activos ordenados por fecha
cartSchema.index({ "products.product": 1 }); // Buscar por producto específico

// Middleware pre-save para actualizar lastModified
cartSchema.pre("save", function (next) {
  this.lastModified = new Date();
  next();
});

// Middleware pre-update
cartSchema.pre(
  ["updateOne", "findOneAndUpdate", "updateMany"],
  function (next) {
    this.set({ lastModified: new Date() });
    next();
  }
);

// Métodos de instancia (para documentos específicos)
cartSchema.methods.addProduct = function (productId, quantity = 1) {
  const existingProduct = this.products.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    this.products.push({ product: productId, quantity });
  }

  return this.save();
};

cartSchema.methods.removeProduct = function (productId) {
  this.products = this.products.filter(
    (item) => item.product.toString() !== productId.toString()
  );
  return this.save();
};

cartSchema.methods.updateProductQuantity = function (productId, quantity) {
  const product = this.products.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (product) {
    if (quantity <= 0) {
      return this.removeProduct(productId);
    } else {
      product.quantity = quantity;
      return this.save();
    }
  } else {
    throw new Error("Producto no encontrado en el carrito");
  }
};

cartSchema.methods.clearCart = function () {
  this.products = [];
  return this.save();
};

cartSchema.methods.getTotalItems = function () {
  return this.products.reduce((total, item) => total + item.quantity, 0);
};

// Métodos virtuales
cartSchema.virtual("isEmpty").get(function () {
  return this.products.length === 0;
});

cartSchema.virtual("totalItems").get(function () {
  return this.products.reduce((total, item) => total + item.quantity, 0);
});

// Método virtual para calcular total (requiere populate)
cartSchema.virtual("totalPrice").get(function () {
  if (!this.populated("products.product")) {
    return null; // Requiere populate para calcular
  }

  return this.products.reduce((total, item) => {
    if (item.product && item.product.price) {
      return total + item.product.price * item.quantity;
    }
    return total;
  }, 0);
});

// Métodos estáticos para consultas comunes
cartSchema.statics.findActive = function () {
  return this.find({ status: "active" });
};

cartSchema.statics.findByUser = function (userId) {
  return this.find({ userId, status: "active" });
};

cartSchema.statics.findWithProducts = function () {
  return this.find({ "products.0": { $exists: true } }); // Carritos que tienen al menos un producto
};

// Configurar población automática para algunos métodos
cartSchema.pre(["find", "findOne", "findOneAndUpdate"], function () {
  // Solo poblar si no está explícitamente deshabilitado
  if (!this.getOptions().skipPopulate) {
    this.populate({
      path: "products.product",
      select: "title price stock status category thumbnails", // Solo campos necesarios
      match: { status: true }, // Solo productos activos
    });
  }
});

// Configurar opciones de JSON
cartSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    // Si hay productos populados, calcular total
    if (ret.products && ret.products.length > 0) {
      ret.totalPrice = ret.products.reduce((total, item) => {
        if (item.product && item.product.price) {
          return total + item.product.price * item.quantity;
        }
        return total;
      }, 0);
    }
    return ret;
  },
});

cartSchema.set("toObject", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

// Crear y exportar el modelo
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
