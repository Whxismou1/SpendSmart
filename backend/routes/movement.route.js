const express = require("express");

const movementRouter = express.Router();
const authMiddleware = require("../middlewares/checkAuth");
const movementController = require("../controllers/movement.controller");

movementRouter.post("/add", authMiddleware, movementController.addMovement);
movementRouter.get("/all", authMiddleware, movementController.getAllMovements);
movementRouter.delete(
  "/removeMovementByID/:id",
  authMiddleware,
  movementController.removeMovementByID
);

movementRouter.post(
  "/downloadMovements",
  authMiddleware,
  movementController.downloadMovements
);

movementRouter.get(
  "/dashboardSummary",
  authMiddleware,
  movementController.getDashboardSummary
);

module.exports = movementRouter;
