import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { getCategoriesData } from "../services/categoriesService";
import { addBudget } from "../services/budgetService";

export default function AddBudgetModal({ isOpen, onClose, onAdd }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);

  const [form, setForm] = useState({
    name: "",
    period: "monthly",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    totalBudget: 0,
    categories: [],
  });

  useEffect(() => {
    if (!isOpen) return;
    async function fetchCategories() {
      try {
        const res = await getCategoriesData();
        setCategoriesList(res || []);
      } catch (err) {
        console.error("Error cargando categorías", err);
      }
    }
    fetchCategories();
  }, [isOpen]);
  if (!isOpen) return;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log(form);
      const res = await addBudget(form);
      console.log(res);

      if (res.success) {
        onAdd(res.budget);
        onClose();
      } else {
        setError(res.message || "Error al crear presupuesto");
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };
  const addCategory = () => {
    setForm({
      ...form,
      categories: [
        ...form.categories,
        { categoryID: "", budget: 0, color: "#6b7280" },
      ],
    });
  };
  const updateCategory = (index, key, value) => {
    const updated = [...form.categories];
    updated[index][key] = value;
    setForm({ ...form, categories: updated });
  };

  const removeCategory = (index) => {
    const updated = [...form.categories];
    updated.splice(index, 1);
    setForm({ ...form, categories: updated });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          Nuevo Presupuesto
        </h2>

        {error && <p className="text-red-400 mb-2">{error}</p>}

        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* Datos principales */}
          <input
            type="text"
            placeholder="Nombre del presupuesto"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 rounded-lg bg-slate-700 text-slate-100 border border-slate-600"
            required
          />

          <select
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value })}
            className="w-full p-2 rounded-lg bg-slate-700 text-slate-100 border border-slate-600"
          >
            <option value="monthly">Mensual</option>
            <option value="weekly">Semanal</option>
            <option value="yearly">Anual</option>
          </select>

          <label className="block text-slate-300 text-sm">
            Presupuesto total
          </label>
          <input
            type="number"
            placeholder="Ej: 800"
            value={form.totalBudget}
            onChange={(e) =>
              setForm({ ...form, totalBudget: Number(e.target.value) })
            }
            className="w-full p-2 rounded-lg bg-slate-700 text-slate-100 border border-slate-600"
            required
          />

          <label className="block text-slate-300 text-sm">Año</label>
          <input
            type="number"
            placeholder="Ej: 2025"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            className="w-full p-2 rounded-lg bg-slate-700 text-slate-100 border border-slate-600"
            required
          />

          {/* Categorías */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-200 font-semibold">Categorías</h3>
              <button
                type="button"
                onClick={addCategory}
                className="flex items-center px-3 py-1 bg-emerald-500 rounded-lg text-white text-sm hover:bg-emerald-600"
              >
                <Plus size={14} className="mr-1" /> Agregar
              </button>
            </div>

            {form.categories.map((cat, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-slate-700 p-3 rounded-lg"
              >
                {/* Selección de categoría */}
                <select
                  value={cat.categoryID}
                  onChange={(e) =>
                    updateCategory(index, "categoryID", e.target.value)
                  }
                  className="flex-1 p-2 rounded bg-slate-600 text-slate-100"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categoriesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* Presupuesto */}
                <div className="flex flex-col">
                  <label className="text-xs text-slate-400">Presupuesto</label>
                  <input
                    type="number"
                    placeholder="Ej: 200"
                    value={cat.budget}
                    onChange={(e) =>
                      updateCategory(index, "budget", Number(e.target.value))
                    }
                    className="w-28 p-2 rounded bg-slate-600 text-slate-100"
                    required
                  />
                </div>

                {/* Color */}
                <input
                  type="color"
                  value={cat.color}
                  onChange={(e) =>
                    updateCategory(index, "color", e.target.value)
                  }
                  className="w-12 h-10 rounded cursor-pointer"
                />

                {/* Eliminar */}
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-600 text-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
