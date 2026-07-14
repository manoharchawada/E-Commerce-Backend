import Joi from "joi";

export const registerUserValidator = Joi.object({
  fullName: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Full name is required",
    "any.required": "Full name is required",
  }),

  username: Joi.string().trim().min(3).max(20).required().messages({
    "string.empty": "Username is required",
    "any.required": "Username is required",
  }),

  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).max(20).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid phone number",
    }),

  role: Joi.string().valid("customer", "seller", "admin").required().messages({
    "any.only": "Role must be user, seller or admin",
  }),
});

export const userLoginValidator = Joi.object({
  username: Joi.string().trim().min(3).max(20).messages({
    "string.empty": "Username is required",
    "any.required": "Username is required",
  }),

  email: Joi.string().email().lowercase().messages({
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).max(20).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});
