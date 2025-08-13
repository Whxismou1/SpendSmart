import { motion } from "framer-motion";
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Menu,
    Plus,
    Target
} from "lucide-react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
// Mock data para presupuestos
const mockBudgets = [
  {
    id: 1,
    name: "Presupuesto Mensual",
    period: "Enero 2024",
    totalBudget: 1500,
    totalSpent: 1247.5,
    categories: [
      { name: "Alimentación", budget: 400, spent: 385.2, color: "#ef4444" },
      { name: "Transporte", budget: 200, spent: 150.0, color: "#3b82f6" },
      { name: "Entretenimiento", budget: 100, spent: 125.3, color: "#8b5cf6" },
      { name: "Salud", budget: 150, spent: 45.0, color: "#10b981" },
      { name: "Otros", budget: 650, spent: 542.0, color: "#f59e0b" },
    ],
  },
];

export default function BudgetsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Enero 2024");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const currentBudget = mockBudgets[0];
  const spentPercentage =
    (currentBudget.totalSpent / currentBudget.totalBudget) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Contenido principal */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                className="lg:hidden text-slate-400 hover:text-slate-100"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-slate-100">Presupuestos</h1>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-100"
              >
                <option value="Enero 2024">Enero 2024</option>
                <option value="Diciembre 2023">Diciembre 2023</option>
                <option value="Noviembre 2023">Noviembre 2023</option>
              </select>

              <button className="px-4 py-2 gradient-primary rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center space-x-2">
                <Plus size={16} />
                <span>Nuevo Presupuesto</span>
              </button>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="p-4 md:p-6">
          {/* Resumen general */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 bg-opacity-20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">
                    {currentBudget.name}
                  </h2>
                  <p className="text-slate-400 flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>{currentBudget.period}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-100">
                  €{currentBudget.totalSpent.toFixed(2)}
                </p>
                <p className="text-slate-400">
                  de €{currentBudget.totalBudget.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Progreso general</span>
                <span
                  className={`font-medium ${
                    spentPercentage > 90
                      ? "text-red-400"
                      : spentPercentage > 75
                      ? "text-yellow-400"
                      : "text-emerald-400"
                  }`}
                >
                  {spentPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    spentPercentage > 90
                      ? "bg-red-500"
                      : spentPercentage > 75
                      ? "bg-yellow-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>
                  €
                  {(
                    currentBudget.totalBudget - currentBudget.totalSpent
                  ).toFixed(2)}{" "}
                  restante
                </span>
                <span>{(100 - spentPercentage).toFixed(1)}% disponible</span>
              </div>
            </div>

            {spentPercentage > 90 && (
              <div className="mt-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-lg flex items-center space-x-2">
                <AlertTriangle size={16} className="text-red-400" />
                <span className="text-sm text-red-400">
                  ¡Atención! Has superado el 90% de tu presupuesto
                </span>
              </div>
            )}
          </motion.div>

          {/* Desglose por categorías */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-bold text-slate-100 mb-6">
              Desglose por Categorías
            </h3>

            <div className="space-y-4">
              {currentBudget.categories.map((category, index) => {
                const categoryPercentage =
                  (category.spent / category.budget) * 100;
                const isOverBudget = category.spent > category.budget;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-slate-100">
                          {category.name}
                        </span>
                        {isOverBudget && (
                          <AlertTriangle size={16} className="text-red-400" />
                        )}
                        {categoryPercentage <= 75 && (
                          <CheckCircle size={16} className="text-emerald-400" />
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-100">
                          €{category.spent.toFixed(2)}
                        </p>
                        <p className="text-sm text-slate-400">
                          de €{category.budget.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: isOverBudget
                              ? "#ef4444"
                              : category.color,
                            width: `${Math.min(categoryPercentage, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>{categoryPercentage.toFixed(1)}% usado</span>
                        <span>
                          {isOverBudget
                            ? `€${(category.spent - category.budget).toFixed(
                                2
                              )} sobre presupuesto`
                            : `€${(category.budget - category.spent).toFixed(
                                2
                              )} restante`}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
