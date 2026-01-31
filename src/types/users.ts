export interface User {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rut: string;
  correo: string;
  telefono?: string;
  rol: string;
  activo: boolean;
}

export interface CreateUserDto {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rut: string;
  correo: string;
  password?: string; // Opcional en el frontend para reutilizar el tipo
  rol: string;
  telefono?: string;
}

// Para editar, usamos una estructura parcial (todos los campos opcionales)
export type UpdateUserDto = Partial<CreateUserDto>;