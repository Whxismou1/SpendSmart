import { motion } from "framer-motion";
import { ArrowLeft, Mail, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";
function ForgotPasswordPage() {
  const [email, setEmail] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      
    } catch (error) {
      console.log(error)
    } finally{
      setIsLoading(false)
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

          {!isSubmitted ? (
            <>
              <h1 className="text-3xl font-bold text-center text-white mb-2">
                ¿Olvidaste tu contraseña?
              </h1>
              <p className="text-gray-300 text-center mb-6">
                Ingresa tu correo electrónico y te enviaremos un enlace para
                restablecer tu contraseña.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg text-white font-medium hover:from-emerald-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-70"
                  >
                    {isLoading
                      ? "Enviando..."
                      : "Enviar enlace de recuperación"}
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
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                ¡Correo enviado!
              </h2>
              <p className="text-gray-300 mb-6">
                Hemos enviado un enlace de recuperación a{" "}
                <span className="text-emerald-400 font-medium">{email}</span>.
                Por favor, revisa tu bandeja de entrada.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Volver a intentar
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
