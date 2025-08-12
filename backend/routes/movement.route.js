const express = require("express");

const movementRouter = express.Router();

const movementController = require("../controllers/movement.controller");

movementRouter.post("/add", movementController.addMovement);
movementRouter.get("/all", movementController.getAllMovements);
movementRouter.delete(
  "/removeMovementByID/:id",
  movementController.removeMovementByID
);

movementRouter.post("/downloadMovements", movementController.downloadMovements);

module.exports = movementRouter;
