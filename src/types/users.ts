
export interface User {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: string;
  activo: boolean;
}

export interface CreateUserDto {
  nombres: string;
  apellidos: string;
  correo: string;
  rol: string;
  activo: boolean;
  password?: string;
}