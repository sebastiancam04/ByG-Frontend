"use client";
import { useEffect, useState } from "react";
import { solicitudesService } from "@/services/solicitudes.service";
import { SolicitudResumen } from "@/types/solicitudes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PackageSearch, AlertCircle, Send, XCircle } from "lucide-react";

export default function PanelEspecialesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudResumen[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarEspeciales = async () => {
    try {
      const data = await solicitudesService.getEspeciales();
      setSolicitudes(data);
    } catch (error) {
      toast.error("Error al cargar panel de especiales");
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
      toast.success(estado === "RequiereCompra" ? "Enviado a Compras" : "Solicitud Rechazada");
      cargarEspeciales(); // Recargar tabla
    } catch {
      toast.error("Error al procesar la solicitud");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b">
        <PackageSearch className="w-8 h-8 text-orange-600" />
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestión de Especiales</h1>
          <p className="text-slate-500">Evalúa pedidos de materiales Nuevos o Agotados</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Folio</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado Actual</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cargando ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-slate-500">Cargando...</TableCell></TableRow>
            ) : solicitudes.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-slate-500"><AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-50"/>No hay solicitudes especiales pendientes.</TableCell></TableRow>
            ) : (
              solicitudes.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-bold text-slate-700">#{s.folio}</TableCell>
                  <TableCell>
                    {s.tipoPedido === "NUEVO" ? (
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200">Totalmente Nuevo</Badge>
                    ) : (
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">Stock Agotado</Badge>
                    )}
                  </TableCell>
                  <TableCell>{s.solicitante}</TableCell>
                  <TableCell>{s.proyecto}</TableCell>
                  <TableCell><Badge variant="outline">{s.estado}</Badge></TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => procesarSolicitud(s.id, "RequiereCompra")} disabled={s.estado !== "Pendiente"}>
                      <Send className="w-4 h-4 mr-1" /> A Compras
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => procesarSolicitud(s.id, "Rechazada")} disabled={s.estado !== "Pendiente"}>
                      <XCircle className="w-4 h-4 mr-1" /> Rechazar
                    </Button>
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