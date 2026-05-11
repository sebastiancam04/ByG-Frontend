"use client";

import { useEffect, useState } from "react";
import { solicitudesService } from "@/services/solicitudes.service";
import { SolicitudResumen } from "@/types/solicitudes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PackageSearch, AlertCircle, Send, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PanelEspecialesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudResumen[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarEspeciales = async () => {
    try {
      const data = await solicitudesService.getEspeciales();
      setSolicitudes(data);
    } catch {
      toast.error("Error al cargar panel de solicitudes especiales");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEspeciales();
  }, []);

  const procesarSolicitud = async (id: number, estado: string) => {
    try {
      await solicitudesService.updateEstado(id, estado);
      toast.success(estado === "RequiereCompra" ? "Enviado a Compras exitosamente" : "Solicitud Rechazada");
      cargarEspeciales();
    } catch {
      toast.error("Error al procesar la solicitud");
    }
  };

  // Función nativa para formatear fecha en vez de usar dayjs
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(fecha);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-300 pt-32">
      <div className="flex items-center gap-4 mb-8 pb-4 border-b">
        <Link href="/dashboard/bodeguero">
          <Button variant="outline" size="icon" className="rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
        </Link>
        <PackageSearch className="w-8 h-8 text-orange-600 ml-2" />
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Panel de Solicitudes Especiales</h1>
          <p className="text-slate-500">Portal de evaluación para materiales Nuevos o Agotados</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Folio</TableHead>
              <TableHead className="font-bold">Tipo Especial</TableHead>
              <TableHead className="font-bold">Solicitante</TableHead>
              <TableHead className="font-bold">Proyecto</TableHead>
              <TableHead className="font-bold">Fecha</TableHead>
              <TableHead className="font-bold">Estado</TableHead>
              <TableHead className="text-right font-bold">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cargando ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-slate-500">Cargando solicitudes...</TableCell></TableRow>
            ) : solicitudes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-slate-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-40"/>
                  <p className="font-medium">No hay solicitudes especiales pendientes.</p>
                </TableCell>
              </TableRow>
            ) : (
              solicitudes.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-bold text-slate-800">#{s.folio}</TableCell>
                  <TableCell>
                    {s.tipoPedido === "NUEVO" ? (
                        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">NUEVO</Badge>
                    ) : (
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">AGOTADO</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-slate-600">{s.solicitante}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={s.proyecto}>{s.proyecto}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{formatearFecha(s.fechaCreacion)}</TableCell>
                  <TableCell>
                    <Badge variant={s.estado === "Pendiente" ? "outline" : "default"}>
                      {s.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {s.estado === "Pendiente" ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => procesarSolicitud(s.id, "RequiereCompra")}>
                          <Send className="w-4 h-4 mr-1.5" /> Aceptar
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200" onClick={() => procesarSolicitud(s.id, "Rechazada")}>
                          <XCircle className="w-4 h-4 mr-1.5" /> Rechazar
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium italic">Procesado</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}