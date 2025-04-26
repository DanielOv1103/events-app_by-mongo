import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Calendar, Users, Bell, Music, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()
    const pathname = location.pathname

    const routes = [
        { name: "Eventos", path: "/events", icon: <Calendar className="h-4 w-4 mr-2" /> },
        { name: "Usuarios", path: "/users", icon: <Users className="h-4 w-4 mr-2" /> },
        { name: "Música", path: "/musica", icon: <Music className="h-4 w-4 mr-2" /> },
        { name: "Otros", path: "/otros", icon: <Shield className="h-4 w-4 mr-2" /> },
    ]

    const isActive = (path) => {
        return pathname === path
    }

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo y nombre */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
                                EventMaster
                            </span>
                        </Link>
                    </div>

                    {/* Enlaces de navegación - Escritorio */}
                    <div className="hidden md:flex items-center space-x-4">
                        {routes.map((route) => (
                            <Link
                                key={route.path}
                                to={route.path}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(route.path)
                                    ? "bg-violet-100 text-violet-700"
                                    : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                                    }`}
                            >
                                {route.icon}
                                {route.name}
                            </Link>
                        ))}
                    </div>

                    {/* Perfil y notificaciones */}
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Perfil</DropdownMenuItem>
                                <DropdownMenuItem>Configuración</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Botón de menú móvil */}
                        <div className="md:hidden">
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Menú móvil */}
                {isOpen && (
                    <div className="md:hidden py-2 space-y-1">
                        {routes.map((route) => (
                            <Link
                                key={route.path}
                                to={route.path}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive(route.path)
                                    ? "bg-violet-100 text-violet-700"
                                    : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {route.icon}
                                {route.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    )
}