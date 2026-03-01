import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date) {
  if (!dateString) return "";

  // 1. Convertimos a objeto Date
  let date = new Date(dateString);

  // 2. DETECCIÓN DE UTC:
  // Si el string viene del backend C# como "2026-02-13T09:36:00" (sin Z al final),
  // Javascript a veces asume que es hora local.
  // Para arreglarlo, si es un string y no termina en 'Z', asumimos que es UTC.
  if (typeof dateString === "string" && !dateString.endsWith("Z")) {
    date = new Date(dateString + "Z");
  }

  // 3. Formateamos forzando la zona horaria de Chile
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Para formato a. m. / p. m.
    timeZone: "America/Santiago", // 👈 ESTO ARREGLA LAS 3 HORAS DE DIFERENCIA
  }).format(date);
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(amount);
}