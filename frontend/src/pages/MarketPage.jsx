import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Coins,
  Menu,
  Search,
  Star
} from "lucide-react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

const API_KEY_FINNHUB = import.meta.env.VITE_FINNHUB_API_KEY;

// Mock data para criptomonedas y acciones
const mockMarketData = [
  {
    id: 1,
    symbol: "BTC",
    name: "Bitcoin",
    price: 43250.5,
    change: 2.45,
    changePercent: 5.67,
    icon: "₿",
    type: "crypto",
  },
  {
    id: 2,
    symbol: "ETH",
    name: "Ethereum",
    price: 2650.75,
    change: -45.2,
    changePercent: -1.68,
    icon: "Ξ",
    type: "crypto",
  },
  {
    id: 3,
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 185.92,
    change: 3.45,
    changePercent: 1.89,
    icon: "🍎",
    type: "stock",
  },
  {
    id: 4,
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.56,
    change: -2.34,
    changePercent: -1.62,
    icon: "🔍",
    type: "stock",
  },
  {
    id: 5,
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 248.42,
    change: 12.67,
    changePercent: 5.37,
    icon: "🚗",
    type: "stock",
  },
  {
    id: 6,
    symbol: "ADA",
    name: "Cardano",
    price: 0.52,
    change: 0.03,
    changePercent: 6.12,
    icon: "₳",
    type: "crypto",
  },
];

export default function MarketPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([1, 3]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const filteredData = mockMarketData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "crypto" && item.type === "crypto") ||
      (selectedTab === "stocks" && item.type === "stock") ||
      (selectedTab === "favorites" && favorites.includes(item.id));
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Sidebar */}
      <Sidebar/>

      {/* Contenido principal */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-surface-dark border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                className="lg:hidden text-text-muted hover:text-text-dark"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold">Market Overview</h1>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Buscar activos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
              />
              <Search
                size={18}
                className="absolute left-3 top-2.5 text-text-muted"
              />
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="p-4 md:p-6">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-6 w-fit"
          >
            {[
              { id: "all", label: "Todos" },
              { id: "crypto", label: "Criptomonedas" },
              { id: "stocks", label: "Acciones" },
              { id: "favorites", label: "Favoritos" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTab === tab.id
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text-dark hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Lista de activos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-text-dark">
                Precios en Tiempo Real
              </h2>
              <p className="text-sm text-text-muted">
                Información actualizada cada 30 segundos
              </p>
            </div>

            <div className="divide-y divide-white/10">
              {filteredData.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleFavorite(asset.id)}
                        className={`p-1 rounded transition-colors ${
                          favorites.includes(asset.id)
                            ? "text-warning"
                            : "text-text-muted hover:text-warning"
                        }`}
                      >
                        <Star
                          size={16}
                          fill={
                            favorites.includes(asset.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                          {asset.icon}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-text-dark">
                              {asset.symbol}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                asset.type === "crypto"
                                  ? "bg-primary/20 text-primary"
                                  : "bg-secondary/20 text-secondary"
                              }`}
                            >
                              {asset.type === "crypto" ? "CRYPTO" : "STOCK"}
                            </span>
                          </div>
                          <p className="text-sm text-text-muted">
                            {asset.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-text-dark">
                        ${asset.price.toLocaleString()}
                      </p>
                      <div
                        className={`flex items-center space-x-1 text-sm ${
                          asset.change >= 0 ? "text-success" : "text-error"
                        }`}
                      >
                        {asset.change >= 0 ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}
                        <span>
                          {asset.change >= 0 ? "+" : ""}
                          {asset.change.toFixed(2)} (
                          {asset.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredData.length === 0 && (
              <div className="p-8 text-center">
                <Coins size={48} className="mx-auto text-text-muted mb-4" />
                <h3 className="text-lg font-semibold text-text-dark mb-2">
                  No se encontraron activos
                </h3>
                <p className="text-text-muted">
                  Intenta con un término de búsqueda diferente o cambia de
                  categoría
                </p>
              </div>
            )}
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg"
          >
            <p className="text-sm text-warning">
              <strong>Aviso:</strong> Los precios mostrados son solo para fines
              informativos y pueden no reflejar los precios reales del mercado.
              Esta información no constituye asesoramiento financiero.
            </p>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
