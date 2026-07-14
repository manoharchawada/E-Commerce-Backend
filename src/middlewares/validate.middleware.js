import { ApiError } from "../utils/apiErrors.js";

export const validateMiddleware = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res
        .status(400)
        .json(
          new ApiError(400, error.details.map((err) => err.message).join(", "))
        );
    }

    req.body = value;

    next();
  };
};
