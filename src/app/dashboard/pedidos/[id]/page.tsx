"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
// ✅ Eliminamos date-fns e importamos nuestra utilidad
import { formatDate } from "@/lib/utils" 
import { ArrowLeft, Calendar, MapPin, FileText, Package, CheckCircle2, Clock, XCircle, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { requestsService, RequestDetail } from "@/services/requests.service"

export default function DetallePedidoPage() {
  const params = useParams()
  const [solicitud, setSolicitud] = useState<RequestDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const id = Number(params.id)
        const data = await requestsService.getById(id)
        setSolicitud(data)
      } catch (error) {
        console.error("Error", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDetalle()
  }, [params.id])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Cargando...</div>
  if (!solicitud) return <div className="min-h-screen flex items-center justify-center text-slate-400">No encontrado.</div>

  const getStatusInfo = (estado: string) => {
    switch (estado) {
      case "Pendiente": return { color: "text-yellow-700 bg-yellow-50 border-yellow-200", icon: Clock, label: "En Revisión" }
      case "AprobadaBodega": return { color: "text-blue-700 bg-blue-50 border-blue-200", icon: Package, label: "En Bodega" }
      case "Finalizada": return { color: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2, label: "Entregado" }
      case "Rechazada": return { color: "text-red-700 bg-red-50 border-red-200", icon: XCircle, label: "Rechazado" }
      default: return { color: "text-slate-700 bg-slate-50", icon: FileText, label: estado }
    }
  }

  const status = getStatusInfo(solicitud.estado)
  const StatusIcon = status.icon

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 pt-24 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard/pedidos">
            <Button variant="outline" size="icon" className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              Solicitud #{solicitud.folio.toString().padStart(4, '0')}
              <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${status.color}`}>
                <StatusIcon className="w-4 h-4" /> {status.label}
              </span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3 border-t-4 border-t-[#D32F2F] shadow-sm">
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Proyecto</p>
                        <p className="font-semibold text-slate-800 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#D32F2F]"/> {solicitud.proyecto}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Orden Compra</p>
                        <p className="font-semibold text-slate-800 flex items-center gap-2"><FileText className="w-4 h-4 text-[#D32F2F]"/> {solicitud.ordenCompra}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Fecha</p>
                        <p className="font-semibold text-slate-800 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#D32F2F]"/> 
                            {/* ✅ USO DE LA NUEVA FUNCIÓN */}
                            {formatDate(solicitud.fechaCreacion)}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-3 shadow-md">
                <CardHeader className="bg-slate-50 border-b pb-4"><CardTitle className="text-lg">Detalle de Materiales</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] text-center">#</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Código</TableHead>
                                <TableHead className="text-center">Unidad</TableHead>
                                <TableHead className="text-center">Cant. Solicitada</TableHead>
                                <TableHead className="text-center">Cant. Aprobada</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {solicitud.items.map((item, index) => (
                                <TableRow key={item.id} className={item.esManual ? "bg-orange-50/30" : ""}>
                                    <TableCell className="text-center text-slate-400 text-xs">{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-800">{item.nombreMaterial}</span>
                                            {item.esManual && <span className="text-xs text-orange-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Fuera de catálogo</span>}
                                            {item.talla && <span className="text-xs text-slate-500">Talla: {item.talla}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600 font-mono text-sm">{item.codigo}</TableCell>
                                    <TableCell className="text-center text-sm">{item.unidad}</TableCell>
                                    <TableCell className="text-center"><span className="font-bold bg-slate-100 px-2 py-1 rounded">{item.cantidadSolicitada}</span></TableCell>
                                    <TableCell className="text-center">
                                        {solicitud.estado === 'Pendiente' ? <span className="text-slate-400 text-xs italic">--</span> : <span className="font-bold">{item.cantidadAprobada}</span>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}