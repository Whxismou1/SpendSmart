const mongoose = require("mongoose");
const {
  movementCategories,
  movementTypes,
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
    icon:{
      type: String
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
    time: {
      type: String,
    },
    category: {
      type: String,
      enum: movementCategories,
      required: true,
    },
    type: {
      type: String,
      enum: movementTypes,
      required: true,
    },
  },
  { timestamps: true }
);

movementSchema.pre("save", function (next) {
  if (!this.icon) {
    this.icon = categoryIcons[this.category] || "💰";
  }
  next();
});

const movementModel = mongoose.model("MovementSchema", movementSchema);

module.exports = movementModel;
