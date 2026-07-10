import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percentage", "flat"], required: true },
    value: { type: Number, required: true }, // 10 (%) or 100 (flat currency)
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number }, // cap for percentage coupons
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
