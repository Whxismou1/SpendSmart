const jwt = require("jsonwebtoken");
const ExcelJS = require("exceljs");

const userModel = require("../models/user.model");
const movementModel = require("../models/movement.model");
const CategoryModel = require("../models/category.model");

const addMovement = async (req, res) => {
  const { description, amount, categoryID, type, date, time } = req.body;
  const userID = req.userID;

  if (!description || !amount || !categoryID || !type) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }
  try {
    const category = await CategoryModel.find({
      _id: categoryID,
      $or: [{ isDefault: true }, { userID }],
    });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const movement = new movementModel({
      userID,
      description,
      amount,
      category: categoryID,
      type,
      date: date || new Date(),
      time: time || new Date().toLocaleTimeString(),
      icon: category.icon,
    });

    await movement.save();
    res.status(201).json({
      success: true,
      message: "Movement added successfully!",
      movement,
    });
  } catch (error) {
    console.error("Error in addMovement:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllMovements = async (req, res) => {
  try {
    const userID = req.userID;
    const userData = await userModel.findById(userID);

    const userMovements = await movementModel
      .find({ userID })
      .populate("category", "name icon color")
      .sort({ date: -1 })
      .lean();
    const formattedMovements = userMovements.map((m) => ({
      id: m._id,
      description: m.description,
      amount: m.amount,
      date: new Date(m.date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      time: m.time,
      type: m.type,
      category: m.category?.name || "Otro",
      icon: m.category?.icon || "💰",
      color: m.category?.color || "#9ca3af",
    }));

    const categories = await CategoryModel.find({
      $or: [{ isDefault: true }, { userID }],
    }).lean();

    res
      .status(200)
      .json({ success: true, userMovements: formattedMovements, categories });
  } catch (error) {
    console.log("error in getAllMovements ", error);
    res.status(500).json({ success: false, message: "Server error" + error });
  }
};

const removeMovementByID = async (req, res) => {
  const movementId = req.params.id;
  console.log(movementId);
  try {
    const movementData = await movementModel.findByIdAndDelete(movementId);
    if (!movementData) {
      return res
        .status(404)
        .json({ success: false, message: "Movement not found" });
    }

    const userData = await userModel.findById(movementData.userID);
    movementData.type === "income"
      ? (userData.balance -= movementData.amount)
      : (userData.balance += movementData.amount);

    await userData.save();

    res
      .status(200)
      .json({ success: true, message: "Movement deleted successfully!" });
  } catch (error) {
    console.log("error in removeMovementByID ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const downloadMovements = async (req, res) => {
  try {
    const userID = req.userID;
    const userData = await userModel.findById(userID);
    const movements = await movementModel
      .find({ userID: userData._id })
      .sort({ movementDate: -1 });

    if (!movements.length) {
      return res
        .status(400)
        .json({ success: false, message: "No movements found" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Movements");
    worksheet.columns = [
      { header: "Descripción", key: "description", width: 30 },
      { header: "Cantidad", key: "quantity", width: 15 },
      { header: "Categoría", key: "category", width: 20 },
      { header: "Tipo", key: "type", width: 15 },
      { header: "Fecha", key: "date", width: 20 },
      { header: "", key: "", width: 20 },
      { header: "Balance", key: "balance", width: 20 },
    ];

    movements.forEach((movement, index) => {
      let rowData = {
        description: movement.movementDescription,
        quantity: movement.quantity + "€",
        category: movement.movementCategory,
        type: movement.movementType,
        date: movement.movementDate,
      };
      if (index === 0) {
        rowData.balance = userData.balance + "€";
      }

      worksheet.addRow(rowData);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=movimientos.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.log("error in downloadMovements ", error);
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};
const getDashboardSummary = async (req, res) => {
  try {
    const userID = req.userID;
    const movements = await movementModel
      .find({ userID })
      .sort({ date: -1 })
      .populate("category", "name icon color isDefault");

    const incomes = movements
      .filter((m) => m.type === "income")
      .reduce((acc, m) => acc + m.amount, 0);

    const expenses = movements
      .filter((m) => m.type === "expense")
      .reduce((acc, m) => acc + m.amount, 0);

    const balance = incomes - expenses;

    const now = new Date();
    const currentMonth = now.getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentYear = now.getFullYear();
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const filterByMonth = (type, month, year) =>
      movements
        .filter(
          (m) =>
            m.type === type &&
            new Date(m.date).getMonth() === month &&
            new Date(m.date).getFullYear() === year
        )
        .reduce((acc, m) => acc + m.amount, 0);

    const currentMonthIncomes = filterByMonth(
      "income",
      currentMonth,
      currentYear
    );
    const lastMonthIncomes = filterByMonth("income", lastMonth, lastMonthYear);

    const currentMonthExpenses = filterByMonth(
      "expense",
      currentMonth,
      currentYear
    );
    const lastMonthExpenses = filterByMonth(
      "expense",
      lastMonth,
      lastMonthYear
    );

    const currentMonthBalance = currentMonthIncomes - currentMonthExpenses;
    const lastMonthBalance = lastMonthIncomes - lastMonthExpenses;

    const getVariation = (current, last) => {
      if (last === 0) return current > 0 ? 100 : 0;
      return ((current - last) / last) * 100;
    };

    res.json({
      success: true,
      summary: {
        balance,
        incomes,
        expenses,
        variations: {
          balance: getVariation(currentMonthBalance, lastMonthBalance).toFixed(
            2
          ),
          incomes: getVariation(currentMonthIncomes, lastMonthIncomes).toFixed(
            2
          ),
          expenses: getVariation(
            currentMonthExpenses,
            lastMonthExpenses
          ).toFixed(2),
        },
      },
      recentMovements: movements,
    });
  } catch (error) {
    console.error("Error en getDashboardSummary:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener resumen" });
  }
};

module.exports = {
  addMovement,
  getAllMovements,
  removeMovementByID,
  downloadMovements,
  getDashboardSummary,
};
