import { api } from "@/lib/axios"; // ✅ CORREGIDO
import { User, CreateUserDto } from "@/types/users";

// Interfaz auxiliar para lo que responde Identity (que a veces varía nombres)
interface BackendUser {
  id: number;
  userName?: string;
  nombres?: string;
  apellidos?: string;
  email?: string;
  correo?: string;
  rol?: string;
  activo?: boolean;
}

export const usersService = {
  // Obtener todos los usuarios
  async getAll(): Promise<User[]> {
    const { data } = await api.get<BackendUser[]>("/users");
    
    // Mapeo seguro sin 'any'
    return data.map((u) => ({
      id: u.id,
      nombres: u.nombres || u.userName || "Sin Nombre",
      apellidos: u.apellidos || "",
      correo: u.email || u.correo || "",
      rol: u.rol || "Solicitante",
      activo: u.activo ?? true,
    }));
  },

  // Obtener un usuario por ID
  async getById(id: number): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  // Crear usuario
  async create(user: CreateUserDto): Promise<User> {
    const { data } = await api.post<User>("/users", user);
    return data;
  },

  // Actualizar usuario
  async update(id: number, user: Partial<CreateUserDto>): Promise<void> {
    await api.put(`/users/${id}`, user);
  },

  // Eliminar usuario
  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};