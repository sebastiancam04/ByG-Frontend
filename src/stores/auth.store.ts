import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, LoginResponse, User } from "@/types/auth";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (response: LoginResponse) => {
        // Guardamos tokens
        localStorage.setItem("token", response.token);
        localStorage.setItem("refreshToken", response.refreshToken);

        // Creamos el objeto usuario
        const user: User = {
          id: response.id,
          nombres: response.usuario, // El backend envía 'usuario', nosotros lo guardamos como 'nombres'
          email: response.correo,
          rol: response.rol,
        };

        set({
          user,
          token: response.token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // ✅ AGREGADO: Implementación de setUser
      setUser: (user: User) => set({ user }),
    }),
    {
      name: "auth-storage",
    }
  )
);