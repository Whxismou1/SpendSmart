const express = require("express");

const authController = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/checkAuth");
const {
  registerValidationRules,
  loginValidationRules,
  verifyEmailValidationRules,
  validate,
} = require("../utils/auth.validator");
const authRoutes = express.Router();

authRoutes.post(
  "/register",
  registerValidationRules(),
  validate,
  authController.register
);
authRoutes.post(
  "/login",
  loginValidationRules(),
  validate,
  authController.login
);
authRoutes.post(
  "/verify-email",
  verifyEmailValidationRules(),
  validate,
  authController.verifyEmail
);

authRoutes.post("/forgot-password", authController.forgotPassword);
authRoutes.post("/reset-password/validate", authController.validateResetToken);
authRoutes.post("/reset-password/:resetToken", authController.resetPassword);
authRoutes.get("/logout", authController.logout);
authRoutes.post("/change-password", verifyToken, authController.changePassword);

authRoutes.get("/me", verifyToken, authController.checkAuth);

module.exports = authRoutes;
