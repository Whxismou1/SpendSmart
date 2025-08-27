const express = require("express");
const authMiddleware = require("../middlewares/checkAuth");
const budgetController = require("../controllers/budget.controller");

const budgetRouter = express.Router();

budgetRouter.post("/add", authMiddleware, budgetController.addBudget);
budgetRouter.get("/", authMiddleware, budgetController.getBudgets);
budgetRouter.delete("/:id", authMiddleware, budgetController.deleteBudgetById);

module.exports = budgetRouter;
