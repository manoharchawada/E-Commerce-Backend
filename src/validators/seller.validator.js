import Joi from "joi";

export const createSellerValidator = Joi.object({
  businessName: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Business name is required",
    "string.min": "Business name must be at least 3 characters",
    "string.max": "Business name cannot exceed 100 characters",
    "any.required": "Business name is required",
  }),

  gstNumber: Joi.string().trim().allow("", null).messages({
    "string.base": "GST number must be a string",
  }),

  pickupAddress: Joi.object({
    line1: Joi.string().trim().required().messages({
      "string.empty": "Pickup address is required",
      "any.required": "Pickup address is required",
    }),

    city: Joi.string().trim().required().messages({
      "string.empty": "City is required",
      "any.required": "City is required",
    }),

    state: Joi.string().trim().required().messages({
      "string.empty": "State is required",
      "any.required": "State is required",
    }),

    pincode: Joi.string()
      .trim()
      .pattern(/^[1-9][0-9]{5}$/)
      .required()
      .messages({
        "string.empty": "Pincode is required",
        "string.pattern.base": "Please enter a valid 6-digit pincode",
        "any.required": "Pincode is required",
      }),
  }).required(),

  bankDetails: Joi.object({
    accountHolderName: Joi.string().trim().required().messages({
      "string.empty": "Account holder name is required",
      "any.required": "Account holder name is required",
    }),

    accountNumber: Joi.string()
      .trim()
      .pattern(/^[0-9]{9,18}$/)
      .required()
      .messages({
        "string.empty": "Account number is required",
        "string.pattern.base": "Please enter a valid account number",
        "any.required": "Account number is required",
      }),

    ifsc: Joi.string()
      .trim()
      .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      .required()
      .messages({
        "string.empty": "IFSC code is required",
        "string.pattern.base": "Please enter a valid IFSC code",
        "any.required": "IFSC code is required",
      }),
  }).required(),
});
