import { act, useState } from "react";
import { UsersComponent } from "../../modules/index";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { UserForm } from "../../modules/index";
import userServices from "../../api/userServices";

export default function UserPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const handleOpenCreateForm = () => {
        setCurrentUser(null);
        setIsCreating(true);
        setIsFormOpen(true);
    };

    const handleSaveUser = async (userData) => {
        setLoading(true);
        try {
            const completeData = {
                ...userData,
                last_name: userData.last_name || '',
                name_user: userData.name_user || userData.email.split('@')[0],
                created_day: userData.created_day || new Date().toISOString(),
                user_active: Boolean(userData.user_active), // Cambiado a user_active
                updated_day: new Date().toISOString()
            };

            if (isCreating) {
                await userServices.createUser(completeData);
                setSuccess('Usuario creado correctamente');
            } else {
                await userServices.updateUser(userData.id, completeData);
                setSuccess('Usuario actualizado correctamente');
            }

            setIsFormOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error al guardar el usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                <Button
                    onClick={handleOpenCreateForm}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 transition-all duration-300"
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nuevo Usuario
                </Button>
            </div>

            {/* Mostrar mensajes de error/success */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                </div>
            )}

            {/* Componente de lista de usuarios */}
            <div className="bg-white rounded-lg shadow">
                <UsersComponent
                    onEdit={(user) => {
                        setCurrentUser(user);
                        setIsCreating(false);
                        setIsFormOpen(true);
                    }}
                />
            </div>

            {/* Formulario modal */}
            {isFormOpen && (
                <UserForm
                    user={currentUser}
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleSaveUser}
                    isCreating={isCreating}
                    loading={loading}
                />
            )}
        </div>
    );
}