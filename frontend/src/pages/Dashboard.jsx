import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, DollarSign, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getDashboardSummary } from "../services/movementService";
import Chart from "react-apexcharts";
// import useAuthStore from "../stores/authStore";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [summary, setSummary] = useState(null);
  const [recentMovements, setRecentMovements] = useState([]);
  const [range, setRange] = useState("month"); // "week", "month", "year"

  // const user = useAuthStore((state) => state.user);

  useEffect(() => {
    async function fetchDashboardSummary() {
      const data = await getDashboardSummary();
      setSummary(data.summary);
      setRecentMovements(data.recentMovements);
    }

    fetchDashboardSummary();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getFilteredMovements = () => {
    const now = new Date();

    if (range === "week") {
      const startOfWeek = new Date();
      startOfWeek.setDate(now.getDate() - now.getDay());
      return recentMovements.filter((m) => new Date(m.date) >= startOfWeek);
    }

    if (range === "month") {
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      return recentMovements.filter((m) => {
        const d = new Date(m.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
    }

    if (range === "year") {
      const currentYear = now.getFullYear();
      return recentMovements.filter(
        (m) => new Date(m.date).getFullYear() === currentYear
      );
    }
    return recentMovements;
  };

  const getApexChartData = () => {
    const filtered = getFilteredMovements();

    // Agrupar por fecha y sumar gastos
    const grouped = {};
    filtered.forEach((m) => {
      if (m.type === "expense") {
        const dateStr = new Date(m.date).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
        });
        if (!grouped[dateStr]) grouped[dateStr] = 0;
        grouped[dateStr] += m.amount;
      }
    });

    const categories = Object.keys(grouped).reverse();
    const data = Object.values(grouped).reverse();

    return {
      series: [
        {
          name: "Gastos",
          data: data,
        },
      ],
      options: {
        chart: {
          id: "expenses-chart",
          toolbar: { show: false },
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              colors: "#fff", 
              fontSize: "12px",
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#fff", 
              fontSize: "12px",
            },
          },
        },
        stroke: { curve: "smooth" },
        fill: {
          type: "gradient",
          gradient: { shadeIntensity: 1, opacityFrom: 0.6, opacityTo: 0.1 },
        },
        colors: ["#ef4444"], 
        tooltip: {
          y: { formatter: (val) => `€${val.toFixed(2)}` },
          theme: "dark", 
        },
        grid: {
          borderColor: "#374151", 
        },
      },
    };
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
                    €{summary?.balance}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500 bg-opacity-20 flex items-center justify-center">
                  <DollarSign size={20} className="text-emerald-400" />
                </div>
              </div>
              <div className="flex items-center text-emerald-400">
                <ArrowUpRight size={16} />
                <span className="text-sm ml-1">
                  {summary?.variations.balance}% desde el mes pasado
                </span>
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
                    €{summary?.incomes}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500 bg-opacity-20 flex items-center justify-center">
                  <ArrowUpRight size={20} className="text-emerald-400" />
                </div>
              </div>
              <div className="flex items-center text-emerald-400">
                <ArrowUpRight size={16} />
                <span className="text-sm ml-1">
                  {summary?.variations.incomes}% desde el mes pasado
                </span>
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
                  <h3 className="text-2xl font-bold text-slate-100">
                    €{summary?.expenses}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center">
                  <ArrowDownRight size={20} className="text-red-400" />
                </div>
              </div>
              <div className="flex items-center text-red-400">
                <ArrowDownRight size={16} />
                <span className="text-sm ml-1">
                  {summary?.variations.expenses}% desde el mes pasado
                </span>
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
                  <button
                    className={`px-3 py-1 text-sm rounded-lg ${
                      range === "week"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                    }`}
                    onClick={() => setRange("week")}
                  >
                    Semana
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-lg ${
                      range === "month"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                    }`}
                    onClick={() => setRange("month")}
                  >
                    Mes
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-lg ${
                      range === "year"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                    }`}
                    onClick={() => setRange("year")}
                  >
                    Año
                  </button>
                </div>
              </div>

              <div className="h-64 rounded-lg p-2">
                <Chart
                  options={getApexChartData().options}
                  series={getApexChartData().series}
                  type="area"
                  height={300}
                />
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
                  to="/movements"
                  className="text-sm hover:underline text-emerald-400"
                >
                  Ver todas
                </Link>
              </div>

              <div className="space-y-4">
                {recentMovements.slice(0, 4).map((transaction) => (
                  <div
                    key={transaction?._id}
                    className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-lg">
                        {transaction?.category.icon}
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">
                          {transaction?.description}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(transaction?.date).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}
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
        </main>
      </div>
    </div>
  );
}
