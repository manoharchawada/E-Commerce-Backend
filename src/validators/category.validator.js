import Joi from "joi";
import mongoose from "mongoose";

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const createCategoryValidator = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Category name is required.",
    "string.min": "Category name must be at least 2 characters.",
    "any.required": "Category name is required.",
  }),

  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/)
    .required()
    .messages({
      "string.empty": "Slug is required.",
      "string.pattern.base":
        "Slug must contain only lowercase letters, numbers and hyphens.",
    }),

  parent: Joi.string().custom(objectId).allow(null, "").optional().messages({
    "any.invalid": "Invalid parent category ID.",
  }),

  image: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Image must be a valid URL.",
  }),

  level: Joi.number().integer().min(0).default(0),

  ancestors: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().custom(objectId).required(),
        name: Joi.string().required(),
        slug: Joi.string().required(),
      })
    )
    .default([]),
});

export const updateCategoryValidator = Joi.object({
  name: Joi.string().trim().min(2).max(100),

  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

  parent: Joi.string().custom(objectId).allow(null, ""),

  image: Joi.string().uri().allow(""),

  level: Joi.number().integer().min(0),

  ancestors: Joi.array().items(
    Joi.object({
      _id: Joi.string().custom(objectId).required(),
      name: Joi.string().required(),
      slug: Joi.string().required(),
    })
  ),
}).min(1);
export const deleteCategoryValidator = Joi.object({
  categoryId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Category ID is required.",
    "string.hex": "Category ID must be a valid MongoDB ObjectId.",
    "string.length": "Category ID must be a valid MongoDB ObjectId.",
    "any.required": "Category ID is required.",
  }),
});
