import { Home } from "lucide-react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";

// Main NotFound Component
export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Animation/Icon */}
          <div className="mb-8">
            <div className="relative">
              <div className="text-9xl font-bold text-transparent bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text mb-4">
                404
              </div>
              {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mb-10">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500/20 to-blue-600/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <AlertCircle className="w-12 h-12 text-emerald-400" />
                </div>
              </div> */}
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¡Oops! Página no encontrada
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              La página que estás buscando no existe o ha sido movida.
            </p>
            <p className="text-gray-400">
              No te preocupes, te ayudamos a encontrar lo que necesitas.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGoHome}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Ir al inicio
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
