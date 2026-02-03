"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  Search,
  Plus,
  ShoppingCart,
  Trash2,
  PackagePlus,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  LogOut,
  User,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Linkedin,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Importamos Servicios
import { materialsService, Material } from "@/services/materials.service";
import { requestsService, DetalleSolicitud } from "@/services/requests.service";
import { useAuthStore } from "@/stores/auth.store";

export default function NuevaSolicitudPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // --- ESTADOS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Material[]>([]);

  const [isManualMode, setIsManualMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [manualItem, setManualItem] = useState({
    nombre: "",
    codigo: "",
    unidad: "",
    talla: "",
  });

  const [cantidad, setCantidad] = useState(1);
  const [ordenCompra, setOrdenCompra] = useState("");
  const [proyecto, setProyecto] = useState("");

  const [carrito, setCarrito] = useState<DetalleSolicitud[]>([]);
  const [enviando, setEnviando] = useState(false);

  // --- BUSCADOR ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 0 && !isManualMode) {
        try {
          const results = await materialsService.search(searchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error("Error buscando materiales", error);
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isManualMode]);

  // --- CARRITO ---
  const agregarDesdeCatalogo = (material: Material) => {
    const item: DetalleSolicitud = {
      materialId: material.id,
      nombreTemp: material.nombre,
      cantidad: cantidad,
    };
    setCarrito([...carrito, item]);
    toast.success(`${material.nombre} agregado`);
    setCantidad(1);
  };

  const agregarManual = () => {
    if (!manualItem.nombre)
      return toast.error("El nombre del material es obligatorio");
    if (!manualItem.unidad) return toast.error("Debes especificar una unidad");

    const item: DetalleSolicitud = {
      materialId: null,
      nombreTemp: `(NUEVO) ${manualItem.nombre} [${manualItem.unidad}]`,
      cantidad: cantidad,
      nuevoNombre: manualItem.nombre,
      nuevoCodigo: manualItem.codigo,
      nuevaUnidad: manualItem.unidad,
      nuevaTalla: manualItem.talla,
    };

    setCarrito([...carrito, item]);
    toast.success("Ítem manual agregado");
    setManualItem({ nombre: "", codigo: "", unidad: "", talla: "" });
    setIsManualMode(false);
    setCantidad(1);
  };

  const eliminarDelCarrito = (index: number) => {
    const nuevo = [...carrito];
    nuevo.splice(index, 1);
    setCarrito(nuevo);
  };

  const finalizarPedido = async () => {
    if (!ordenCompra || !proyecto)
      return toast.error("Faltan datos de Orden de Compra o Proyecto");
    if (carrito.length === 0) return toast.error("El carrito está vacío");

    setEnviando(true);
    try {
      await requestsService.create({
        ordenCompra,
        proyecto,
        detalles: carrito,
      });
      toast.success("¡Solicitud enviada exitosamente!");
      router.push("/"); // Redirige al Dashboard
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar la solicitud");
    } finally {
      setEnviando(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-red-500/20">
      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-6xl">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="https://res.cloudinary.com/dsljo0xlb/image/upload/v1768900061/ByG_ingeniera_logo_isltvf.png"
              alt="Logo ByG"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#D32F2F] uppercase tracking-widest mt-0.5">
                Nueva Solicitud
              </span>
            </div>
          </Link>

          {/* Menú Usuario */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 outline-none"
            >
              <div className="h-9 w-9 rounded-full bg-[#D32F2F] text-white flex items-center justify-center shadow-md">
                <span className="font-bold text-sm">
                  {user?.nombres ? (
                    user.nombres.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </span>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-90" : ""}`}
              />
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-4 bg-slate-50 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {user?.nombres} {user?.apellidoPaterno}
                    </p>
                    <p className="text-xs text-[#D32F2F] font-semibold uppercase tracking-wider mt-0.5">
                      {user?.rol}
                    </p>
                  </div>
                  <div className="p-2 space-y-1">
                    <Link
                      href="/dashboard/solicitante"
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" /> Mis Pedidos
                    </Link>
                  </div>
                  <div className="h-px bg-slate-100 mx-2 my-1" />
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            {/* ✅ Botón Volver corregido */}
            <Link href="/">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-slate-300 hover:border-[#D32F2F] hover:text-[#D32F2F] transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Crear Nueva Solicitud
              </h1>
              <p className="text-slate-500 mt-1">
                Completa los datos de la obra y selecciona los materiales
                necesarios.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* IZQUIERDA: Buscador (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-t-4 border-t-[#D32F2F] shadow-md border-x-0 border-b-0">
                <CardHeader className="pb-4 border-b border-slate-100">
                  <CardTitle className="flex justify-between items-center text-xl">
                    <span className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-[#D32F2F]" /> Catálogo de
                      Materiales
                    </span>
                    {!isManualMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-[#D32F2F] hover:text-red-700 hover:bg-red-50"
                        onClick={() => setIsManualMode(true)}
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        ¿No está en la lista?
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {!isManualMode ? (
                    <div className="space-y-6">
                      <div className="relative group">
                        <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-[#D32F2F] transition-colors" />
                        <Input
                          placeholder="Buscar material (ej: Disco, Guantes, Cable)..."
                          className="pl-10 h-12 text-base border-slate-200 focus-visible:ring-[#D32F2F]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          autoFocus
                        />
                      </div>

                      <div className="h-[450px] overflow-y-auto border rounded-xl bg-slate-50/50 pr-2 custom-scrollbar">
                        {searchResults.length > 0 ? (
                          searchResults.map((mat) => (
                            <div
                              key={mat.id}
                              className="p-4 border-b border-slate-100 hover:bg-white hover:shadow-sm transition-all flex justify-between items-center group bg-white mx-2 mt-2 rounded-lg first:mt-2 last:mb-2"
                            >
                              <div className="flex-1">
                                <p className="font-bold text-slate-800 text-lg">
                                  {mat.nombre}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono border">
                                    {mat.codigo}
                                  </span>
                                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                                    {/* ✅ CORREGIDO: Usamos mat.unidadMedida */}
                                    {mat.unidadMedida}
                                  </span>
                                  {/* ✅ CORREGIDO: Usamos mat.stock */}
                                  <span
                                    className={`text-xs px-2 py-1 rounded border ${mat.stock > 0 ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}
                                  >
                                    Stock: {mat.stock}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 pl-4">
                                <Input
                                  type="number"
                                  min="1"
                                  className="w-20 h-10 text-center font-bold"
                                  placeholder="1"
                                  onChange={(e) =>
                                    setCantidad(parseInt(e.target.value) || 1)
                                  }
                                />
                                {/* ✅ CORREGIDO: Botón Rojo ByG */}
                                <Button
                                  size="sm"
                                  className="h-10 w-10 p-0 rounded-lg bg-[#D32F2F] hover:bg-red-700 transition-colors shadow-sm"
                                  onClick={() => agregarDesdeCatalogo(mat)}
                                >
                                  <Plus className="w-6 h-6 text-white" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                            <div className="bg-slate-100 p-4 rounded-full">
                              <Search className="w-8 h-8 opacity-40" />
                            </div>
                            <p>Escribe para buscar productos...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* MODO MANUAL */
                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 animate-in fade-in slide-in-from-bottom-4">
                      {/* (El formulario manual se mantiene igual) */}
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-orange-200/50">
                        <div className="bg-orange-100 p-2 rounded-lg text-orange-700">
                          <PackagePlus className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-orange-900 text-lg">
                            Solicitud Especial
                          </h3>
                          <p className="text-sm text-orange-700">
                            Usa esto solo si el material no existe en el
                            catálogo.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-orange-900 font-semibold">
                            Nombre del Material *
                          </Label>
                          <Input
                            placeholder="Ej: Disco..."
                            className="bg-white border-orange-200 focus-visible:ring-orange-500 h-11"
                            value={manualItem.nombre}
                            onChange={(e) =>
                              setManualItem({
                                ...manualItem,
                                nombre: e.target.value,
                              })
                            }
                            autoFocus
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-orange-900">
                            Marca / Modelo
                          </Label>
                          <Input
                            placeholder="Ej: Bosch..."
                            className="bg-white border-orange-200 focus-visible:ring-orange-500"
                            value={manualItem.codigo}
                            onChange={(e) =>
                              setManualItem({
                                ...manualItem,
                                codigo: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-orange-900">Unidad *</Label>
                          <select
                            className="flex h-10 w-full rounded-md border border-orange-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                            value={manualItem.unidad}
                            onChange={(e) =>
                              setManualItem({
                                ...manualItem,
                                unidad: e.target.value,
                              })
                            }
                          >
                            <option value="">Seleccione...</option>
                            <option value="UNIDAD">Unidad (C/U)</option>
                            <option value="METRO">Metros (mts)</option>
                            <option value="LITRO">Litros (L)</option>
                            <option value="CAJA">Caja / Paquete</option>
                            <option value="JUEGO">Juego / Set</option>
                            <option value="GLOBAL">Global</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-orange-900">
                            Talla / Medida
                          </Label>
                          <Input
                            placeholder="Ej: XL, 10mm..."
                            className="bg-white border-orange-200 focus-visible:ring-orange-500"
                            value={manualItem.talla}
                            onChange={(e) =>
                              setManualItem({
                                ...manualItem,
                                talla: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-orange-900 font-bold">
                            Cantidad *
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            className="bg-white border-orange-200 focus-visible:ring-orange-500 font-bold"
                            value={cantidad}
                            onChange={(e) =>
                              setCantidad(parseInt(e.target.value) || 1)
                            }
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end pt-2">
                        <Button
                          variant="ghost"
                          onClick={() => setIsManualMode(false)}
                          className="hover:bg-orange-100 hover:text-orange-900"
                        >
                          Cancelar
                        </Button>
                        <Button
                          className="bg-orange-600 hover:bg-orange-700 text-white shadow-md border-0"
                          onClick={agregarManual}
                        >
                          <Plus className="w-4 h-4 mr-2" /> Agregar al Pedido
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* DERECHA: Resumen (1/3) */}
            <div className="space-y-6">
              <Card className="h-full flex flex-col shadow-xl border-slate-200 lg:sticky lg:top-28">
                {/* ✅ CORREGIDO: Cabecera Rojo ByG */}
                <CardHeader className="bg-[#D32F2F] text-white py-4 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCart className="w-5 h-5 text-white" />
                    Resumen del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-5 pt-6 bg-slate-50/50">
                  <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Orden de Compra *
                      </Label>
                      <Input
                        placeholder="Ej: OC-4050"
                        value={ordenCompra}
                        onChange={(e) => setOrdenCompra(e.target.value)}
                        className="bg-slate-50 border-slate-200 focus-visible:ring-[#D32F2F]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Proyecto / Obra *
                      </Label>
                      <Input
                        placeholder="Ej: Montaje Sala Eléctrica"
                        value={proyecto}
                        onChange={(e) => setProyecto(e.target.value)}
                        className="bg-slate-50 border-slate-200 focus-visible:ring-[#D32F2F]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 px-1">
                    <span>Materiales seleccionados</span>
                    <span className="bg-[#D32F2F] text-white px-2.5 py-0.5 rounded-full text-xs">
                      {carrito.length}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[350px] min-h-[150px] space-y-3 pr-1 custom-scrollbar">
                    {carrito.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl p-8 bg-white/50">
                        <ShoppingBag className="w-10 h-10 opacity-10 mb-3" />
                        <p>El carrito está vacío</p>
                      </div>
                    ) : (
                      carrito.map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex justify-between items-start text-sm p-3 rounded-lg border shadow-sm group transition-all bg-white hover:shadow-md ${!item.materialId ? "border-l-4 border-l-orange-400" : "border-slate-100"}`}
                        >
                          <div className="flex-1 mr-3">
                            <p
                              className={`font-semibold line-clamp-2 leading-snug ${!item.materialId ? "text-orange-800" : "text-slate-800"}`}
                            >
                              {item.nombreTemp}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                Cant: {item.cantidad}
                              </span>
                              {!item.materialId && item.nuevaTalla && (
                                <span className="text-[10px] text-orange-600 font-medium px-1.5 py-0.5 bg-orange-50 rounded">
                                  Talla: {item.nuevaTalla}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => eliminarDelCarrito(idx)}
                            className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <Button
                    className="w-full bg-[#D32F2F] hover:bg-red-700 text-white mt-auto py-7 text-lg font-bold shadow-lg shadow-red-200 transition-all hover:-translate-y-1"
                    onClick={finalizarPedido}
                    disabled={enviando || carrito.length === 0}
                  >
                    {enviando ? (
                      <div className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                        Enviando...
                      </div>
                    ) : (
                      "Confirmar Solicitud"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-[#CCCCCC]" style={{ backgroundColor: "#222222" }}>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 opacity-90">
                <Image
                  src="https://res.cloudinary.com/dsljo0xlb/image/upload/v1768940307/LOGO-BYG_BLANCO-PNG_zdbhuy.png"
                  alt="Logo ByG"
                  width={64}
                  height={64}
                  className="h-16 w-auto object-contain"
                />
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                Soluciones integrales en ingeniería y abastecimiento industrial.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center hover:bg-[#D32F2F] transition-colors text-white"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center hover:bg-[#D32F2F] transition-colors text-white"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-4 text-white border-b-2 border-[#D32F2F] inline-block pb-1 uppercase tracking-wider">
                Enlaces
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/solicitante"
                    className="hover:text-white transition-colors"
                  >
                    Mis Pedidos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/cuenta"
                    className="hover:text-white transition-colors"
                  >
                    Mi Cuenta
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-4 text-white border-b-2 border-[#D32F2F] inline-block pb-1 uppercase tracking-wider">
                Contacto
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D32F2F] mt-0.5" />
                  <span>
                    Román Díaz 205, Oficina 102,
                    <br />
                    Providencia, Santiago.
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#D32F2F]" />
                  <span>+56 9 1234 5678</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#D32F2F]" />
                  <span>contacto@byg-ingenieria.cl</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="py-4 text-center text-xs text-gray-600 border-t border-[#333333] bg-[#1a1a1a]">
          © {new Date().getFullYear()} ByG Ingeniería. Todos los derechos
          reservados.
        </div>
      </footer>
    </div>
  );
}
