// src/types/productos.ts

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  unidadMedida: string;
  talla?: string;
  stockActual: number; // Conectado al StockActual de C#
}