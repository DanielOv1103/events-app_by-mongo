import { Edit2, MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const CustomTable = ({
    data = [],
    columns = [],
    options = {},
    onSelect,
    onSelectAll,
    onEdit,
    onDelete,
    selectedItems = []
}) => {
    // Configuración por defecto
    const {
        showCheckbox = true,
        showActions = true,
        showAvatar = true,
        emptyMessage = "No se encontraron datos.",
        rowClassName = "",
        nameField = "name",
        emailField = "email"
    } = options

    // Función para obtener iniciales
    const getInitials = (name) => {
        if (!name) return "NN"
        const names = name.split(" ")
        return names.map(n => n[0]).join("").toUpperCase()
    }

    // Función para determinar el estilo del badge según el valor
    const getBadgeStyle = (value) => {
        if (value === "Administrador") return "bg-purple-100 border-none text-purple-800 dark:bg-purple-900 dark:text-purple-200"
        if (value === "Usuario") return "bg-blue-100 border-none text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        if (value === "Editor") return "bg-green-100 border-none text-green-800 dark:bg-green-900 dark:text-green-200"
        if (value === "Moderador") return "bg-violet-100 border-none text-violet-800 dark:bg-violet-900 dark:text-violet-200"
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }

    return (
        <div className="rounded-md border border-gray-100 p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        {showCheckbox && (
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={data.length > 0 && selectedItems.length === data.length}
                                    onCheckedChange={onSelectAll}
                                    aria-label="Seleccionar todos"
                                />
                            </TableHead>
                        )}

                        {columns.map((column) => (
                            <TableHead key={column.key} className={column.className || ""}>
                                {column.title}
                            </TableHead>
                        ))}

                        {showActions && <TableHead className="text-right">Acciones</TableHead>}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length + (showCheckbox ? 1 : 0) + (showActions ? 1 : 0)}
                                className="h-24 text-center"
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <TableRow key={item.id} className={`group ${rowClassName}`}>
                                {showCheckbox && (
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedItems.includes(item.id)}
                                            onCheckedChange={() => onSelect?.(item.id)}
                                            aria-label={`Seleccionar ${item[nameField]}`}
                                        />
                                    </TableCell>
                                )}

                                {columns.map((column) => {
                                    if (column.render) {
                                        return (
                                            <TableCell key={column.key} className={column.cellClassName || ""}>
                                                {column.render(item)}
                                            </TableCell>
                                        )
                                    }

                                    if (column.key === "user") {
                                        return (
                                            <TableCell key={column.key}>
                                                <div className="flex items-center gap-3">
                                                    {showAvatar && (
                                                        <Avatar className="h-8 w-8 border border-gray-200">
                                                            {item.image ? (
                                                                <AvatarImage
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                                                />
                                                            ) : null}
                                                            <AvatarFallback>
                                                                {getInitials(item.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                    <div>
                                                        <div className="font-medium">{item[nameField]}</div>
                                                        {column.showEmailMobile && (
                                                            <div className="text-xs text-muted-foreground md:hidden">
                                                                {item[emailField]}
                                                            </div>
                                                        )}
                                                        {column.showRoleMobile && (
                                                            <div className="text-xs text-muted-foreground md:hidden mt-1">
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`${getBadgeStyle(item.role)} px-1.5 py-0 text-xs`}
                                                                >
                                                                    {item.role}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        )
                                    }

                                    if (column.key === "role") {
                                        return (
                                            <TableCell key={column.key} className={column.cellClassName || ""}>
                                                <Badge
                                                    variant="outline"
                                                    className={`${getBadgeStyle(item.role)} px-2 py-0.5`}
                                                >
                                                    {item.role}
                                                </Badge>
                                            </TableCell>
                                        )
                                    }

                                    if (column.key === "status") {
                                        return (
                                            <TableCell key={column.key} className={column.cellClassName || ""}>
                                                <Badge
                                                    variant="outline"
                                                    className={`capitalize ${item.user_active !== false ?  // Cambiado a user_active
                                                            "bg-green-100 border-none text-green-800 dark:bg-green-900 dark:text-green-200" :
                                                            "bg-red-100 border-none text-red-800 dark:bg-red-900 dark:text-red-200"
                                                        }`}
                                                >
                                                    {item.user_active !== false ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </TableCell>
                                        )
                                    }

                                    return (
                                        <TableCell key={column.key} className={column.cellClassName || ""}>
                                            {item[column.key]}
                                        </TableCell>
                                    )
                                })}

                                {showActions && (
                                    <TableCell className="text-right">
                                        <div className="flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit?.(item)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                                <span className="sr-only">Editar</span>
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Abrir menú</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="bg-white border-none" align="end">
                                                    <DropdownMenuItem onClick={() => onEdit?.(item)}>
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => onDelete?.(item)}
                                                    >
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default CustomTable