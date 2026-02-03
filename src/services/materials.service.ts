import { api } from "@/lib/axios";

export interface Material {
  id: number;
  nombre: string;
  codigo: string;
  unidadMedida: string; // ✅ CORREGIDO: Antes era 'unidad'
  stock: number;        // ✅ CORREGIDO: Antes era 'stockActual'
}

export const materialsService = {
  search: async (query: string = ""): Promise<Material[]> => {
    const response = await api.get(`/materials?search=${query}`);
    return response.data;
  }
};