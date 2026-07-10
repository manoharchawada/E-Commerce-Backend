import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    image: { type: String, default: "" },
    level: { type: Number, default: 0 }, // 0 = root, 1 = sub, 2 = leaf
    ancestors: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Category" },
        name: String,
        slug: String,
      },
    ],
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
