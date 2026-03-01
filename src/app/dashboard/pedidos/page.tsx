"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
// ✅ Eliminamos date-fns e importamos nuestra utilidad
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Search, FileText, Calendar, Package, Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { requestsService, SolicitudResponse } from "@/services/requests.service"

export default function MisPedidosPage() {
  const router = useRouter()
  const [pedidos, setPedidos] = useState<SolicitudResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState("")

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await requestsService.getMyRequests()
        setPedidos(data)
      } catch (error) {
        console.error("Error", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPedidos()
  }, [])

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">Pendiente</span>;
      case "EnRevision":
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">En Revisión</span>;
      case "AprobadaBodega":
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">Aprobado (Bodega)</span>;
      case "RequiereCompra":
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">Requiere Compra</span>;
      case "Finalizada":
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">Entregado</span>;
      case "Rechazada":
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">Rechazado</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">{estado}</span>;
    }
  };

  const pedidosFiltrados = pedidos.filter(p => 
    p.proyecto.toLowerCase().includes(filtro.toLowerCase()) ||
    p.ordenCompra.toLowerCase().includes(filtro.toLowerCase()) ||
    p.folio.toString().includes(filtro)
  )

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 pt-24 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Mis Pedidos</h1>
              <p className="text-slate-500 text-sm">Historial de solicitudes.</p>
            </div>
          </div>
          <Link href="/dashboard/solicitante/pedidos/nuevo">
            <Button className="bg-[#D32F2F] hover:bg-red-700 text-white shadow-md"><Plus className="w-5 h-5 mr-2" /> Nueva Solicitud</Button>
          </Link>
        </div>

        <Card className="border-t-4 border-t-[#D32F2F] shadow-md">
          <CardHeader className="pb-4 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-[#D32F2F]" /> Listado</CardTitle>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <Input placeholder="Buscar..." className="pl-9 h-9" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-48 text-slate-400"><Loader2 className="w-8 h-8 animate-spin mr-2" /> Cargando...</div>
            ) : pedidosFiltrados.length === 0 ? (
              <div className="flex justify-center items-center h-48 text-slate-400"><Package className="w-10 h-10 opacity-30 mr-2"/> Sin datos</div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[100px]">Folio</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead className="hidden md:table-cell">OC</TableHead>
                    <TableHead className="text-center">Items</TableHead>
                    <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidosFiltrados.map((pedido) => (
                    <TableRow 
                        key={pedido.id} 
                        className="hover:bg-slate-50 cursor-pointer"
                        onClick={() => router.push(`/dashboard/pedidos/${pedido.id}`)} 
                    >
                      <TableCell className="font-mono font-bold text-[#D32F2F]">#{pedido.folio}</TableCell>
                      <TableCell className="font-medium">{pedido.proyecto}</TableCell>
                      <TableCell className="hidden md:table-cell text-slate-500">{pedido.ordenCompra}</TableCell>
                      <TableCell className="text-center"><span className="bg-slate-100 px-2 py-1 rounded font-bold text-xs">{pedido.totalItems}</span></TableCell>
                      <TableCell className="hidden sm:table-cell text-slate-500 text-sm">
                        {/* ✅ USO DE LA NUEVA FUNCIÓN */}
                        {formatDate(pedido.fechaCreacion)}
                      </TableCell>
                      <TableCell className="text-right">{getEstadoBadge(pedido.estado)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}