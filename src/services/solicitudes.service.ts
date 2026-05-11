import { api } from "@/lib/axios";
import {
  SolicitudResumen,
  SolicitudDetalle,
  UpdateEstadoDto,
  CreateSolicitudDto, // ✅ Importamos la nueva interfaz
} from "@/types/solicitudes";

export const solicitudesService = {
  // 1. Panel Bodega
  getAllBodega: async (): Promise<SolicitudResumen[]> => {
    const { data } = await api.get<SolicitudResumen[]>(
      "/solicitudes/bodega/todas",
    );
    return data;
  },

  // 2. Ver Detalle con Items
  getById: async (id: number): Promise<SolicitudDetalle> => {
    const { data } = await api.get<SolicitudDetalle>(`/solicitudes/${id}`);
    return data;
  },

  // 3. Actualizar Estado
  updateEstado: async (id: number, estado: string): Promise<void> => {
    const payload: UpdateEstadoDto = { nuevoEstado: estado };
    await api.patch(`/solicitudes/${id}/estado`, payload);
  },

  // 4. Crear nueva solicitud (Solicitante)
  // ✅ CORREGIDO: Reemplazamos 'any' por 'CreateSolicitudDto'
  create: async (payload: CreateSolicitudDto) => {
    const { data } = await api.post("/solicitudes", payload);
    return data;
  },
  getEspeciales: async (): Promise<SolicitudResumen[]> => {
    const { data } = await api.get<SolicitudResumen[]>(
      "/solicitudes/bodega/especiales",
    );
    return data;
  },
};
