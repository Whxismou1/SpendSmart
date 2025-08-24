import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, TrendingUp } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams, useNavigate } from "react-router-dom";
import { resetPassword, validateResetToken } from "../services/authService";
import { useEffect } from "react";
export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isTokenValid, setIsTokenValid] = useState(null);

  const { token } = useParams();
  useEffect(() => {
    const checkToken = async () => {
      const valid = await validateResetToken(token);
      setIsTokenValid(valid);

      if (!valid) {
        navigate("/NotFound");
      }
    };
    if (token) checkToken();
  }, [token, navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.confirmPassword !== formData.password) {
      toast("Las contraseñas no coinciden!", {
        icon: "⚠️",
      });
    }

    try {
      await resetPassword(formData.password, token);
      setIsSuccess(true);
    } catch {
      toast.error("Algo ha ido mal");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isTokenValid === null) {
    return;
  }


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
            to="/login"
            className="flex items-center gap-2 text-white hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver a inicio de sesión</span>
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

          {!isSuccess ? (
            <>
              <h1 className="text-3xl font-bold text-center text-white mb-2">
                Restablecer contraseña
              </h1>
              <p className="text-gray-300 text-center mb-6">
                Ingresa tu nueva contraseña para continuar.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Nueva contraseña
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
                    Confirmar nueva contraseña
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

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg text-white font-medium hover:from-emerald-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-70"
                  >
                    {isLoading ? "Restableciendo..." : "Restablecer contraseña"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                {/* <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div> */}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                ¡Contraseña restablecida!
              </h2>
              <p className="text-gray-300 mb-6">
                Tu contraseña ha sido restablecida correctamente. Ya puedes
                iniciar sesión con tu nueva contraseña.
              </p>
              <Link
                to="/login"
                className="inline-block py-3 px-6 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg text-white font-medium hover:from-emerald-600 hover:to-blue-700 transition-all"
              >
                Iniciar sesión
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
