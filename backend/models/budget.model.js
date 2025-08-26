const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      enum: ["monthly", "weekly", "yearly"],
      default: "monthly",
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
    },
    totalBudget: {
      type: Number,
      required: true,
    },
    categories: [
      {
        categoryID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
        budget: { type: Number, required: true },
        spent: { type: Number, default: 0 },
        color: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const BudgetModel = mongoose.model("Budget", budgetSchema);
module.exports = BudgetModel;
