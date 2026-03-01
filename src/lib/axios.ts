import axios from "axios";

// Creamos la instancia apuntando al puerto correcto (5000)
export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token automáticamente a cada petición
api.interceptors.request.use((config) => {
  // Verificamos que estamos en el navegador
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
    // Si el servidor dice "401 Unauthorized" (Token vencido o inválido)
    if (error.response && error.response.status === 401) {
      
      if (typeof window !== "undefined") {
        console.warn("Sesión inválida o expirada. Cerrando sesión automáticamente...");

        // 1. Limpieza profunda del navegador
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("auth-storage"); // Borra el caché de Zustand

        // 2. Redirección forzada al Login (si no estamos ya ahí)
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login"; // Esto recarga la página y limpia el estado de memoria
        }
      }
    }
    return Promise.reject(error);
  }
);