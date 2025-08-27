const BudgetModel = require("../models/budget.model");
const CategoryModel = require("../models/category.model");
const MovementModel = require("../models/movement.model");

const addBudget = async (req, res) => {
  try {
    const userID = req.userID;
    const { name, period, year, month, totalBudget, categories } = req.body;

    if (!name || !totalBudget || !year) {
      return res
        .status(400)
        .json({ success: false, message: "Faltan campos obligatorios" });
    }

    if (totalBudget <= 0) {
      return res.status(400).json({
        success: false,
        message: "El presupuesto debe ser mayor que 0",
      });
    }

    const existingBudget = await BudgetModel.findOne({
      userID,
      name,
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un presupuesto con ese nombre en este periodo",
      });
    }

    if (categories && categories.length > 0) {
      const categoryIds = categories.map((c) => c.categoryID);

      const existingCategories = await CategoryModel.find({
        _id: { $in: categoryIds },
        $or: [{ userID }, { isDefault: true }],
      });

      if (existingCategories.length !== categoryIds.length) {
        return res
          .status(400)
          .json({ success: false, message: "Alguna categoría no es válida" });
      }
      const sumBudgets = categories.reduce((acc, c) => acc + c.budget, 0);
      if (sumBudgets > totalBudget) {
        return res.status(400).json({
          success: false,
          message: "La suma de categorías supera el total",
        });
      }
    }

    const budget = await BudgetModel.create({
      userID,
      name,
      period,
      year,
      month,
      totalBudget,
      categories,
    });

    return res.status(201).json({ success: true, budget });
  } catch (error) {
    console.error("Error al crear presupuesto:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

const getBudgets = async (req, res) => {
  try {
    const userID = req.userID;

    const budgets = await BudgetModel.find({ userID }).populate({
      path: "categories.categoryID",
      model: "Category",
    });

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const categoriesWithSpent = await Promise.all(
          budget.categories.map(async (cat) => {
            const spentAgg = await MovementModel.aggregate([
              {
                $match: {
                  userID: budget.userID,
                  category: cat.categoryID._id,
                  budgetID: budget._id,
                  type: "expense",
                },
              },
              {
                $group: {
                  _id: null,
                  totalSpent: { $sum: "$amount" },
                },
              },
            ]);

            return {
              _id: cat.categoryID._id,
              name: cat.categoryID.name,
              icon: cat.categoryID.icon,
              color: cat.color || cat.categoryID.color,
              budget: cat.budget,
              spent: spentAgg.length > 0 ? spentAgg[0].totalSpent : 0,
            };
          })
        );

        // Total gastado del presupuesto
        const totalSpent = categoriesWithSpent.reduce(
          (acc, c) => acc + c.spent,
          0
        );

        return {
          _id: budget._id,
          name: budget.name,
          period: budget.period,
          year: budget.year,
          month: budget.month,
          totalBudget: budget.totalBudget,
          totalSpent,
          categories: categoriesWithSpent,
        };
      })
    );

    return res.json({ success: true, budgets: budgetsWithSpent });
  } catch (error) {
    console.error("Error al obtener presupuesto:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

const deleteBudgetById = async (req, res) => {
  try {
    const userID = req.userID;
    const budgetID = req.params.id;

    const deletedBudget = await BudgetModel.findOneAndDelete({
      _id: budgetID,
      userID,
    });

    if (!deletedBudget) {
      return res.status(404).json({
        success: false,
        message: "Presupuesto no encontrado o no autorizado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Presupuesto eliminado",
    });
  } catch (error) {
    console.error("Error eliminando presupuesto:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

module.exports = { addBudget, getBudgets, deleteBudgetById };
