import mongoose, { Schema } from "mongoose";

const sellerRatingSchema = new Schema(
  {
    ratedUserId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    ratedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      required: true,
    },
    review: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent the same user from rating the same seller multiple times
sellerRatingSchema.index(
  { ratedUserId: 1, ratedByUserId: 1 },
  { unique: true }
);

export const SellerRating = mongoose.model(
  "SellerRating",
  sellerRatingSchema
);