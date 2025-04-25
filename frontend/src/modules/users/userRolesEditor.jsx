import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function RoleEditorModal({
    selectedCount = 0,
    onChangeRole,
    onCancel
}) {
    const [selectedRole, setSelectedRole] = useState("user")
    const roles = [
        { id: "admin", name: "Administrador", description: "Acceso completo a todas las funciones" },
        { id: "editor", name: "Editor", description: "Puede crear y editar contenido" },
        { id: "moderator", name: "Moderador", description: "Puede moderar contenido y usuarios" },
        { id: "user", name: "Usuario", description: "Acceso básico a la plataforma" },
    ]

    const handleApply = () => {
        onChangeRole(selectedRole)
        onCancel()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Cambiar Roles</h2>
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-4">
                    <p className="text-sm text-gray-500 mb-4">
                        Estás a punto de cambiar el rol de <strong>{selectedCount}</strong> usuario(s).
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
                        >
                            Aplicar Cambios
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}