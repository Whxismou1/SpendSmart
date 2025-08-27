const CategoryModel = require("../models/category.model");
const MovementModel = require("../models/movement.model");
const mongoose = require("mongoose");

const defaultCategories = [
  {
    name: "Alimentación",
    icon: "🛒",
    color: "#ef4444",
    defaultType: "expense",
  },
  { name: "Transporte", icon: "🚌", color: "#3b82f6", defaultType: "expense" },
  {
    name: "Entretenimiento",
    icon: "🎮",
    color: "#8b5cf6",
    defaultType: "expense",
  },
  { name: "Salud", icon: "💊", color: "#10b981", defaultType: "expense" },
  { name: "Ingresos", icon: "💰", color: "#22c55e", defaultType: "income" },
  {
    name: "Transferencias",
    icon: "🔄",
    color: "#f97316",
    defaultType: "income",
  },
  { name: "Otro", icon: "📦", color: "#6b7280", defaultType: "expense" },
];

const addDefaultCategories = async (req, res) => {
  try {
    const existing = await CategoryModel.find({ isDefault: true });

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: "Las categorías por defecto ya existen" });
    }

    const categories = await CategoryModel.insertMany(
      defaultCategories.map((cat) => ({ ...cat, isDefault: true }))
    );

    res.status(201).json({
      message: "Categorías por defecto creadas exitosamente",
      categories,
    });
  } catch (error) {
    console.error("Error al crear categorías por defecto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getAllCategories = async (req, res) => {
  const userID = req.userID;
  console.log(userID);
  const categories = await CategoryModel.find({
    $or: [{ isDefault: true }, { userID }],
  }).lean();

  console.log(categories);

  const categoryIds = categories.map((cat) => cat._id);

  console.log(categoryIds);

  const summary = await MovementModel.aggregate([
    {
      $match: {
        userID: mongoose.Types.ObjectId.createFromHexString(userID),
        category: { $in: categoryIds },
      },
    },
    {
      $group: {
        _id: "$category",
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        totalExpense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const result = categories.map((cat) => {
    const catSummary = summary.find(
      (s) => s._id.toString() === cat._id.toString()
    );
    const spent =
      (catSummary?.totalExpense || 0) - (catSummary?.totalIncome || 0);

    return {
      id: cat._id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      budget: cat.budget || 0,
      spent: spent < 0 ? 0 : spent,
      isDefault: cat.isDefault,
    };
  });

  console.log("res", result);

  res.json(result);
};

const addSpecificCategory = async (req, res) => {
  const userID = req.userID;

  const { name, icon, color } = req.body;
  console.log(name, icon, color);

  if (!name) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  const categoryOnDb = await CategoryModel.findOne({ userID, name });

  if (categoryOnDb) {
    return res.status(400).json({ message: "Ya existe la categoria " });
  }

  const newCategory = new CategoryModel({
    userID,
    name,
    icon,
    color,
  });

  await newCategory.save();

  return res.status(201).json({
    success: true,
    message: "Categoría creada con éxito",
    category: newCategory,
  });
};

const deleteSpecificCategory = async (req, res) => {
  const userID = req.userID;
  const categoryID = req.params.id;
  console.log("wa")
  const category = await CategoryModel.findOneAndDelete({
    _id: categoryID,
    userID,
    isDefault: false,
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Categoría no encontrada o no tienes permisos",
    });
  }

  res.json({
    success: true,
    message: "Categoría eliminada correctamente",
    category,
  });
};

module.exports = {
  addDefaultCategories,
  getAllCategories,
  addSpecificCategory,
  deleteSpecificCategory,
};
