const express = require("express");
const authMiddleware = require("../middlewares/checkAuth");
const categoryController = require("../controllers/categories.controller");

const categoriesRouter = express.Router();

categoriesRouter.post("/default", categoryController.addDefaultCategories);
categoriesRouter.post("/add", authMiddleware, categoryController.addSpecificCategory);

categoriesRouter.get("/", authMiddleware, categoryController.getAllCategories);

categoriesRouter.delete("/:id", authMiddleware, categoryController.deleteSpecificCategory)

module.exports = categoriesRouter;
