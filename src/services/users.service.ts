import axios from "axios";
import { User, CreateUserDto, UpdateUserDto } from "@/types/users";
import { useAuthStore } from "@/stores/auth.store";

// Asegúrate de que este puerto coincida con tu Backend (5064)
const API_URL = "http://localhost:5064/api/users"; 

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const usersService = {
  // 1. Listar
  getAll: async (): Promise<User[]> => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  },

  // 2. Crear
  create: async (data: CreateUserDto): Promise<User> => {
    const response = await axios.post(API_URL, data, getAuthHeaders());
    return response.data;
  },

  // 3. EDITAR (Nuevo)
  update: async (id: number, data: UpdateUserDto): Promise<void> => {
    await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
  },

  // 4. Eliminar
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  }
};