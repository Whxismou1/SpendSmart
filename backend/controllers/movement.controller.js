const jwt = require("jsonwebtoken");
const ExcelJS = require("exceljs");

const userModel = require("../models/user.model");
const movementModel = require("../models/movement.model");
const movementTypes = require("../utils/movements.types");
const e = require("express");

const addMovement = async (req, res) => {
  const token = req.cookies.jwt_token;
  const {
    movementDescription,
    quantity,
    movementCategory,
    movementType,
    movementDate,
  } = req.body;

  try {
    const dataDecoded = jwt.decode(token, process.env.JWT_SECRET);
    const userID = dataDecoded.userId;
    const userData = await userModel.findById(userID);

    const userMovement = new movementModel({
      userID: userData._id,
      movementDescription,
      quantity,
      movementCategory,
      movementType,
      movementDate,
    });
    await userMovement.save();

    movementType === movementTypes.INCOME
      ? (userData.balance += quantity)
      : (userData.balance -= quantity);
    await userData.save();
    res
      .status(200)
      .json({ success: true, message: "Movement added successfully!" });
  } catch (error) {
    console.log("error in addMovement ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllMovements = async (req, res) => {
  const token = req.cookies.jwt_token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  try {
    const dataDecoded = jwt.decode(token, process.env.JWT_SECRET);
    const userID = dataDecoded.userId;
    const userData = await userModel.findById(userID);

    const userMovements = await movementModel.find({ userID: userData._id });
    res.status(200).json({ success: true, userMovements });
  } catch (error) {
    console.log("error in getAllMovements ", error);
    res.status(500).json({ success: false, message: "Server error" + error });
  }
};

const removeMovementByID = async (req, res) => {
  const movementId = req.params.id;

  try {
    const movementData = await movementModel.findByIdAndDelete(movementId);
    if (!movementData) {
      return res
        .status(404)
        .json({ success: false, message: "Movement not found" });
    }

    const userData = await userModel.findById(movementData.userID);
    movementData.movementType === movementTypes.INCOME
      ? (userData.balance -= movementData.quantity)
      : (userData.balance += movementData.quantity);

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
  const token = req.cookies.jwt_token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  const { movements } = req.body;
  if (!movements || movements.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No movements provided" });
  }

  try {
    const dataDecoded = jwt.decode(token, process.env.JWT_SECRET);
    const userData = await userModel.findById(dataDecoded.userId);


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
        rowData.balance = userData.balance +"€";
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

module.exports = {
  addMovement,
  getAllMovements,
  removeMovementByID,
  downloadMovements,
};
