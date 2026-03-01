"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Loader2, 
  User, 
  Mail, 
  Shield, 
  LogOut, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  ShoppingBag,
  MapPin,
  Facebook,
  Linkedin,
  FileText // ✅ ESTE ERA EL QUE FALTABA
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";

export default function MiCuentaPage() {
  const { user, logout, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const datosFrescos = await authService.getPerfil();
        setUser({
            id: datosFrescos.id,
            nombres: datosFrescos.usuario, 
            email: datosFrescos.correo,    
            rol: datosFrescos.rol
        });
      } catch (error) {
        console.error("Error cargando perfil", error);
        toast.error("No se pudo actualizar la información del perfil.");
      } finally {
        setLoading(false);
      }
    };
    cargarPerfil();
  }, [setUser]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-[#D32F2F]">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="font-bold text-slate-500">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-red-500/20">
      
      {/* HEADER SUPERIOR CON EL LOGO */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-6xl">
          
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
              <span className="text-[10px] font-bold text-[#D32F2F] uppercase tracking-widest mt-0.5">Perfil de Usuario</span>
            </div>
          </Link>

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
                    <Link href="/dashboard/solicitante" className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <ShoppingBag className="w-4 h-4" /> Mis Pedidos
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

      {/* Espaciador */}
      <div className="h-28 md:h-32"></div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto space-y-8 w-full pb-16">
        
        {/* Título de Página */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mi Cuenta</h1>
            <p className="text-slate-500 text-sm mt-1">Información personal y ajustes de sesión.</p>
          </div>
        </div>

        {/* Tarjeta de Perfil Estilizada */}
        <Card className="shadow-xl border-0 overflow-hidden bg-white">
            {/* Banner Superior con Degradado */}
            <div className="h-32 md:h-40 bg-gradient-to-r from-[#D32F2F] to-orange-600 relative">
                <div className="absolute inset-0 bg-black/10"></div> {/* Oscurece un poco el banner */}
            </div>

            {/* Contenedor de Información */}
            <div className="px-6 md:px-10 pb-10">
                {/* Cabecera del Perfil: Avatar y Botón de Salir */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 -mt-16 md:-mt-20 mb-6 relative z-10">
                    <div className="flex flex-col items-center md:items-start">
                        {/* Avatar Flotante */}
                        <div className="h-32 w-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                            <span className="text-6xl font-extrabold text-[#D32F2F]">
                                {user?.nombres?.charAt(0).toUpperCase() || <User className="w-16 h-16" />}
                            </span>
                        </div>
                    </div>
                    
                    <Button 
                        variant="destructive" 
                        onClick={handleLogout}
                        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 font-bold shadow-sm md:mb-4"
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
                    </Button>
                </div>

                {/* Nombre y Rol */}
                <div className="text-center md:text-left mb-8">
                    <h2 className="text-3xl font-black text-slate-800">{user?.nombres}</h2>
                    <div className="mt-2 inline-block">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest border shadow-sm ${
                            user?.rol === 'Administrador' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            user?.rol === 'Bodeguero' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                            {user?.rol}
                        </span>
                    </div>
                </div>

                {/* Grid de Datos */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="font-bold text-slate-700 mb-2 uppercase tracking-wider text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" /> Detalles de Contacto
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tarjeta de Email */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300">
                            <div className="bg-blue-50 p-3.5 rounded-full text-blue-600">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Correo Electrónico</p>
                                <p className="font-bold text-slate-800 break-all">{user?.email}</p>
                            </div>
                        </div>

                        {/* Tarjeta de Nivel de Acceso */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300">
                            <div className="bg-orange-50 p-3.5 rounded-full text-orange-600">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nivel de Acceso</p>
                                <p className="font-bold text-slate-800">Módulo de {user?.rol}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
      </main>

      {/* FOOTER */}
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