import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    sku: { type: String, required: true }, // which variant
    quantity: { type: Number, required: true, min: 1 },
    priceAtAdd: { type: Number, required: true }, // to detect price changes at checkout
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
