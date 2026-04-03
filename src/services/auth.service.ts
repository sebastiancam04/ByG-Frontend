import { api } from "@/lib/axios";
import { LoginResponse } from "@/types/auth";

export const authService = {
  async login(correo: string, password: string): Promise<LoginResponse> {
    // Coincide con [HttpPost("login")] en AuthController.cs
    const { data } = await api.post<LoginResponse>("/Auth/login", {
      correo,
      password,
    });
    return data;
  },

  async refreshToken(token: string, refreshToken: string) {
    // Coincide con [HttpPost("refresh")] en AuthController.cs
    const { data } = await api.post("/Auth/refresh", {
      token,
      refreshToken,
    });
    return data;
  },

  async requestPasswordReset(correo: string) {
    // Coincide con [HttpPost("forgot-password")] en AuthController.cs
    const { data } = await api.post("/Auth/forgot-password", { correo });
    return data;
  },

  async resetPassword(payload: { correo: string; codigo: string; nuevaPassword: string }) {
    // Coincide con [HttpPost("reset-password")] en AuthController.cs
    const { data } = await api.post("/Auth/reset-password", payload);
    return data;
  },

  getPerfil: async () => {
    // Coincide con [HttpGet("perfil")] en AuthController.cs
    const response = await api.get<LoginResponse>("/Auth/perfil");
    return response.data;
  },
};