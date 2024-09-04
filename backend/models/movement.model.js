const mongoose = require("mongoose");
const movementTypes = require("../utils/movements.types");
const movementSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    movementDescription: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    movementCategory: {
      type: String,
      required: true,
    },
    movementType: {
      type: String,
      enum: Object.values(movementTypes),
      required: true,
    },
    movementDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const movementModel = mongoose.model("MovementSchema", movementSchema);

module.exports = movementModel;
