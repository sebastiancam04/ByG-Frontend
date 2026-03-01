import { api } from "@/lib/axios"; // ✅ CORREGIDO: Importación con llaves
import { LoginResponse } from "@/types/auth";

export const authService = {
  async login(correo: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", {
      correo,
      password,
    });
    return data;
  },

  async refreshToken(token: string, refreshToken: string) {
    const { data } = await api.post("/auth/refresh", {
      token,
      refreshToken,
    });
    return data;
  },

  async requestPasswordReset(correo: string) {
    const { data } = await api.post("/auth/forgot-password", { correo });
    return data;
  },

  async resetPassword(payload: { correo: string; codigo: string; nuevaPassword: string }) {
    const { data } = await api.post("/auth/reset-password", payload);
    return data;
  },
  getPerfil: async () => {
    const response = await api.get<LoginResponse>("/auth/perfil");
    return response.data;
  },
};