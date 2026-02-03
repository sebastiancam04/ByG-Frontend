import axios from "axios";
import { SolicitudResumen, SolicitudDetalle, UpdateEstadoDto } from "@/types/solicitudes";
import { useAuthStore } from "@/stores/auth.store";

// Asegúrate de que el puerto sea el correcto (5064 según tu backend)
const API_URL = "http://localhost:5064/api/solicitudes";

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const solicitudesService = {
  // 1. Panel Bodega (Esta es la función que te estaba fallando)
  getAllBodega: async (): Promise<SolicitudResumen[]> => {
    const response = await axios.get(`${API_URL}/bodega/todas`, getAuthHeaders());
    return response.data;
  },

  // 2. Ver Detalle con Items
  getById: async (id: number): Promise<SolicitudDetalle> => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  },

  // 3. Actualizar Estado
  updateEstado: async (id: number, estado: string): Promise<void> => {
    const data: UpdateEstadoDto = { nuevoEstado: estado };
    await axios.patch(`${API_URL}/${id}/estado`, data, getAuthHeaders());
  }
};