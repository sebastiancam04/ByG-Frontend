import { api } from "@/lib/axios";
import { User, CreateUserDto } from "@/types/users";

interface BackendUser {
  id: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

export const usersService = {
  // Obtiene la lista completa de usuarios desde el servidor y estandariza el formato de las propiedades
  async getAll(): Promise<User[]> {
    const { data } = await api.get<BackendUser[]>("/Users");
    
    return data.map((u) => ({
      id: u.id as unknown as number,
      nombres: u.firstName || u.userName || "Sin Nombre",
      apellidos: u.lastName || "",
      correo: u.email || "",
      rol: u.role || "Solicitante",
      activo: u.isActive ?? true,
    }));
  },

  // Obtiene la informacion detallada de un usuario especifico mediante su identificador
  async getById(id: string | number): Promise<User> {
    const { data } = await api.get<User>(`/Users/${id}`);
    return data;
  },

  // Registra las credenciales y datos de un nuevo usuario en el sistema
  async create(user: CreateUserDto): Promise<User> {
    const { data } = await api.post<User>("/Users", user);
    return data;
  },

  // Modifica la informacion o el estado de un usuario previamente registrado
  async update(id: string | number, user: Partial<CreateUserDto>): Promise<void> {
    await api.put(`/Users/${id}`, user);
  },

  // Elimina de forma permanente el registro de un usuario en la base de datos
  async delete(id: string | number): Promise<void> {
    await api.delete(`/Users/${id}`);
  },
};