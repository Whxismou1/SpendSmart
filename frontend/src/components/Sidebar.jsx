import {
  Coins,
  CreditCard,
  FileChartColumn,
  Home,
  LogOut,
  PieChart,
  Settings,
  TrendingUp,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";
import useAuthStore from "../stores/authStore";

// eslint-disable-next-line react/prop-types
export default function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) =>
    currentPath === path || currentPath.startsWith(path + "/");

  const logout = useAuthStore((state) => state.logout);
  const handleLogOut = async () => {
    try {
      await logout();
      navigate("/");
      toast.success("Has cerrado sesión correctamente");
    } catch {
      toast.error("Error al cerrar sesion");
    }
  };

  const links = [
    { to: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    {
      to: "/movements",
      icon: <CreditCard size={20} />,
      label: "Transacciones",
    },
    {
      to: "/categories",
      icon: <PieChart size={20} />,
      label: "Categorías",
    },
    {
      to: "/market",
      icon: <Coins size={20} />,
      label: "Mercado",
    },
    {
      to: "/budgets",
      icon: <FileChartColumn size={20} />,
      label: "Presupuestos",
    },
    { to: "/profile", icon: <Settings size={20} />, label: "Mi Perfil" },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-100">
              Spend Smart
            </span>
          </div>
          <button
            className="lg:hidden text-slate-400 hover:text-slate-100"
            onClick={toggleSidebar}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex flex-col">
          {links.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive(to)
                  ? "bg-slate-700 text-slate-100"
                  : "text-slate-400 hover:bg-slate-700 hover:text-slate-100"
              }`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <button
            onClick={handleLogOut}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors w-full"
          >
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
