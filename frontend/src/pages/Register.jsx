import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { FormControl, Select, MenuItem } from "@mui/material";
import EuroIcon from "@mui/icons-material/Euro";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: null,
    currency: "",
  });

  const handleBirthDateChange = (date) => {
    setFormData((prev) => ({ ...prev, birthDate: date }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Contraselas diferentes");
      return;
    }
    console.log(formData)

    setIsLoading(true);
    setError("");
    try {
      await register(
        formData.email,
        formData.name,
        formData.password,
        formData.confirmPassword,
        formData.birthDate,
        formData.currency
      );
      navigate("/verify-email");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver al inicio</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-white mb-6">
            Crear Cuenta
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Nombre completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Fecha de nacimiento
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={formData.birthDate}
                  onChange={handleBirthDateChange}
                  maxDate={dayjs()}
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      color: "white",
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&.Mui-focused": {
                        borderColor: "#10b981",
                        boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                      padding: "12px 16px",
                    },
                    "& .MuiIconButton-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                      "&:hover": {
                        color: "white",
                      },
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "& .MuiFormLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                      "&.Mui-focused": {
                        color: "#10b981",
                      },
                    },
                  }}
                  slotProps={{
                    popper: {
                      sx: {
                        "& .MuiPaper-root": {
                          backgroundColor: "rgba(30, 30, 30, 0.95)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          "& .MuiTypography-root": {
                            color: "white",
                          },
                          "& .MuiPickersDay-root": {
                            color: "white",
                            "&:hover": {
                              backgroundColor: "rgba(16, 185, 129, 0.2)",
                            },
                            "&.Mui-selected": {
                              backgroundColor: "#10b981",
                              "&:hover": {
                                backgroundColor: "#059669",
                              },
                            },
                          },
                          "& .MuiPickersCalendarHeader-root": {
                            "& .MuiTypography-root": {
                              color: "white",
                            },
                            "& .MuiIconButton-root": {
                              color: "white",
                            },
                          },
                          "& .MuiDayCalendar-weekDayLabel": {
                            color: "rgba(255, 255, 255, 0.7)",
                          },
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Moneda
              </label>
              <FormControl
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": {
                      color: "#10b981",
                    },
                  },
                  "& .MuiSelect-select": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "white",
                    padding: "12px 16px",
                    "&:hover": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&.Mui-focused": {
                      borderColor: "#10b981",
                      boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiSelect-icon": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              >
                <Select
                  value={formData.currency}
                  onChange={handleChange}
                  displayEmpty
                  name="currency"
                  required
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: "rgba(30, 30, 30, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        "& .MuiMenuItem-root": {
                          color: "white",
                          "&:hover": {
                            backgroundColor: "rgba(16, 185, 129, 0.2)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "rgba(16, 185, 129, 0.3)",
                            "&:hover": {
                              backgroundColor: "rgba(16, 185, 129, 0.4)",
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                      Selecciona tu moneda
                    </span>
                  </MenuItem>
                  <MenuItem value="EUR">
                    <EuroIcon style={{ marginRight: 8 }} /> Euro (EUR)
                  </MenuItem>
                  <MenuItem value="USD">
                    <AttachMoneyIcon style={{ marginRight: 8 }} /> Dólar (USD)
                  </MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg text-white font-medium hover:from-emerald-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-70"
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </button>
            </div>
          </form>

          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/login"
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
