import { api } from "@/lib/axios";

// --- Interfaces de Envío ---
export interface DetalleSolicitud {
  materialId: number | null;
  cantidad: number;
  nombreTemp?: string;
  nuevoNombre?: string;
  nuevoCodigo?: string;
  nuevaUnidad?: string;
  nuevaTalla?: string;
}

export interface CreateRequestDto {
  ordenCompra: string;
  proyecto: string;
  detalles: DetalleSolicitud[];
}

// --- Interfaces de Respuesta ---
export interface SolicitudResponse {
  id: number;
  folio: number;
  solicitante: string;
  ordenCompra: string;
  proyecto: string;
  estado: string;
  fechaCreacion: string;
  totalItems: number;
}

// ✅ NUEVO: Interfaces para el Detalle Completo
export interface RequestItem {
  id: number;
  nombreMaterial: string;
  codigo: string;
  unidad: string;
  cantidadSolicitada: number;
  cantidadAprobada: number;
  talla?: string;
  esManual: boolean;
}

export interface RequestDetail extends SolicitudResponse {
  items: RequestItem[];
}

export const requestsService = {
  create: async (data: CreateRequestDto) => {
    const response = await api.post("/solicitudes", data);
    return response.data;
  },
  
  getMyRequests: async (): Promise<SolicitudResponse[]> => {
    const response = await api.get("/solicitudes/mis-solicitudes");
    return response.data;
  },

  // ✅ NUEVO: Obtener por ID
  getById: async (id: number): Promise<RequestDetail> => {
    const response = await api.get(`/solicitudes/${id}`);
    return response.data;
  }
};