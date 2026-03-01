import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ✅ NUEVO: Función para formatear fechas a Chile (Con corrección de UTC)
export function formatDate(dateString: string | Date) {
  if (!dateString) return "---";
  
  let dateToParse = dateString;

  // Si es un texto y no tiene indicador de zona ('Z' o offset), le agregamos 'Z' para tratarlo como UTC
  if (typeof dateString === 'string') {
    // Detectar si falta la zona horaria (formato simple "YYYY-MM-DDTHH:mm:ss")
    if (!dateString.includes('Z') && !dateString.includes('+') && !/-\d{2}:\d{2}/.test(dateString)) {
        dateToParse = dateString + 'Z';
    }
  }

  const date = new Date(dateToParse);
  
  // Forzamos la zona horaria de Chile
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