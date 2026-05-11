"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/stores/auth.store"
import { Button, buttonVariants } from "@/components/ui/button"
import { 
  Truck, 
  ArrowLeft, 
  Package,
  PackagePlus, 
  Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function BodegueroDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 0)

    // Protección de ruta (Solo Bodeguero o Admin)
    if (isMounted) {
        if (!isAuthenticated) {
            router.push("/login")
        } else if (user?.rol !== "Bodeguero" && user?.rol !== "Administrador") {
            router.push("/")
        }
    }

    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router, isMounted])

  if (!isMounted || !user || (user.rol !== "Bodeguero" && user.rol !== "Administrador")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
         <Loader2 className="h-8 w-8 animate-spin text-[#D32F2F]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 pt-24 font-sans">
      <div className="container mx-auto max-w-5xl space-y-8">
        
        {/* --- ENCABEZADO PORTAL BODEGA --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Truck className="h-8 w-8 text-[#D32F2F]" />
              Portal de Bodega
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Bienvenido, {user.nombres}. Selecciona un módulo para gestionar.
            </p>
          </div>
          
          {/* BOTÓN VOLVER (A la página principal) */}
          <Link 
            href="/" 
            className={cn(buttonVariants({ variant: "outline" }), "gap-2 hover:bg-slate-100 hover:text-slate-900 cursor-pointer")}
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Link>
        </div>

        {/* --- CONTENIDO DE MÓDULOS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* GESTIÓN DE PEDIDOS NORMALES (ROJO) */}
          <Card className="hover:shadow-xl transition-all border-l-4 border-l-[#D32F2F] cursor-pointer group bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl group-hover:text-[#D32F2F] transition-colors">
                <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                    <Package className="w-6 h-6 text-[#D32F2F]" />
                </div>
                Gestión de Pedidos
              </CardTitle>
              <CardDescription className="text-base">
                Revisar y entregar materiales regulares que tienen stock normal en el catálogo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/bodeguero/pedidos">
                <Button className="w-full bg-slate-900 hover:bg-[#D32F2F] text-white font-semibold h-12 transition-colors">
                  Administrar Pedidos
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* GESTIÓN DE SOLICITUDES ESPECIALES (NARANJA) */}
          <Card className="hover:shadow-xl transition-all border-l-4 border-l-orange-500 cursor-pointer group bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl group-hover:text-orange-600 transition-colors">
                 <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                    <PackagePlus className="w-6 h-6 text-orange-600" />
                 </div>
                Gestión de Solicitudes
              </CardTitle>
              <CardDescription className="text-base">
                Evaluar requerimientos de materiales &quot;Nuevos&quot; o &quot;Agotados&quot; y derivar a Compras.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/bodeguero/especiales">
                <Button className="w-full bg-slate-900 hover:bg-orange-600 text-white font-semibold h-12 transition-colors">
                  Administrar Solicitudes
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}