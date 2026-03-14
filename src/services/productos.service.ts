import { api } from '@/lib/axios';

export const productosService = {
  // 1. Traer todos los productos del inventario
  getAll: async () => {
    
    const response = await api.get('/Productos'); 
    return response.data;
  },

  // 2. Traer productos filtrados por una bodega específica (Opcional)
  getByBodega: async (bodegaId: number) => {
    
    const response = await api.get(`/Productos/bodega/${bodegaId}`);
    return response.data;
  }
};