const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "💰",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#9ca3af",
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
