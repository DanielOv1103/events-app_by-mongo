import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import userServices from "../../api/userServices" // Asegúrate de importar userServices

export default function RoleEditorModal({
    selectedCount = 0,
    selectedUserId = null,
    onChangeRole,
    onCancel
}) {
    const roles = [
        { id: "Administrador", name: "Administrador", description: "Acceso completo a todas las funciones" },
        { id: "Editor", name: "Editor", description: "Puede crear y editar contenido" },
        { id: "Moderator", name: "Moderador", description: "Puede moderar contenido y usuarios" },
        { id: "Usuario", name: "Usuario", description: "Acceso básico a la plataforma" },
    ]

    const [selectedRole, setSelectedRole] = useState("Usuario") // Valor por defecto
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchUserData = async () => {
        if (selectedUserId) {
            setLoading(true)
            try {
                const data = await userServices.getUserById(selectedUserId)
                setUserData(data)
                setSelectedRole(data.role || "Usuario") // Establece el rol actual del usuario
            } catch (error) {
                console.error("Error fetching user data:", error)
            } finally {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        if (selectedUserId) {
            fetchUserData()
        } else {
            // Resetear para edición masiva
            setUserData(null)
            setSelectedRole("Usuario")
        }
    }, [selectedUserId])

    const handleApply = () => {
        onChangeRole(selectedRole)
        onCancel()
    }

    const getModalTitle = () => {
        if (selectedUserId) {
            return "Editar Rol de Usuario"
        }
        return `Cambiar Roles (${selectedCount} seleccionados)`
    }

    const getDescriptionText = () => {
        if (selectedUserId && userData) {
            return `Estás editando el rol de ${userData.name || userData.email}`
        }
        return `Estás a punto de cambiar el rol de ${selectedCount} usuario(s)`
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">{getModalTitle()}</h2>
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-4">
                    <p className="text-sm text-gray-500 mb-4">
                        {getDescriptionText()}
                    </p>

                    <RadioGroup
                        value={selectedRole}
                        onValueChange={setSelectedRole}
                        className="space-y-3"
                    >
                        {roles.map((role) => (
                            <div key={role.id} className="flex items-start space-x-2 border rounded-md p-3 hover:bg-gray-50">
                                <RadioGroupItem value={role.id} id={role.id} className="mt-1" />
                                <div className="grid gap-1.5">
                                    <Label htmlFor={role.id} className="font-medium">
                                        {role.name}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">{role.description}</p>
                                </div>
                            </div>
                        ))}
                    </RadioGroup>

                    <div className="flex justify-end space-x-2 mt-6">
                        <Button variant="outline" onClick={onCancel}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleApply}
                            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                            disabled={loading}
                        >
                            {loading ? "Cargando..." : "Aplicar Cambios"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}