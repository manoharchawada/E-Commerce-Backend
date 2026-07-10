import mongoose, { Schema } from "mongoose";

const refundSchema = new Schema(
  {
    amount: Number,
    reason: String,
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const paymentSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    method: {
      type: String,
      enum: ["card", "upi", "netbanking", "cod", "wallet"],
      required: true,
    },
    // unique + sparse index -> used as idempotency key for Stripe webhooks
    stripePaymentIntentId: { type: String, unique: true, sparse: true, index: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["created", "authorized", "succeeded", "failed", "refunded"],
      default: "created",
    },
    refunds: [refundSchema],
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
