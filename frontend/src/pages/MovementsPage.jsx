import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Download,
  Edit,
  Eye,
  Menu,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddMovementModal from "../components/AddMovementModal";
import Sidebar from "../components/Sidebar";
import {
  deleteMovementByID,
  downloadMovements,
  getAllMovements,
} from "../services/movementService";
import useAuthStore from "../stores/authStore";

export default function MovementsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [transactions, setTransactions] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    async function fetchMovements() {
      const res = await getAllMovements();
      const formattedTransactions = res.map((m) => ({
        id: m._id,
        description: m.description,
        amount: m.amount,
        date: new Date(m.date).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        time: m.time,
        category: m.category,
        icon: m.icon,
        type: m.type,
      }));
      setTransactions(formattedTransactions);
    }
    fetchMovements();
  }, []);

  const handleDeleteMovement = async (movement) => {
    try {
      console.log(movement);
      await deleteMovementByID(movement.id);
      setTransactions((prev) => prev.filter((t) => t.id !== movement.id));
      toast.success("Movimiento eliminado correctamente");
    } catch {
      toast.error("No se ha podido eliminar el movimiento");
    }
  };

  const handleDownloadMovements = async (e) => {
    e.preventDefault();

    if (transactions.length === 0) {
      toast("No hay movimientos!", {
        icon: "⚠️",
      });
      return;
    }

    try {
      const blob = await downloadMovements();
      console.log(blob);

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
      toast.error("Error descargando los movimientos.");
    }
  };

  const handleAddMovement = (movement) => {
    setTransactions((prev) => [movement, ...prev]);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const categories = [
    "all",
    "Alimentación",
    "Transporte",
    "Entretenimiento",
    "Salud",
    "Ingresos",
    "Transferencias",
  ];
  // const types = ["all", "income", "expense"];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || transaction.category === selectedCategory;
    const matchesType =
      selectedType === "all" || transaction.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

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
              <h1 className="text-xl font-bold text-slate-100">Movimientos</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100"
                >
                  <option value="all">Todos los períodos</option>
                  <option value="today">Hoy</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
                  <option value="year">Este año</option>
                </select>

                {/* <button className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors flex items-center space-x-2">
                  <Filter size={16} className="text-slate-400" />
                  <span className="text-slate-100 text-sm">Filtros</span>
                </button> */}

                <button
                  onClick={handleDownloadMovements}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors flex items-center space-x-2"
                >
                  <Download size={16} className="text-slate-400" />
                  <span className="text-slate-100 text-sm">Exportar</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 gradient-primary rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Nuevo Movimiento</span>
                </button>
                <AddMovementModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onAdd={handleAddMovement}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="p-4 md:p-6">
          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Ingresos</p>
                  <h3 className="text-2xl font-bold text-emerald-400">
                    +€{totalIncome.toFixed(2)}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500 bg-opacity-20 flex items-center justify-center">
                  <ArrowUpRight size={24} className="text-emerald-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Gastos</p>
                  <h3 className="text-2xl font-bold text-red-400">
                    -€{totalExpenses.toFixed(2)}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center">
                  <ArrowDownRight size={24} className="text-red-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Balance</p>
                  <h3
                    className={`text-2xl font-bold ${
                      user?.balance >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    €{user?.balance.toFixed(2)}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
                  <Calendar size={24} className="text-blue-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar movimientos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100 placeholder-slate-400"
                  />
                  <Search
                    size={18}
                    className="absolute left-3 top-2.5 text-slate-400"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "Todas las categorías" : category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="income">Ingresos</option>
                  <option value="expense">Gastos</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Lista de movimientos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-slate-100">
                Movimientos ({filteredTransactions.length})
              </h2>
            </div>

            <div className="divide-y divide-slate-700">
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 hover:bg-slate-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl">
                        {transaction.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-slate-100">
                            {transaction.description}
                          </h3>
                          {transaction.status === "pending" && (
                            <span className="px-2 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 text-xs rounded-full">
                              Pendiente
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                          <span>{transaction.category}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {transaction.date} • {transaction.time}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p
                          className={`text-lg font-semibold ${
                            transaction.type === "income"
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : ""}€
                          {Math.abs(transaction.amount).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Eye size={16} className="text-slate-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Edit size={16} className="text-slate-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteMovement(transaction)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredTransactions.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                  <Search size={24} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">
                  No se encontraron movimientos
                </h3>
                <p className="text-slate-400">
                  Intenta ajustar los filtros o el término de búsqueda
                </p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
