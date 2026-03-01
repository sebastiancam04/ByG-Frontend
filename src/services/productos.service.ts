// ✅ CORREGIDO: Ahora usa la importación con llaves { api }
import { api } from '@/lib/axios';

export const productosService = {
  // 1. Traer todos los productos del inventario
  getAll: async () => {
    const response = await api.get('/productos');
    return response.data;
  },

  // 2. Traer productos filtrados por una bodega específica (Opcional)
  getByBodega: async (bodegaId: number) => {
    const response = await api.get(`/productos/bodega/${bodegaId}`);
    return response.data;
  }
};