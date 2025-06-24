import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
export const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/20 relative z-10">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center ">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Spend Smart</span>
        </div>

        <p className="text-gray-400 mb-4">
          © 2025 Spend Smart. Todos los derechos reservados.
        </p>

        <div className="flex justify-center space-x-6 text-sm text-gray-400">
          <Link
            className="hover:text-emerald-400 transition-colors"
            to="/privacy"
          >
            Privacidad
          </Link>
          <Link
            className="hover:text-emerald-400 transition-colors"
            to="/terms"
          >
            Términos
          </Link>
          <Link
            className="hover:text-emerald-400 transition-colors"
            to="/support"
          >
            Soporte
          </Link>
        </div>
      </div>
    </footer>
  );
};
