import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

import { addMovement } from "../services/movementService";

// eslint-disable-next-line react/prop-types
export default function AddMovementModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    movementDescription: "",
    quantity: "",
    movementCategory: "Alimentación",
    movementType: "expense",
    movementDate: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMovement = {
      description: formData.movementDescription,
      amount:
        formData.movementType === "expense"
          ? -Math.abs(Number(formData.quantity))
          : Math.abs(Number(formData.quantity)),
      date: formData.movementDate,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      category: formData.movementCategory,
      type: formData.movementType,
    };

    console.log(newMovement);
    await addMovement(newMovement)
    onAdd(newMovement);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Nuevo Movimiento</h2>
          <button onClick={onClose}>
            <X className="text-slate-400 hover:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="movementDescription"
            value={formData.movementDescription}
            onChange={handleChange}
            placeholder="Descripción"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
            required
          />

          <input
            type="number"
            name="quantity"
            min={0}
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Cantidad (€)"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
            required
          />

          <select
            name="movementCategory"
            value={formData.movementCategory}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
          >
            <option>Alimentación</option>
            <option>Transporte</option>
            <option>Entretenimiento</option>
            <option>Salud</option>
            <option>Ingresos</option>
            <option>Transferencias</option>
            <option>Otro</option>
          </select>

          <select
            name="movementType"
            value={formData.movementType}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
          >
            <option value="income">Ingreso</option>
            <option value="expense">Gasto</option>
          </select>

          <input
            type="date"
            name="movementDate"
            value={formData.movementDate}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
          />

          <button
            type="submit"
            className="w-full py-2 bg-emerald-500 rounded-lg text-white font-medium hover:bg-emerald-600"
          >
            Añadir Movimiento
          </button>
        </form>
      </motion.div>
    </div>
  );
}
