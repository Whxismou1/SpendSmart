const jwt = require("jsonwebtoken");
const ExcelJS = require("exceljs");

const userModel = require("../models/user.model");
const movementModel = require("../models/movement.model");
const addMovement = async (req, res) => {
  const { description, amount, category, type, date, time } = req.body;

  if (!description || !amount || !category || !type) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const session = await movementModel.startSession();

  const executeTransaction = async () => {
    session.startTransaction();
    try {
      const userID = req.userID;
      const userData = await userModel.findById(userID).session(session);
      if (!userData) throw new Error("User not found");

      const userMovement = new movementModel({
        userID: userData._id,
        description,
        amount,
        category,
        type,
        date: date || new Date(),
        time: time || new Date().toLocaleTimeString(),
      });

      await userMovement.save({ session });

      if (type === "income") {
        userData.balance += Math.abs(amount);
      } else {
        userData.balance -= Math.abs(amount);
      }

      await userData.save({ session });

      await session.commitTransaction();
      return { success: true };
    } catch (error) {
      await session.abortTransaction();
      if (
        error.hasOwnProperty("errorLabels") &&
        error.errorLabels.includes("TransientTransactionError")
      ) {
        return executeTransaction();
      } else {
        throw error;
      }
    } finally {
      session.endSession();
    }
  };

  try {
    await executeTransaction();
    res
      .status(200)
      .json({ success: true, message: "Movement added successfully!" });
  } catch (error) {
    console.log("error in addMovement ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllMovements = async (req, res) => {
  try {
    const userID = req.userID;
    const userData = await userModel.findById(userID);
    console.log(userData);

    const userMovements = await movementModel.find({ userID });

    res.status(200).json({ success: true, userMovements });
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

const getCategories = async (req, res) => {
  const summaryCategories = await movementModel.aggregate([
    { $match: { type: "expense" } },

    {
      $group: {
        _id: "$category",
        totalExpenses: { $sum: "$amount" },
        count: { $sum: 1 },
        icon: { $first: "$icon" },
      },
    },
  ]);

  // console.log(summaryCategories);

  return res.json(summaryCategories);
};

module.exports = {
  addMovement,
  getAllMovements,
  removeMovementByID,
  downloadMovements,
  getCategories,
};
