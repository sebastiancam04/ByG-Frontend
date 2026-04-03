"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Search,
  ShieldAlert,
  CheckCircle2,
  XCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { usersService } from "@/services/users.service";
import { User, CreateUserDto } from "@/types/users";
import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

const userSchema = z.object({
  nombres: z.string().min(2, "El nombre es obligatorio"),
  apellidos: z.string().min(2, "El apellido es obligatorio"),
  correo: z.string()
    .email("Correo inválido")
    .endsWith("@byg-ingenieria.cl", "El correo debe ser @byg-ingenieria.cl"),
  rol: z.string().min(1, "Selecciona un rol"),
  activo: z.boolean(),
  password: z.string()
    .optional()
    .refine(
      (val) => !val || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(val),
      "Debe tener mín. 6 caracteres, 1 mayúscula, 1 minúscula y 1 número."
    ),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function UsuariosPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Aceptamos string o number para compatibilidad con GUIDs
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      correo: "",
      rol: "Solicitante",
      activo: true,
      password: "",
    },
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersService.getAll();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setEditingId(null);
    reset({ 
      nombres: "", 
      apellidos: "", 
      correo: "", 
      rol: "Solicitante", 
      activo: true, 
      password: "" 
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setValue("nombres", user.nombres);
    setValue("apellidos", user.apellidos);
    setValue("correo", user.correo);
    setValue("rol", user.rol);
    setValue("activo", user.activo);
    setValue("password", ""); 
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: UserFormValues) => {
    try {
      const payload: CreateUserDto = {
        nombres: data.nombres,
        apellidos: data.apellidos,
        correo: data.correo,
        rol: data.rol,
        activo: data.activo,
        password: data.password || undefined,
      };

      if (editingId) {
        await usersService.update(editingId, payload);
        toast.success("Usuario actualizado correctamente");
      } else {
        if (!data.password) {
          toast.error("La contraseña es obligatoria para nuevos usuarios");
          return;
        }
        await usersService.create(payload);
        toast.success("Usuario creado correctamente");
      }

      setIsDialogOpen(false);
      fetchUsers();
    } catch (error: unknown) { 
      console.error("Error submit:", error);
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        const backendError = error.response.data;
        if (Array.isArray(backendError) && backendError.length > 0 && backendError[0].description) {
          toast.error(backendError[0].description);
          return;
        }
        if (typeof backendError === "string") {
          toast.error(backendError);
          return;
        }
      }
      toast.error("Error al guardar usuario. Revisa los datos.");
    }
  };

  // Permitimos recibir un ID tipo string
  const handleDelete = async (id: string | number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.")) return;
    
    try {
      await usersService.delete(id);
      toast.success("Usuario eliminado");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar el usuario");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D32F2F]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 pt-24 font-sans">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <ShieldAlert className="h-8 w-8 text-[#D32F2F]" />
              Gestión de Usuarios
            </h1>
            <p className="text-slate-500 mt-1">
              Administra el personal, sus roles y accesos al sistema.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver
            </Button>
            <Button onClick={handleCreate} className="bg-[#D32F2F] hover:bg-red-700 text-white gap-2">
              <Plus className="w-4 h-4" /> Nuevo Usuario
            </Button>
          </div>
        </div>

        <Card className="border-t-4 border-t-[#D32F2F] shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 border rounded-md px-3 py-2 w-full max-w-sm bg-slate-50">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                placeholder="Buscar por nombre o correo..."
                className="bg-transparent border-none outline-none text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                        No se encontraron usuarios.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">
                              {user.nombres} {user.apellidos}
                            </span>
                            <span className="text-xs text-slate-500">{user.correo}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal bg-slate-50">
                            {user.rol}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {user.activo ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Activo
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                              <XCircle className="w-3 h-3 mr-1" /> Inactivo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => handleEdit(user)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            {currentUser?.email !== user.correo && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(user.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg bg-white">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Modifica los datos del usuario. Deja la contraseña vacía para mantener la actual."
                  : "Completa el formulario para registrar un nuevo usuario en el sistema."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombres</Label>
                  <Input {...register("nombres")} placeholder="Ej: Juan Andrés" />
                  {errors.nombres && <p className="text-xs text-red-500">{errors.nombres.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Apellidos</Label>
                  <Input {...register("apellidos")} placeholder="Ej: Pérez Cotapos" />
                  {errors.apellidos && <p className="text-xs text-red-500">{errors.apellidos.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Correo Electrónico</Label>
                <Input {...register("correo")} type="email" placeholder="usuario@byg.cl" />
                {errors.correo && <p className="text-xs text-red-500">{errors.correo.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Select
                    onValueChange={(val) => setValue("rol", val)}
                    defaultValue={watch("rol")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Administrador">Administrador</SelectItem>
                      <SelectItem value="Bodeguero">Bodeguero</SelectItem>
                      <SelectItem value="Solicitante">Solicitante</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.rol && <p className="text-xs text-red-500">{errors.rol.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select
                    onValueChange={(val) => setValue("activo", val === "true")}
                    defaultValue={watch("activo") ? "true" : "false"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="true">Activo</SelectItem>
                      <SelectItem value="false">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t mt-2">
                <Label className="flex items-center gap-2">
                  Contraseña {editingId && <span className="text-xs font-normal text-slate-400">(Opcional)</span>}
                </Label>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder={editingId ? "••••••••" : "Mínimo 6 caracteres"}
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#D32F2F] hover:bg-red-700 text-white" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Usuario"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}