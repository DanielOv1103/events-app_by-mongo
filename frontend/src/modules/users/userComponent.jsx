import { useEffect, useState } from "react"
import { TableComponent } from "../../components/index"
import { UserForm } from "../../modules/index"
import userServices from "../../api/userServices"
import { Button } from "@/components/ui/button"
import { UserCog, Trash2 } from "lucide-react"
import { RoleEditorModal } from "../../modules/index"

export default function UsersComponent() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [isRoleEditorOpen, setIsRoleEditorOpen] = useState(false)

    // Configuración de columnas para la tabla
    const columns = [
        {
            key: "user",
            title: "Usuario",
            showEmailMobile: true
        },
        {
            key: "email",
            title: "Email",
            className: "hidden md:table-cell"
        },
        {
            key: "role",
            title: "Rol",
            className: "hidden md:table-cell"
        },
        {
            key: "status",
            title: "Estado",
            className: "hidden md:table-cell"
        }
    ]

    // Opciones para la tabla
    const options = {
        showCheckbox: true,
        showActions: true,
        showAvatar: true,
        emptyMessage: "No hay usuarios registrados",
        avatarField: "image",
        nameField: "name",
        emailField: "email"
    }

    // Obtener usuarios
    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await userServices.list()
            setUsers(response.data || response)
            setError(null)
        } catch (err) {
            console.error('Error fetching users:', err)
            setError('Error al cargar usuarios')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    // Formatear datos de usuarios para la tabla
    const formattedUsers = users.map(user => ({
        ...user,
        id: user._id || user.id,
        image: user.image || "",
        status: user.user_active !== false ? "Activo" : "Inactivo", // Considera true por defecto
        role: user.role || "user",
        user_active: user.user_active !== false // Asegura valor booleano
    }))

    const handleOpenCreateForm = () => {
        setCurrentUser(null)
        setIsCreating(true)
        setIsFormOpen(true)
    }

    const handleEdit = (user) => {
        setCurrentUser(user)
        setIsCreating(false)
        setIsFormOpen(true)
    }

    const handleDelete = async (user) => {
        try {
            await userServices.remove(user.id)
            setSuccess('Usuario eliminado correctamente')
            await fetchUsers()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleDeleteSelected = async () => {
        try {
            await Promise.all(selectedUsers.map(id => userServices.remove(id)))
            setSuccess(`${selectedUsers.length} usuarios eliminados correctamente`)
            setSelectedUsers([])
            await fetchUsers()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleSelect = (id) => {
        setSelectedUsers(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }

    const handleSelectAll = () => {
        setSelectedUsers(prev =>
            prev.length === formattedUsers.length
                ? []
                : formattedUsers.map(user => user.id)
        )
    }

    const handleBulkRoleChange = async (newRole) => {
        setLoading(true);
        try {
            // Si hay un ID específico, solo actualiza ese usuario
            if (selectedUsers.length === 1) {
                const userId = selectedUsers[0];
                const userData = users.find(u => (u._id || u.id) === userId);
                if (userData) {
                    const updatePayload = {
                        ...userData,
                        role: newRole,
                        updated_day: new Date().toISOString()
                    };
                    await userServices.updateUser(userId, updatePayload);
                }
            } else {
                // Actualización masiva
                await Promise.all(
                    selectedUsers.map(userId => {
                        const userData = users.find(u => (u._id || u.id) === userId);
                        if (!userData) return null;
    
                        const updatePayload = {
                            ...userData,
                            role: newRole,
                            updated_day: new Date().toISOString()
                        };
    
                        return userServices.updateUser(userId, updatePayload);
                    })
                );
            }
            
            await fetchUsers();
            setSuccess(selectedUsers.length === 1 
                ? "Rol actualizado correctamente." 
                : "Roles actualizados correctamente.");
            setSelectedUsers([]);
            setIsRoleEditorOpen(false);
        } catch (err) {
            console.error('Error details:', err.response?.data?.detail || err.message);
            setError(selectedUsers.length === 1 
                ? "Hubo un error al actualizar el rol." 
                : "Hubo un error al actualizar los roles.");
        } finally {
            setLoading(false);
        }
    };
    
    


    const handleSaveUser = async (userData) => {
        try {
            if (isCreating) {
                await userServices.createUser(userData)
                setSuccess('Usuario creado correctamente')
            } else {
                await userServices.updateUser(userData.id, userData)
                setSuccess('Usuario actualizado correctamente')
            }
            setIsFormOpen(false)
            await fetchUsers()
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="space-y-4 p-4">

            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                </div>
            )}

            <div className="flex items- justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRoleEditorOpen(true)}
                    disabled={selectedUsers.length === 0}
                    className="gap-2"
                >
                    <UserCog className="h-4 w-4" />
                    Cambiar Roles
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteSelected}
                    disabled={selectedUsers.length === 0}
                    className="text-red-700 gap-2"
                >
                    <Trash2 className="h-4 w-4" />
                    Eliminar Seleccionados
                </Button>
            </div>

            <TableComponent
                data={formattedUsers}
                columns={columns}
                options={options}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
                onEdit={handleEdit}
                onDelete={handleDelete}
                selectedItems={selectedUsers}
            />

            {isFormOpen && (
                <UserForm
                    user={currentUser}
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleSaveUser}
                    isCreating={isCreating}
                />
            )}

            {isRoleEditorOpen && (
                <RoleEditorModal
                    selectedCount={selectedUsers.length}
                    selectedUserId={selectedUsers.length === 1 ? selectedUsers[0] : null}
                    onChangeRole={handleBulkRoleChange}
                    onCancel={() => setIsRoleEditorOpen(false)}
                />
            )}
        </div>
    )
}