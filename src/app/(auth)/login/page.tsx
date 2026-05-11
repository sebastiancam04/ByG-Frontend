"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HardHat,
  ArrowLeft,
  Loader2,
  AlertCircle,
  KeyRound,
  Mail,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  correo: z.string().min(1, "El correo es obligatorio").email("Formato no válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

const resetSchema = z.object({
  codigo: z.string().min(1, "El código es obligatorio"),
  nuevaPassword: z.string().min(6, "Mínimo 6 caracteres")
    .refine((val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(val), "Debe incluir mayúscula, minúscula y número."),
});

type LoginForm = z.infer<typeof loginSchema>;
type ResetForm = z.infer<typeof resetSchema>;
type AuthView = "LOGIN" | "RECOVER_EMAIL" | "RECOVER_RESET";

export default function LoginPage() {
  const router = useRouter();
  const loginToStore = useAuthStore((state) => state.login);
  const [view, setView] = useState<AuthView>("LOGIN");
  const [loading, setLoading] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const { register: registerReset, handleSubmit: handleSubmitReset, formState: { errors: errorsReset } } = useForm<ResetForm>({ resolver: zodResolver(resetSchema) });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await authService.login(data.correo, data.password);
      if (response.token) {
        loginToStore(response);
        toast.success(`¡Bienvenido, ${response.usuario}!`);
        
        // REDIRECCIÓN ARREGLADA: Todos van a la raíz "/" de forma nativa
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || error.response?.data?.mensaje || "Credenciales incorrectas");
      } else {
        toast.error("Error de conexión");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.includes("@")) return toast.error("Correo inválido");
    setLoading(true);
    try {
      await authService.requestPasswordReset(recoveryEmail);
      toast.success("Código enviado");
      setView("RECOVER_RESET");
    } catch { toast.error("Error al procesar"); } finally { setLoading(false); }
  };

  const handleResetPassword = async (data: ResetForm) => {
    setLoading(true);
    try {
      await authService.resetPassword({ correo: recoveryEmail, codigo: data.codigo, nuevaPassword: data.nuevaPassword });
      toast.success("Contraseña actualizada");
      setView("LOGIN");
    } catch { toast.error("Código inválido"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070')" }}></div>
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]"></div>
      </div>
      <div className="w-full max-w-md px-4 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-8">
          <img src="https://res.cloudinary.com/dsljo0xlb/image/upload/v1768940307/LOGO-BYG_BLANCO-PNG_zdbhuy.png" alt="Logo" className="h-16 w-auto opacity-90" />
        </div>
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          {view === "LOGIN" ? (
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label>Correo Corporativo</Label>
                  <Input {...register("correo")} type="email" placeholder="usuario@byg.cl" className={cn(errors.correo && "border-red-500 bg-red-50")} />
                  {errors.correo && <p className="text-xs text-red-500 font-bold">{errors.correo.message}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><Label>Contraseña</Label><button type="button" onClick={() => setView("RECOVER_EMAIL")} className="text-xs text-[#D32F2F] hover:underline">¿Olvidaste la clave?</button></div>
                  <Input {...register("password")} type="password" className={cn(errors.password && "border-red-500 bg-red-50")} />
                </div>
                <Button type="submit" className="w-full bg-[#D32F2F] hover:bg-red-700 text-white font-bold h-12" disabled={loading}>{loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Iniciar Sesión"}</Button>
              </form>
            </CardContent>
          ) : view === "RECOVER_EMAIL" ? (
            <CardContent className="pt-8 text-center">
              <Mail className="mx-auto w-12 h-12 text-[#D32F2F] mb-4" />
              <h2 className="text-xl font-bold mb-2">Recuperar Cuenta</h2>
              <form onSubmit={handleRequestCode} className="space-y-4">
                <Input value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} placeholder="tu@correo.cl" required />
                <Button type="submit" className="w-full bg-[#D32F2F]" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : "Enviar Código"}</Button>
                <button type="button" onClick={() => setView("LOGIN")} className="text-sm text-slate-500">Volver</button>
              </form>
            </CardContent>
          ) : (
            <CardContent className="pt-8 text-center">
              <KeyRound className="mx-auto w-12 h-12 text-[#D32F2F] mb-4" />
              <h2 className="text-xl font-bold mb-4">Nueva Contraseña</h2>
              <form onSubmit={handleSubmitReset(handleResetPassword)} className="space-y-4">
                <Input {...registerReset("codigo")} placeholder="Código 123456" className="text-center font-mono" />
                <Input {...registerReset("nuevaPassword")} type="password" placeholder="Mínimo 6 caracteres" />
                <Button type="submit" className="w-full bg-[#D32F2F]" disabled={loading}>Cambiar Contraseña</Button>
              </form>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}