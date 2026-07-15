import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  deleteCategory,
  getCategory,
} from "../controllers/category.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";
import {
  createCategoryValidator,
  deleteCategoryValidator,
} from "../validators/category.validator.js";
const router = Router();

router
  .route("/create-category")
  .post(
    upload.single("image"),
    verifyJWT,
    validateMiddleware(createCategoryValidator),
    createCategory
  );
router
  .route("/delete-category/:categoryId")
  .delete(
    verifyJWT,
    validateMiddleware(deleteCategoryValidator),
    deleteCategory
  );
router.route("/get-category").get(getCategory);

export default router;
