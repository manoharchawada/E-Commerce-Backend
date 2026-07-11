import mongoose, { Schema } from "mongoose";

const variantSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    attributes: { type: Map, of: String }, // e.g. { color: "Black", size: "M" }
    price: { type: Number, required: true }, // store in paise/cents
    discountedPrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
  },
  { _id: true }
);

const productSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    brand: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },

    images: [{ type: String }],
    specifications: [
      {
        key: String,
        value: String,
      },
    ],

    variants: [variantSchema],

    ratingAvg: { type: Number, default: 0 }, // denormalized
    ratingCount: { type: Number, default: 0 }, // denormalized
    totalSold: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "inactive", "out_of_stock"],
      default: "active",
    },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", brand: "text" });
productSchema.index({ category: 1, "variants.price": 1 });

export const Product = mongoose.model("Product", productSchema);
