import Joi from "joi";
import mongoose from "mongoose";

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const parseJsonIfString = (value, helpers) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (err) {
      return helpers.error("any.invalid");
    }
  }
  return value;
};

export const createProductValidator = Joi.object({
  sellerId: Joi.string().custom(objectId).required().messages({
    "string.empty": "Seller ID is required.",
    "any.invalid": "Invalid seller ID.",
    "any.required": "Seller ID is required.",
  }),

  title: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Product title is required.",
    "string.min": "Product title must be at least 2 characters.",
    "string.max": "Product title cannot exceed 200 characters.",
    "any.required": "Product title is required.",
  }),

  description: Joi.string().trim().allow("").default(""),

  brand: Joi.string().trim().allow("").default(""),

  category: Joi.string().custom(objectId).required().messages({
    "string.empty": "Category ID is required.",
    "any.invalid": "Invalid category ID.",
    "any.required": "Category ID is required.",
  }),

  images: Joi.custom(parseJsonIfString)
    .default([])
    .custom((val, helpers) => {
      const arr = Array.isArray(val) ? val : [val];
      return arr.filter(Boolean);
    }),

  specifications: Joi.custom(parseJsonIfString)
    .default([])
    .custom((val, helpers) => {
      if (!Array.isArray(val)) return [];
      for (const item of val) {
        if (!item || !item.key || !item.value) {
          return helpers.error("any.invalid");
        }
      }
      return val;
    })
    .messages({
      "any.invalid": "Specifications must be an array of key-value objects.",
    }),

  variants: Joi.custom(parseJsonIfString)
    .custom((val, helpers) => {
      if (!Array.isArray(val) || val.length === 0) {
        return helpers.error("array.min");
      }
      for (const item of val) {
        if (!item || !item.sku || item.price === undefined || item.price < 0) {
          return helpers.error("any.invalid");
        }
        if (item.discountedPrice !== undefined && item.discountedPrice !== null && item.discountedPrice > item.price) {
          return helpers.error("number.max");
        }
      }
      return val;
    })
    .required()
    .messages({
      "array.min": "At least one product variant is required.",
      "any.required": "Product variants are required.",
      "any.invalid": "Each variant must contain a valid sku and price.",
      "number.max": "Discounted price cannot be greater than price.",
    }),

  ratingAvg: Joi.number().min(0).max(5).default(0),

  ratingCount: Joi.number().integer().min(0).default(0),

  totalSold: Joi.number().integer().min(0).default(0),

  status: Joi.string()
    .valid("active", "inactive", "out_of_stock")
    .default("active")
    .messages({
      "any.only": "Status must be one of: active, inactive, out_of_stock.",
    }),
});

export const updateProductValidator = Joi.object({
  title: Joi.string().trim().min(2).max(200),
  description: Joi.string().trim().allow(""),
  brand: Joi.string().trim().allow(""),
  category: Joi.string().custom(objectId).messages({
    "any.invalid": "Invalid category ID.",
  }),
  images: Joi.custom(parseJsonIfString).custom((val, helpers) => {
    const arr = Array.isArray(val) ? val : [val];
    return arr.filter(Boolean);
  }),
  specifications: Joi.custom(parseJsonIfString).custom((val, helpers) => {
    if (!Array.isArray(val)) return [];
    for (const item of val) {
      if (!item || !item.key || !item.value) {
        return helpers.error("any.invalid");
      }
    }
    return val;
  }),
  variants: Joi.custom(parseJsonIfString).custom((val, helpers) => {
    if (!Array.isArray(val)) return helpers.error("any.invalid");
    for (const item of val) {
      if (!item || !item.sku || item.price === undefined || item.price < 0) {
        return helpers.error("any.invalid");
      }
    }
    return val;
  }),
  status: Joi.string().valid("active", "inactive", "out_of_stock"),
  deletedImages: Joi.custom(parseJsonIfString).custom((val, helpers) => {
    if (!val) return [];
    const arr = Array.isArray(val) ? val : [val];
    return arr.filter(Boolean);
  }),
});



