import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Download,
  Menu
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { downloadMovements } from "../services/movementService";

// Datos de ejemplo
const mockTransactions = [
  {
    id: 1,
    description: "Supermercado",
    amount: -85.2,
    date: "2024-01-15",
    category: "Alimentación",
    icon: "🛒",
  },
  {
    id: 2,
    description: "Salario",
    amount: 2500.0,
    date: "2024-01-01",
    category: "Ingresos",
    icon: "💰",
  },
  {
    id: 3,
    description: "Netflix",
    amount: -12.99,
    date: "2024-01-10",
    category: "Entretenimiento",
    icon: "🎬",
  },
  {
    id: 4,
    description: "Restaurante",
    amount: -45.8,
    date: "2024-01-08",
    category: "Alimentación",
    icon: "🍔",
  },
  {
    id: 5,
    description: "Gasolina",
    amount: -60.0,
    date: "2024-01-05",
    category: "Transporte",
    icon: "⛽",
  },
];

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDownloadMovements = async (e) => {
    e.preventDefault();

    try {
      const blob = await downloadMovements();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "movimientos.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Se ha descargado correctamente");
    } catch {
      toast.error("Error descargando los movimientos");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Sidebar para móvil */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      />

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
              <h1 className="text-xl font-bold text-slate-100">Dashboard</h1>
            </div>

          </div>
        </header>

        {/* Contenido del dashboard */}
        <main className="p-4 md:p-6">
          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-800 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Balance Total</p>
                  <h3 className="text-2xl font-bold text-slate-100">
                    €2,296.01
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500 bg-opacity-20 flex items-center justify-center">
                  <DollarSign size={20} className="text-emerald-400" />
                </div>
              </div>
              <div className="flex items-center text-emerald-400">
                <ArrowUpRight size={16} />
                <span className="text-sm ml-1">+5.2% desde el mes pasado</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-slate-800 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Ingresos</p>
                  <h3 className="text-2xl font-bold text-slate-100">
                    €2,500.00
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500 bg-opacity-20 flex items-center justify-center">
                  <ArrowUpRight size={20} className="text-emerald-400" />
                </div>
              </div>
              <div className="flex items-center text-emerald-400">
                <ArrowUpRight size={16} />
                <span className="text-sm ml-1">+0% desde el mes pasado</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-slate-800 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Gastos</p>
                  <h3 className="text-2xl font-bold text-slate-100">€203.99</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center">
                  <ArrowDownRight size={20} className="text-red-400" />
                </div>
              </div>
              <div className="flex items-center text-red-400">
                <ArrowDownRight size={16} />
                <span className="text-sm ml-1">-12.4% desde el mes pasado</span>
              </div>
            </motion.div>
          </div>

          {/* Gráfico y Transacciones recientes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráfico */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="lg:col-span-2 bg-slate-800 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-100">
                  Resumen de gastos
                </h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-slate-400">
                    Semana
                  </button>
                  <button className="px-3 py-1 text-sm bg-emerald-600 rounded-lg text-white">
                    Mes
                  </button>
                  <button className="px-3 py-1 text-sm bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-slate-400">
                    Año
                  </button>
                </div>
              </div>

              {/* Gráfico placeholder */}
              <div className="h-64 bg-gradient-to-r from-emerald-500 from-opacity-20 to-blue-500 to-opacity-20 rounded-lg flex items-center justify-center">
                <p className="text-slate-400">
                  Gráfico de gastos por categoría
                </p>
              </div>
            </motion.div>

            {/* Transacciones recientes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-slate-800 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-100">
                  Transacciones recientes
                </h2>
                <Link
                  href="/dashboard/transactions"
                  className="text-sm hover:underline text-emerald-400"
                >
                  Ver todas
                </Link>
              </div>

              <div className="space-y-4">
                {mockTransactions.slice(0, 4).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-lg">
                        {transaction.icon}
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-slate-400">
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-medium ${
                        transaction.amount > 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount.toFixed(2)}€
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Botones de acción */}
          <div className="fixed bottom-6 right-6 flex flex-col space-y-4">
            {/* <button className="w-12 h-12 rounded-full bg-slate-800 backdrop-blur-sm border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors text-slate-100">
              <Calendar size={20} />
            </button> */}
            <button
              onClick={handleDownloadMovements}
              className="w-12 h-12 rounded-full bg-slate-800 backdrop-blur-sm border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors text-slate-100"
            >
              <Download size={20} />
            </button>
            {/* <button className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
              <Plus size={24} className="text-white" />
            </button> */}
          </div>
        </main>
      </div>
    </div>
  );
}
