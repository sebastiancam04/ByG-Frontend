import axios from "axios";

// Leemos la URL desde las variables de entorno de Vercel (o usamos localhost de respaldo)
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: apiUrl, // ✅ Ahora es dinámico
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token automáticamente a cada petición
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor INTELIGENTE para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        console.warn("Sesión inválida o expirada. Cerrando sesión automáticamente...");

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("auth-storage"); 

        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);