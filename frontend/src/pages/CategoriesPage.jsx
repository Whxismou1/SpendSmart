import { motion } from "framer-motion";
import { Edit, Menu, Search, Tag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getCategoriesData } from "../services/categoriesService";

// const mockCategories = [
//   {
//     id: 1,
//     name: "Alimentación",
//     color: "#ef4444",
//     icon: "🍔",
//     budget: 400,
//     spent: 285.5,
//   },
//   {
//     id: 2,
//     name: "Transporte",
//     color: "#3b82f6",
//     icon: "🚗",
//     budget: 200,
//     spent: 150.0,
//   },
//   {
//     id: 3,
//     name: "Entretenimiento",
//     color: "#8b5cf6",
//     icon: "🎬",
//     budget: 100,
//     spent: 75.99,
//   },
//   {
//     id: 4,
//     name: "Salud",
//     color: "#10b981",
//     icon: "🏥",
//     budget: 150,
//     spent: 45.0,
//   },
//   {
//     id: 5,
//     name: "Educación",
//     color: "#f59e0b",
//     icon: "📚",
//     budget: 300,
//     spent: 120.0,
//   },
//   {
//     id: 6,
//     name: "Ropa",
//     color: "#ec4899",
//     icon: "👕",
//     budget: 200,
//     spent: 89.99,
//   },
// ];

export default function CategoriesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategoriesSummary() {
      const data = await getCategoriesData();
      setCategories(data);
      console.log(data);
    }

    fetchCategoriesSummary();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Sidebar />

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
              <h1 className="text-xl font-bold text-slate-100">Categorías</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar categorías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-64 text-slate-100 placeholder-slate-400"
                />
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-slate-400"
                />
              </div>

              {/* <button className="px-4 py-2 gradient-primary rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center space-x-2">
                <Plus size={16} />
                <span>Nueva Categoría</span>
              </button> */}
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:bg-slate-750 transition-all"
              >
                {/* Header categoría */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: category.color + "20" }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100">
                        {category.name}
                      </h3>
                      {category.budget > 0 ? (
                        <p className="text-sm text-slate-400">
                          Presupuesto: €{category.budget}
                        </p>
                      ) : (
                        <p className="text-sm text-slate-400">
                          No hay presupuesto asignado
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Botones solo si no es por defecto */}
                  {!category.isDefault && (
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <Edit size={16} className="text-slate-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Gastos y barra */}
                <div className="space-y-2">
                  {/* Mostrar siempre lo gastado */}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Gastado</span>
                    <span className="text-slate-100 font-medium">
                      €{category.spent.toFixed(2)}
                    </span>
                  </div>

                  {/* Mostrar barra y porcentaje solo si hay presupuesto */}
                  {category.budget > 0 && (
                    <>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: category.color,
                            width: `${Math.min(
                              (category.spent / category.budget) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">
                          {((category.spent / category.budget) * 100).toFixed(
                            1
                          )}
                          % usado
                        </span>
                        <span className="text-slate-400">
                          €{(category.budget - category.spent).toFixed(2)}{" "}
                          restante
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mensajes si no hay categorías */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Tag size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                Aún no tienes categorías
              </h3>
            </div>
          )}
          {filteredCategories.length === 0 && searchTerm.length > 0 && (
            <div className="text-center py-12">
              <Tag size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                No se encontraron categorías
              </h3>
              <p className="text-slate-400">
                Intenta con un término de búsqueda diferente
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
