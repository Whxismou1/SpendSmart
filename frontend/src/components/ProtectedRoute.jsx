import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { useEffect } from "react";

export default function ProtectedRoute() {
  const { user, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
