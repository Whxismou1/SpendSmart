import { create } from "zustand";

const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/auth";

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  error: null,

  fetchUser: async () => {
    try {
      const res = await fetch(BASE_URL + "/me", {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        set({ user: data.user, isLoading: false, error: null });
      } else {
        set({
          user: null,
          isLoading: false,
          error: data.message || "Not authenticated",
        });
      }
    } catch {
      set({ user: null, isLoading: false, error: "Error de conexión" });
    }
  },
  setUser: (user) => set({ user }),
  loginSuccess: (user) => set({ user, isLoading: false, error: null }),

  logout: async () => {
    try {
      await fetch(BASE_URL + "/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error en logout", err);
    } finally {
      set({ user: null, isLoading: false, error: null });
    }
  },
}));

export default useAuthStore;
