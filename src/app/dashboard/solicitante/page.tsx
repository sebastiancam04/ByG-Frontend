"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ Necesario para el Logo
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  Package, 
  Loader2, 
  Plus, 
  LogOut,
  ChevronRight, 
  User,         
  ShieldCheck,  
  Truck,        
  ShoppingBag,
  MapPin,       // ✅ Importado para el footer
  Mail,         // ✅ Importado para el footer
  Facebook,     // ✅ Importado para el footer
  Linkedin      // ✅ Importado para el footer
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requestsService, SolicitudResponse } from "@/services/requests.service";
import { useAuthStore } from "@/stores/auth.store";

export default function SolicitanteDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [pedidos, setPedidos] = useState<SolicitudResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  
  // ✅ ESTADO PARA EL MENÚ DEL USUARIO
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); 

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await requestsService.getMyRequests();
        setPedidos(data);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

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

  const pedidosFiltrados = pedidos.filter(
    (p) =>
      p.proyecto.toLowerCase().includes(filtro.toLowerCase()) ||
      p.ordenCompra.toLowerCase().includes(filtro.toLowerCase()) ||
      p.folio.toString().includes(filtro)
  );

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    // ✅ Agregado flex y flex-col para que el footer baje al fondo de la pantalla
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      
      {/* HEADER SUPERIOR CON EL LOGO */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-6xl">
          
          {/* LADO IZQUIERDO: LOGO Y TEXTO */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image 
                src="https://res.cloudinary.com/dsljo0xlb/image/upload/v1768900061/ByG_ingeniera_logo_isltvf.png" 
                alt="Logo ByG" 
                width={160} 
                height={60} 
                priority
                className="h-10 w-auto object-contain" 
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#D32F2F] uppercase tracking-widest mt-0.5">Mis Pedidos</span>
            </div>
          </Link>

          {/* LADO DERECHO: MENÚ DE USUARIO */}
          <div className="relative">
            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 outline-none">
              <div className="h-9 w-9 rounded-full bg-[#D32F2F] text-white flex items-center justify-center shadow-md">
                <span className="font-bold text-sm">{user?.nombres ? user.nombres.charAt(0).toUpperCase() : <User className="w-5 h-5" />}</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-90" : ""}`} />
            </button>

            {isUserMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-4 bg-slate-50 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.nombres} {user?.apellidos}</p>
                    <p className="text-xs text-[#D32F2F] font-semibold uppercase tracking-wider mt-0.5">{user?.rol}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    {user?.rol === "Administrador" && (
                      <Link href="/dashboard/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[#D32F2F] bg-red-50 hover:bg-red-100 rounded-lg transition-colors mb-1">
                        <ShieldCheck className="w-4 h-4" /> Panel Admin
                      </Link>
                    )}
                    {user?.rol === "Bodeguero" && (
                      <Link href="/dashboard/bodeguero/pedidos" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[#D32F2F] bg-red-50 hover:bg-red-100 rounded-lg transition-colors mb-1">
                        <Truck className="w-4 h-4" /> Panel Bodega
                      </Link>
                    )}
                    <Link href="/dashboard/cuenta" className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <User className="w-4 h-4" /> Ver Cuenta
                    </Link>
                  </div>
                  <div className="h-px bg-slate-100 mx-2 my-1" />
                  <div className="p-2">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left">
                      <LogOut className="w-4 h-4" /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Espaciador para compensar el header fijo */}
      <div className="h-28 md:h-32"></div>

      {/* CONTENIDO PRINCIPAL (✅ flex-grow añadido para empujar el footer) */}
      <main className="flex-grow p-4 md:p-8 max-w-6xl mx-auto space-y-6 w-full pb-16">
        
        {/* ENCABEZADO DE LA SECCIÓN */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Mis Pedidos
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Bienvenido, {user?.nombres}. Aquí está tu historial de solicitudes.
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
             <Link href="/dashboard/solicitante/pedidos/nuevo" className="w-full md:w-auto">
                <Button className="bg-[#D32F2F] hover:bg-red-700 text-white shadow-md gap-2 w-full md:w-auto font-bold transition-all hover:-translate-y-0.5">
                    <Plus className="w-5 h-5" /> Nueva Solicitud
                </Button>
             </Link>
          </div>
        </div>

        {/* TABLA DE PEDIDOS */}
        <Card className="border-t-4 border-t-[#D32F2F] shadow-md bg-white border-x-0 border-b-0">
          <CardHeader className="pb-4 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                <FileText className="w-5 h-5 text-[#D32F2F]" /> Listado de Solicitudes
              </CardTitle>
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <Input 
                    placeholder="Buscar por folio, proyecto u OC..." 
                    className="pl-9 h-9 bg-slate-50 border-slate-200 focus-visible:ring-[#D32F2F]" 
                    value={filtro} 
                    onChange={(e) => setFiltro(e.target.value)} 
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64 text-slate-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#D32F2F]" /> Cargando pedidos...
              </div>
            ) : pedidosFiltrados.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 text-slate-400 gap-3">
                <div className="bg-slate-50 p-4 rounded-full">
                  <Package className="w-8 h-8 opacity-30" />
                </div>
                <p>No tienes solicitudes registradas.</p>
                <Link href="/dashboard/solicitante/pedidos/nuevo">
                    <Button variant="link" className="text-[#D32F2F] font-bold">Crear la primera</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="w-[100px] font-bold text-slate-700">Folio</TableHead>
                        <TableHead className="font-bold text-slate-700">Proyecto</TableHead>
                        <TableHead className="hidden md:table-cell font-bold text-slate-700">Orden Compra</TableHead>
                        <TableHead className="text-center font-bold text-slate-700">Items</TableHead>
                        <TableHead className="hidden sm:table-cell font-bold text-slate-700">Fecha</TableHead>
                        <TableHead className="text-right font-bold text-slate-700 pr-6">Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pedidosFiltrados.map((pedido) => (
                        <TableRow 
                            key={pedido.id} 
                            className="hover:bg-slate-50 cursor-pointer transition-colors group border-b border-slate-100"
                            onClick={() => router.push(`/dashboard/pedidos/${pedido.id}`)} 
                        >
                          <TableCell className="font-mono font-bold text-[#D32F2F] group-hover:underline">
                            #{pedido.folio}
                          </TableCell>
                          <TableCell className="font-medium text-slate-900">
                            {pedido.proyecto}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-slate-500 text-sm">
                            {pedido.ordenCompra}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-bold text-xs border border-slate-200">
                                {pedido.totalItems}
                            </span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-slate-500 text-sm">
                            {formatDate(pedido.fechaCreacion)}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            {getEstadoBadge(pedido.estado)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* ✅ FOOTER AÑADIDO (Igual que en Nueva Solicitud) */}
      <footer className="text-[#CCCCCC] mt-auto" style={{ backgroundColor: "#222222" }}>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 opacity-90">
                <Image src="https://res.cloudinary.com/dsljo0xlb/image/upload/v1768940307/LOGO-BYG_BLANCO-PNG_zdbhuy.png" alt="Logo ByG" width={160} height={60} className="h-16 w-auto object-contain" />
              </div>
              <p className="text-sm leading-relaxed text-gray-400">Soluciones integrales en ingeniería y abastecimiento industrial.</p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center hover:bg-[#D32F2F] transition-colors text-white"><Linkedin className="w-4 h-4" /></a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center hover:bg-[#D32F2F] transition-colors text-white"><Facebook className="w-4 h-4" /></a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-4 text-white border-b-2 border-[#D32F2F] inline-block pb-1 uppercase tracking-wider">Enlaces</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
                <li><Link href="/dashboard/solicitante" className="hover:text-white transition-colors">Mis Pedidos</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-4 text-white border-b-2 border-[#D32F2F] inline-block pb-1 uppercase tracking-wider">Contacto</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-[#D32F2F] mt-0.5" /><span>Antofagasta, Chile<br />Montaje Eléctrico e Instrumentación</span></li>
                <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#D32F2F]" /><span>contacto@byg-ingenieria.cl</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="py-4 text-center text-xs text-gray-600 border-t border-[#333333] bg-[#1a1a1a]">
          © {new Date().getFullYear()} ByG Ingeniería. Todos los derechos reservados.
        </div>
      </footer>

    </div>
  );
}