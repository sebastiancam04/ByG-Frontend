// ARCHIVO: src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para formatear fechas a Chile (Con corrección de UTC)
export function formatDate(dateString: string | Date) {
  if (!dateString) return "---";
  
  let dateToParse = dateString;

  if (typeof dateString === 'string') {
    if (!dateString.includes('Z') && !dateString.includes('+') && !/-\d{2}:\d{2}/.test(dateString)) {
        dateToParse = dateString + 'Z';
    }
  }

  const date = new Date(dateToParse);
  
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Santiago" 
  }).format(date);
}

// Función para formatear el dinero
export function formatMoney(amount: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(amount);
}