import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";
import {
  createProductValidator,
  updateProductValidator,
} from "../validators/product.validator.js";
import {
  createProduct,
  updateProduct,
  getProduct,
  getProductById,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = Router();

// Create Product
router.route("/create-product").post(
  upload.array("images", 10),
  verifyJWT,
  validateMiddleware(createProductValidator),
  createProduct
);

// Update Product
router.route("/update-product/:productId").put(
  upload.array("images", 10),
  verifyJWT,
  validateMiddleware(updateProductValidator),
  updateProduct
);

// Get Products List (Supports offset & limit pagination, search, category, brand, price filters)
router.route("/get-product").get(verifyJWT, getProduct);

// Get Single Product by ID
router.route("/get-product/:productId").get(verifyJWT, getProductById);

// Delete Product by ID
router.route("/delete-product/:productId").delete(verifyJWT, deleteProduct);

export default router;




