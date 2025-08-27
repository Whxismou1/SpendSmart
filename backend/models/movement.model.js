const mongoose = require("mongoose");
const {
  categoryIcons,
} = require("../utils/movements.enums");

const movementSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    budgetID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      default: null,
    }
  },
  { timestamps: true }
);

movementSchema.pre("save", function (next) {
  if (!this.icon) {
    this.icon = categoryIcons[this.category] || "💰";
  }
  next();
});

const MovementModel = mongoose.model("Movement", movementSchema);
module.exports = MovementModel;
