const express = require("express");
const authMiddleware = require("../middlewares/checkAuth");
const categoryController = require("../controllers/categories.controller");

const categoriesRouter = express.Router();

categoriesRouter.post("/default", categoryController.addDefaultCategories);
categoriesRouter.get("/", authMiddleware, categoryController.getAllCategories);

module.exports = categoriesRouter;
