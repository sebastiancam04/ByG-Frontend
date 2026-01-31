"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import axios from "axios"
import { 
  Users, 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Loader2, 
  UserCheck, 
  UserX,
  Pencil,
  AlertTriangle 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { usersService } from "@/services/users.service"
import { User, CreateUserDto } from "@/types/users"

export default function UsuariosPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estados
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateUserDto>()

  // 1. Cargar Usuarios
  const fetchUsers = async () => {
    try {
      const data = await usersService.getAll()
      setUsers(data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Sesión expirada")
        router.push("/login")
        return
      }
      toast.error("Error al cargar usuarios")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // 2. Guardar (Crear/Editar)
  const onSubmit = async (data: CreateUserDto) => {
    setProcessing(true)
    try {
      if (editingId) {
        await usersService.update(editingId, data)
        toast.success("Usuario actualizado correctamente")
      } else {
        await usersService.create(data)
        toast.success("Usuario creado exitosamente")
      }
      resetForm()
      fetchUsers()
    } catch (error) {
      let mensaje = "Error en la operación";
      if (axios.isAxiosError(error) && error.response?.data?.mensaje) {
        mensaje = error.response.data.mensaje;
      }
      toast.error(mensaje)
    } finally {
      setProcessing(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingId(user.id)
    setShowCreateForm(true)
    setValue("nombres", user.nombres)
    setValue("apellidoPaterno", user.apellidoPaterno)
    setValue("apellidoMaterno", user.apellidoMaterno)
    setValue("rut", user.rut)
    setValue("correo", user.correo)
    setValue("telefono", user.telefono || "")
    setValue("rol", user.rol)
    setValue("password", "")
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setEditingId(null)
    setShowCreateForm(false)
    reset()
  }

  // 3. Eliminar (Solicitar)
  const requestDelete = (id: number) => {
    setUserToDelete(id)
  }

  // 4. Eliminar (Confirmar)
  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await usersService.delete(userToDelete)
      toast.success("Usuario desactivado")
      fetchUsers()
    } catch (error) {
      toast.error("No se pudo desactivar")
    } finally {
      setUserToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
         <Loader2 className="h-8 w-8 animate-spin text-[#D32F2F]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 pt-24 font-sans relative">
      
      {/* --- MODAL DE CONFIRMACIÓN (CORREGIDO) --- */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <Card className="w-full max-w-sm shadow-2xl border-0 scale-100 animate-in zoom-in-95 duration-200">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-lg font-bold">¿Desactivar Usuario?</CardTitle>
              <CardDescription className="text-sm mt-2">
                Esta acción quitará el acceso al sistema a este usuario inmediatamente.
              </CardDescription>
            </CardHeader>
            {/* ✅ AQUÍ ESTÁ EL ARREGLO: flex-1 en lugar de w-full */}
            <CardFooter className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setUserToDelete(null)}
                className="flex-1" // Ocupa el 50%
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white" // Ocupa el otro 50%
                onClick={confirmDelete}
              >
                Sí, Desactivar
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="container mx-auto max-w-6xl space-y-6">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Users className="h-8 w-8 text-[#D32F2F]" />
              Gestión de Usuarios
            </h1>
            <p className="text-slate-500 mt-1">
              Administra el personal con acceso a la plataforma.
            </p>
          </div>
          <div className="flex gap-3">
             <Link href="/dashboard/admin">
                <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Volver
                </Button>
            </Link>
            <Button 
                className={editingId ? "bg-blue-600 hover:bg-blue-700 gap-2" : "bg-[#D32F2F] hover:bg-red-700 gap-2"}
                onClick={() => {
                    if(showCreateForm) resetForm();
                    else setShowCreateForm(true);
                }}
            >
                {showCreateForm ? <UserX className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
                {showCreateForm ? "Cancelar" : "Nuevo Usuario"}
            </Button>
          </div>
        </div>

        {/* FORMULARIO */}
        {showCreateForm && (
            <Card className={`animate-in slide-in-from-top-4 border-l-4 ${editingId ? 'border-l-blue-500' : 'border-l-[#D32F2F]'}`}>
                <CardHeader>
                    <CardTitle>{editingId ? "Editar Usuario Existente" : "Registrar Nuevo Personal"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nombres</Label>
                            <Input {...register("nombres", { required: true })} />
                            {errors.nombres && <span className="text-red-500 text-xs">Requerido</span>}
                        </div>
                        <div className="space-y-2">
                            <Label>Apellido Paterno</Label>
                            <Input {...register("apellidoPaterno", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Apellido Materno</Label>
                            <Input {...register("apellidoMaterno", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label>RUT</Label>
                            <Input {...register("rut", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Correo Corporativo</Label>
                            <Input type="email" {...register("correo", { required: true })} />
                        </div>
                         <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input {...register("telefono")} />
                        </div>
                        <div className="space-y-2">
                            <Label>
                                Contraseña 
                                {editingId && <span className="text-xs text-slate-400 font-normal ml-2">(Dejar en blanco para mantener)</span>}
                            </Label>
                            <Input 
                                type="password" 
                                {...register("password", { required: !editingId, minLength: 6 })} 
                                placeholder={editingId ? "********" : "Mínimo 6 caracteres"}
                            />
                            {errors.password && <span className="text-red-500 text-xs">Requerido (Mín. 6)</span>}
                        </div>
                        <div className="space-y-2">
                            <Label>Rol</Label>
                            <select 
                                {...register("rol", { required: true })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Seleccione...</option>
                                <option value="Solicitante">Solicitante</option>
                                <option value="Bodeguero">Bodeguero</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex justify-end mt-4 gap-2">
                            <Button type="button" variant="ghost" onClick={resetForm}>Cancelar</Button>
                            <Button 
                                type="submit" 
                                className={editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-900 hover:bg-slate-800"} 
                                disabled={processing}
                            >
                                {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {editingId ? "Actualizar Usuario" : "Guardar Usuario"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )}

        {/* TABLA */}
        <Card>
            <CardContent className="p-0 overflow-hidden">
                <div className="w-full overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-slate-500 bg-slate-50 border-b">
                            <tr>
                                <th className="h-12 px-4 font-medium align-middle">Nombre Completo</th>
                                <th className="h-12 px-4 font-medium align-middle">RUT</th>
                                <th className="h-12 px-4 font-medium align-middle">Correo</th>
                                <th className="h-12 px-4 font-medium align-middle">Rol</th>
                                <th className="h-12 px-4 font-medium align-middle">Estado</th>
                                <th className="h-12 px-4 font-medium align-middle text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {users.map((user) => (
                                <tr key={user.id} className={`border-b transition-colors hover:bg-slate-50/50 ${editingId === user.id ? 'bg-blue-50' : ''}`}>
                                    <td className="p-4 align-middle font-medium">
                                        {user.nombres} {user.apellidoPaterno} {user.apellidoMaterno}
                                    </td>
                                    <td className="p-4 align-middle">{user.rut}</td>
                                    <td className="p-4 align-middle">{user.correo}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                                            ${user.rol === 'Administrador' ? 'bg-red-100 text-red-700' : 
                                              user.rol === 'Bodeguero' ? 'bg-orange-100 text-orange-700' : 
                                              'bg-blue-100 text-blue-700'}`}>
                                            {user.rol}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        {user.activo ? (
                                            <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                                <UserCheck className="w-3 h-3" /> Activo
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                                                <UserX className="w-3 h-3" /> Inactivo
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        {user.activo && (
                                            <div className="flex justify-end gap-1">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                    onClick={() => handleEdit(user)}
                                                    title="Editar Usuario"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => requestDelete(user.id)} 
                                                    title="Desactivar Usuario"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-slate-500 h-24">
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  )
}