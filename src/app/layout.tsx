import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; // Importamos el componente de notificaciones

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ByG Ingeniería - Gestión de Materiales",
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
        
        {/* Agregamos el Toaster aquí para que esté disponible en todas las páginas */}
        <Toaster richColors position="top-center" duration={4000} />
      </body>
    </html>
  );
}