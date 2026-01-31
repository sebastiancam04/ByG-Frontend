import axios from "axios";
import { LoginDto, LoginResponseDto } from "@/types/auth";
import { useAuthStore } from "@/stores/auth.store";

// Asegúrate de que el puerto sea el correcto (5064 según tu backend)
const API_URL = "http://localhost:5064/api/auth";

export const authService = {
  // 1. Iniciar Sesión
  login: async (credentials: LoginDto): Promise<LoginResponseDto> => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  },

  // 2. Solicitar Código
  requestRecovery: async (email: string): Promise<void> => {
    // La ruta correcta en tu backend es 'recover-password'
    await axios.post(`${API_URL}/recover-password`, { correo: email });
  },

  // 3. Restablecer Contraseña (AQUÍ ESTÁ LA CORRECCIÓN)
  resetPassword: async (data: { correo: string; codigo: string; nuevaPassword: string }): Promise<void> => {
    
    // ⚠️ TRADUCCIÓN DE DATOS: Frontend -> Backend
    const payload = {
        Correo: data.correo,
        Token: data.codigo,          // El backend espera "Token", nosotros tenemos "codigo"
        NuevaPassword: data.nuevaPassword // El backend espera "NuevaPassword"
    };
    
    // Enviamos el objeto 'payload' que ya tiene los nombres correctos
    await axios.post(`${API_URL}/reset-password`, payload);
  }
};