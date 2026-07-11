import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    businessName: { type: String, required: true },
    gstNumber: { type: String, default: "" },
    pickupAddress: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifsc: String,
    },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "suspended"],
      default: "pending",
    },
    commissionRate: { type: Number, default: 10 }, // platform's cut %
  },
  { timestamps: true }
);

export const Seller = mongoose.model("Seller", sellerSchema);
