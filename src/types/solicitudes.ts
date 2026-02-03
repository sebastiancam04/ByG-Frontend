// Estados posibles según tu Enum en C#
export type EstadoSolicitud = 'Pendiente' | 'Aprobada' | 'Rechazada' | 'En Preparación' | 'Entregada' | 'Finalizada';

// 1. Resumen para la TABLA (Viene de SolicitudResponseDto)
export interface SolicitudResumen {
  id: number;
  folio: number;
  solicitante: string;
  ordenCompra: string;
  proyecto: string;
  estado: EstadoSolicitud;
  fechaCreacion: string;
  totalItems: number;
}

// 2. Detalle de un ítem (Viene de DetalleResponseDto)
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

// 3. Solicitud Completa para el MODAL (Viene de SolicitudDetailResponseDto)
export interface SolicitudDetalle extends SolicitudResumen {
  items: DetalleItem[];
}

export interface UpdateEstadoDto {
  nuevoEstado: string; // Enviamos el string al backend
}