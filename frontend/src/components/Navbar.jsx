import { TrendingUp } from "lucide-react";

import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <motion.header
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="relative z-10 p-6"
  >
    <nav className="flex justify-between items-center max-w-7xl mx-auto">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>

        <span className="text-xl font-bold">Spend Smart</span>
      </div>

      <div className="hidden md:flex space-x-8">
        <Link to="#features" className="hover:text-primary transition-colors">
          Características
        </Link>
        <Link to="/about" className="hover:text-primary transition-colors">
          Acerca de
        </Link>
        <Link to="/contact" className="hover:text-primary transition-colors">
          Contacto
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-all"
          component={Link}
          to="/login"
          variant="contained"
        >
          Login
        </Button>
        <Button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg hover:from-emerald-600 hover:to-blue-700 transition-all" component={Link} to="/register" variant="contained">
          Register
        </Button>
      </div>
    </nav>
    </motion.header>
  );
};
