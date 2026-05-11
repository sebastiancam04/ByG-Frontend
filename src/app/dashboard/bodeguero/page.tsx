"use client";

import { useAuthStore } from "@/stores/auth.store";
import { Package, PackagePlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PortalBodegueroPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pt-32">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <Link href="/">
          <Button variant="outline" size="icon" className="rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Portal de Bodeguero</h1>
          <p className="text-slate-500 mt-1">Hola, {user?.nombres}. Selecciona el panel al que deseas ingresar.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-10">
        <Link href="/dashboard/bodeguero/pedidos" className="group">
          <Card className="h-full border-2 border-slate-200 hover:border-[#D32F2F] hover:shadow-xl transition-all cursor-pointer bg-white">
            <CardContent className="p-10 flex flex-col items-center text-center space-y-5">
              <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-[#D32F2F] transition-colors">
                <Package className="w-12 h-12 text-[#D32F2F] group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Panel de Bodega</h2>
              <p className="text-slate-500">Revisa y gestiona los pedidos de materiales que tienen stock normal en el catálogo.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/bodeguero/especiales" className="group">
          <Card className="h-full border-2 border-slate-200 hover:border-orange-500 hover:shadow-xl transition-all cursor-pointer bg-white">
            <CardContent className="p-10 flex flex-col items-center text-center space-y-5">
              <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                <PackagePlus className="w-12 h-12 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Panel de Solicitudes</h2>
              <p className="text-slate-500">Portal para aceptar o rechazar solicitudes de materiales ESPECIALES (Agotados o Nuevos).</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}