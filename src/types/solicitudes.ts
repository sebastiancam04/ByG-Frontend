// ✅ Conectado: Exactamente igual al Enum del Backend
export type EstadoSolicitud =
  | "Pendiente"
  | "EnRevision"
  | "AprobadaBodega"
  | "RequiereCompra"
  | "Finalizada"
  | "Rechazada";

export interface SolicitudResumen {
  id: number;
  folio: number;
  solicitante: string;
  ordenCompra: string;
  proyecto: string;
  estado: EstadoSolicitud;
  fechaCreacion: string;
  totalItems: number;
  tipoPedido?: string;
}

export interface DetalleItem {
  id: number;
  nombreMaterial: string;
  codigo: string;
  unidad: string;
  cantidadSolicitada: number;
  cantidadAprobada: number;
  talla?: string;
  esManual: boolean;
}

export interface SolicitudDetalle extends SolicitudResumen {
  items: DetalleItem[];
}

export interface UpdateEstadoDto {
  nuevoEstado: string;
}

// 👇👇👇 AGREGAR ESTO AL FINAL 👇👇👇

export interface CreateDetalleDto {
  productoId: number | null;
  cantidad: number;
  temporalNombre?: string | null;
  temporalCodigo?: string | null;
  temporalUnidad?: string | null;
  temporalTalla?: string | null;
  observacion?: string | null; // ✅ NUEVO
}

export interface CreateSolicitudDto {
  proyecto: string;
  observaciones?: string;
  tipoPedido: string; // "NORMAL" | "NUEVO" | "AGOTADO"
  detalles: CreateDetalleDto[];
}
