import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";
import { createSellerValidator } from "../validators/seller.validator.js";
import { createSeller } from "../controllers/seller.controller.js";
const router = Router();

router
  .route("/create-seller")
  .post(verifyJWT, validateMiddleware(createSellerValidator), createSeller);

export default router;
