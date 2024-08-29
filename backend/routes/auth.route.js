const express = require("express");

const authRouter = require("../controllers/auth.controller");
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
  authRouter.register
);
authRoutes.post("/login", loginValidationRules(), validate, authRouter.login);
authRoutes.post(
  "/verify-email",
  verifyEmailValidationRules(),
  validate,
  authRouter.verifyEmail
);

authRoutes.post("/forgot-password", authRouter.forgotPassword);
authRoutes.post("/reset-password/:resetToken", authRouter.resetPassword);
authRoutes.get("/logout", authRouter.logout);
module.exports = authRoutes;
