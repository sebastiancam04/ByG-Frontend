import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; // Importamos el componente de notificaciones

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ByG Ingeniería - Gestión de Productos",
  description: "Plataforma de gestión de solicitudes y bodega",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Renderizamos la aplicación */}
        {children}

        {/* ✅ CORREGIDO: Duración a 2 segundos (2000ms) y botón para cerrar (closeButton) */}
        <Toaster richColors position="top-center" duration={2000} closeButton />
      </body>
    </html>
  );
}