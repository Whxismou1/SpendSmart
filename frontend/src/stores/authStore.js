import { create } from "zustand";

const authStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  login: () => set((state) => ({ bears: state.bears + 1 })),
  signUp: () => set({ bears: 0 }),
  logOut: (newBears) => set({ bears: newBears }),
}));

export default authStore;
