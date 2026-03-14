import { api } from "@/lib/axios";
import { LoginResponse } from "@/types/auth";

export const authService = {
  async login(correo: string, password: string): Promise<LoginResponse> {
    // CAMBIO: Se usa "/Auth/login" con A mayúscula para coincidir con el controlador .NET
    const { data } = await api.post<LoginResponse>("/Auth/login", {
      correo,
      password,
    });
    return data;
  },

  async refreshToken(token: string, refreshToken: string) {
    const { data } = await api.post("/Auth/refresh", {
      token,
      refreshToken,
    });
    return data;
  },

  async requestPasswordReset(correo: string) {
    const { data } = await api.post("/Auth/forgot-password", { correo });
    return data;
  },

  async resetPassword(payload: { correo: string; codigo: string; nuevaPassword: string }) {
    const { data } = await api.post("/Auth/reset-password", payload);
    return data;
  },

  getPerfil: async () => {
    const response = await api.get<LoginResponse>("/Auth/perfil");
    return response.data;
  },
};