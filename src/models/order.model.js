import mongoose, { Schema } from "mongoose";

// ---------- SubOrder: one per seller within an Order ----------
const subOrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    sku: String,
    title: String, // snapshot
    image: String, // snapshot
    price: Number, // snapshot (price at time of purchase)
    quantity: Number,
  },
  { _id: false }
);

const subOrderSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true, index: true },

    items: [subOrderItemSchema],
    subtotal: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    trackingId: { type: String, default: "" },
    courierPartner: { type: String, default: "" },
    estimatedDelivery: Date,
  },
  { timestamps: true }
);

export const SubOrder = mongoose.model("SubOrder", subOrderSchema);

// ---------- Order: customer-facing, one per checkout ----------
const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    orderNumber: { type: String, unique: true, required: true },

    shippingAddress: {
      // snapshot, not a reference — address may change/delete later
      name: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },

    subOrders: [{ type: Schema.Types.ObjectId, ref: "SubOrder" }],

    totalAmount: { type: Number, required: true },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
