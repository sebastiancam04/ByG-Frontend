import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5064/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Interceptor para INYECTAR el token automáticamente
api.interceptors.request.use((config) => {
  // Leemos el token directamente del estado de Zustand (más seguro)
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Interceptor para DETECTAR errores 401 (Token vencido/inválido)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Sesión expirada o token inválido. Cerrando sesión...");
      
      // Limpiamos el estado y el localStorage
      useAuthStore.getState().logout();
      
      // Redirigimos al login si no estamos ya ahí
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);