import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginResponseDto, UsuarioDto } from '@/types/auth';

interface AuthState {
  token: string | null;
  user: UsuarioDto | null;
  isAuthenticated: boolean;
  login: (data: LoginResponseDto) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (data) => {
        console.log("💾 GUARDANDO EN STORE:", data.usuario); // Debug para ver qué se guarda
        set({ 
          token: data.token, 
          user: data.usuario, 
          isAuthenticated: true 
        });
      },
      logout: () => {
        console.log("👋 CERRANDO SESIÓN");
        // Borramos todo explícitamente
        localStorage.removeItem('auth-storage'); 
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // Nombre de la llave en LocalStorage
    }
  )
);