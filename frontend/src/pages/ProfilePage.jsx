import { motion } from "framer-motion";
import { Camera, Lock, Menu, User, Eye, EyeOff } from "lucide-react";
import { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import useAuthStore from "../stores/authStore";
import { changeProfilePicture } from "../services/user.service";
import { changePassword } from "../services/authService";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePfpChange = async (e) => {
    e.preventDefault();

    try {
      const file = fileInputRef.current.files[0];
      if (!file) {
        toast.error("Por favor, selecciona una imagen");
        return;
      }
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await changeProfilePicture(formData);
      console.log("Imagen subida con éxito:", response);
      setUser({
        ...user,
        profilePicture:
          response.profilePicture || response.user?.profilePicture,
      });

      toast.success("Foto de perfil actualizada");
    } catch (error) {
      toast.error("Error subiendo la imagen");
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );

      toast.success("Contraseña cambiada correctamente");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error("Error cambiando la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Contenido principal */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                className="lg:hidden text-slate-400 hover:text-slate-100"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-slate-100">Mi Perfil</h1>
            </div>

            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Foto de perfil"
                  className="object-cover w-full h-full"
                />
              ) : (
                <User size={48} className="text-white" />
              )}
            </div>
          </div>
        </header>

        {/* Contenido del perfil */}
        <main className="p-4 md:p-6 max-w-4xl mx-auto">
          {/* Foto de perfil */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6"
          >
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden gradient-primary flex items-center justify-center text-2xl font-bold text-white">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Foto de perfil"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    // Aquí un icono o placeholder, por ejemplo un icono de usuario o texto
                    <User size={48} className="text-white" />
                    // O también un placeholder genérico:
                    // <img src="https://via.placeholder.com/96" alt="Placeholder" />
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handlePfpChange}
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors"
                >
                  <Camera size={16} className="text-white" />
                </button>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-1 text-slate-100">
                  {user?.name}
                </h2>
                <p className="text-slate-400">{user?.email}</p>
                <p className="text-sm text-slate-400 mt-2">
                  Miembro desde{" "}
                  {new Date(user?.createdAt)
                    .toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                    })
                    .replace(/^\w/, (c) => c.toUpperCase())}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información personal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-slate-800 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center space-x-2 mb-6">
                <User size={20} className="text-emerald-400" />
                <h3 className="text-xl font-bold text-slate-100">
                  Información Personal
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-400 mb-1"
                  >
                    Nombre completo
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    disabled
                    value={user?.name || ""}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-400 mb-1"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Cambiar contraseña */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-slate-800 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Lock size={20} className="text-emerald-400" />
                <h3 className="text-xl font-bold text-slate-100">
                  Cambiar Contraseña
                </h3>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {["currentPassword", "newPassword", "confirmPassword"].map(
                  (field) => (
                    <div key={field} className="relative">
                      <label
                        htmlFor={field}
                        className="block text-sm font-medium text-slate-400 mb-1 capitalize"
                      >
                        {field === "currentPassword"
                          ? "Contraseña actual"
                          : field === "newPassword"
                          ? "Nueva contraseña"
                          : "Confirmar nueva contraseña"}
                      </label>
                      <input
                        id={field}
                        name={field}
                        type={showPassword[field] ? "text" : "password"}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPassword(field)}
                        className="absolute mt-3 right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword[field] ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  )
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 gradient-primary rounded-lg text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all flex items-center justify-center space-x-2"
                  disabled={isLoading}
                >
                  <Lock size={16} />
                  <span>
                    {isLoading ? "Actualizando..." : "Actualizar contraseña"}
                  </span>
                </button>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
