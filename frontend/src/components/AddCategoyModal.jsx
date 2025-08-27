import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { addSpecificCategory } from "../services/categoriesService";

const defaultIcons = [
  "🍔",
  "🚗",
  "🎬",
  "🏥",
  "📚",
  "👕",
  "💰",
  "🎉",
  "📱",
  "🏠",
];
// eslint-disable-next-line react/prop-types
export default function AddCategoyModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [icon, setIcon] = useState("💰");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log(name, color, icon);

      const newCategory = await addSpecificCategory(name, icon, color );
      console.log(newCategory.category);
      onAdd(newCategory.category);
      onClose();
      setName("");
      setColor("#3b82f6");
      setIcon("💰");
    } catch (err) {
      setError(err.message || "Error al crear la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-100">Nueva categoría</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
              placeholder="Ej: Alimentación"
              required
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-12 rounded cursor-pointer border border-slate-600"
            />
          </div>

          {/* Iconos */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">Icono</label>
            <div className="grid grid-cols-6 gap-2">
              {defaultIcons.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`p-2 text-2xl rounded-lg transition ${
                    icon === ic
                      ? "bg-emerald-500"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear categoría"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
