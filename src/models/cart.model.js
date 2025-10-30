const mongoose = require("mongoose");

// Sub-schema para productos en el carrito
const cartProductSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
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
    _id: false,
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
          return array.length <= 100;
        },
        message: "El carrito no puede tener más de 100 productos diferentes",
      },
    },

    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
    },

    userId: {
      type: String,
      default: null,
    },

    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

cartSchema.index({ status: 1, updatedAt: -1 });
cartSchema.index({ "products.product": 1 });

cartSchema.pre("save", function (next) {
  this.lastModified = new Date();
  next();
});

cartSchema.pre(
  ["updateOne", "findOneAndUpdate", "updateMany"],
  function (next) {
    this.set({ lastModified: new Date() });
    next();
  }
);

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

cartSchema.virtual("isEmpty").get(function () {
  return this.products.length === 0;
});

cartSchema.virtual("totalItems").get(function () {
  return this.products.reduce((total, item) => total + item.quantity, 0);
});

cartSchema.virtual("totalPrice").get(function () {
  if (!this.populated("products.product")) {
    return null;
  }

  return this.products.reduce((total, item) => {
    if (item.product && item.product.price) {
      return total + item.product.price * item.quantity;
    }
    return total;
  }, 0);
});

cartSchema.statics.findActive = function () {
  return this.find({ status: "active" });
};

cartSchema.statics.findByUser = function (userId) {
  return this.find({ userId, status: "active" });
};

cartSchema.statics.findWithProducts = function () {
  return this.find({ "products.0": { $exists: true } });
};

cartSchema.pre(["find", "findOne", "findOneAndUpdate"], function () {
  if (!this.getOptions().skipPopulate) {
    this.populate({
      path: "products.product",
      select: "title price stock status category thumbnails",
      match: { status: true },
    });
  }
});

cartSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
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

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
