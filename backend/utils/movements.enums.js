const movementCategories = [
    "Alimentación",
    "Transporte",
    "Entretenimiento",
    "Salud",
    "Ingresos",
    "Transferencias",
    "Otro",
  ];
  
  const movementTypes = ["income", "expense"];
  
  const categoryIcons = {
    "Alimentación": "🛒",
    "Transporte": "🚌",
    "Entretenimiento": "🎮",
    "Salud": "💊",
    "Ingresos": "💰",
    "Transferencias": "🔄",
    "Otro": "📦",
  };
  
  module.exports = {
    movementCategories,
    movementTypes,
    categoryIcons,
  };
  