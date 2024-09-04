const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");
const movementModel = require("../models/movement.model");
const movementTypes = require("../utils/movements.types");

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

  try {
    const dataDecoded = jwt.decode(token, process.env.JWT_SECRET);
    const userID = dataDecoded.userId;
    const userData = await userModel.findById(userID);

    const userMovements = await movementModel.find({ userID: userData._id });
    res.status(200).json({ success: true, userMovements });
  } catch (error) {
    console.log("error in getAllMovements ", error);
    res.status(500).json({ success: false, message: "Server error" });
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
module.exports = { addMovement, getAllMovements, removeMovementByID };
