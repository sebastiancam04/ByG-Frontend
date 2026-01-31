export interface LoginDto {
  Correo: string;
  Password: string;
}

// ✅ IMPORTANTE: Todo en minúscula para coincidir con tu Backend y Frontend
export interface UsuarioDto {
  nombres: string;
  apellidoPaterno: string;
  rol: string;
  correo: string;
  rut?: string; // Opcional
}

export interface LoginResponseDto {
  mensaje: string;
  usuario: UsuarioDto;
  token: string;
  refreshToken: string;
}