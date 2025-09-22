import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
      
      updateUser: (updatedUser) => set({ 
        user: { ...get().user, ...updatedUser } 
      }),
    }),
    {
      name: "user-storage", // name for localStorage
      // Only store token in localStorage, not the entire user object
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export default useUserStore;