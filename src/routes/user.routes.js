import { Router } from "express";
import {
  changeCurrentPassword,
  deleteUser,
  getProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  // updateCoverImage,
  updateUser,
  updateUserAvatar,
  verifyEmail,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/deleteUser").post(verifyJWT, deleteUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/profile").get(verifyJWT, getProfile);
router.route("/update-profile").patch(verifyJWT, updateUser);
router
  .route("/update-avatar")
  .put(upload.single("avatar"), verifyJWT, updateUserAvatar);
router.route("/verify-email").post(verifyEmail);
// router
//   .route("/update-cover-image")
//   .put(upload.single("coverImage"), verifyJWT, updateCoverImage);
export default router;
