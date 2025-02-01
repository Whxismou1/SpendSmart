const express = require("express");

const movementRouter = express.Router();

const movementController = require("../controllers/movement.controller");

movementRouter.post("/addMovement", movementController.addMovement);
movementRouter.get("/getAllMovements", movementController.getAllMovements);
movementRouter.delete(
  "/removeMovementByID/:id",
  movementController.removeMovementByID
);

movementRouter.post("/downloadMovements", movementController.downloadMovements);

module.exports = movementRouter;
