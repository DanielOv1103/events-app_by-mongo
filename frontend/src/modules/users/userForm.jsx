import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserForm({
    user = null,
    isOpen = false,
    onClose,
    onSubmit,
    isCreating = false
}) {
    const [formData, setFormData] = useState({
        name: user?.name || "",
        last_name: user?.last_name || "",
        name_user: user?.name_user || "",
        image: user?.image || "",
        email: user?.email || "",
        role: user?.role || "Usuario",
        active: user?.active || false,
        id: user?.id || null,
        created_day: user?.created_day || new Date().toISOString(), // Auto-generar si es nuevo
        updated_day: new Date().toISOString() // Siempre la fecha actual
    })

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (value) => {
        setFormData(prev => ({ ...prev, role: value }))
    }

    const handleSwitchChange = (checked) => {
        setFormData(prev => ({ ...prev, active: checked }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleCancel = () => {
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">
                        {user ? "Editar Usuario" : "Nuevo Usuario"}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="last_name">Apellido</Label>
                        <Input
                            id="last_name"
                            name="last_name"
                            value={formData.last_name || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name_user">Nombre de usuario</Label>
                        <Input
                            id="name_user"
                            name="name_user"
                            value={formData.name_user || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Rol</Label>
                        <Select key={formData.role} value={formData.role} onValueChange={handleSelectChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="Administrador">Administrador</SelectItem>
                                <SelectItem value="Editor">Editor</SelectItem>
                                <SelectItem value="Moderador">Moderador</SelectItem>
                                <SelectItem value="Usuario">Usuario</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">URL de Imagen</Label> {/* Cambiado de avatar a image */}
                        <Input
                            id="image"  // Cambiado de avatar a image
                            name="image"  // Cambiado de avatar a image
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <Label htmlFor="active" className="text-sm font-medium leading-none cursor-pointer">
                            Usuario activo
                        </Label>
                        <Switch
                            id="active"
                            checked={formData.active}
                            onCheckedChange={handleSwitchChange}
                            className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-200"
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700"
                        >
                            {isCreating ? "Crear Usuario" : "Guardar Cambios"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}