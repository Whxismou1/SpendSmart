const express = require("express");
const authRouter = require("../controllers/auth.controller");
const authRoutes = express.Router();

authRoutes.post("/register", authRouter.register);
authRoutes.post("/login", authRouter.login);
authRoutes.post("/verify-email", authRouter.verifyEmail);

module.exports = authRoutes;
