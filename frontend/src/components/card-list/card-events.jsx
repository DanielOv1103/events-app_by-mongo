import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Edit2, Trash2 } from "lucide-react"


const CardEvents = ({ event, onEdit, onDelete }) => {
    // Si event es undefined/null, muestra un mensaje o retorna null
    if (!event) {
        return <div className="bg-white rounded-lg shadow p-4">Evento no disponible</div>;
        // o return null; si prefieres no renderizar nada
    }

    return (
        <>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
                <div className="h-52 w-full bg-cover bg-center bg-no-repeat bg-[url('https://i.pinimg.com/736x/94/df/4d/94df4db56dc4aa5df828fdb5917a8622.jpg')] relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                        <Badge className="mb-2 bg-violet-600 hover:bg-violet-700">Evento</Badge>
                        <h3 className="text-xl font-bold text-white">{event.name}</h3>
                    </div>
                </div>
                <CardContent className="pt-4">
                    <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2 text-violet-500" />
                            <span>
                                {event.start_time ? new Date(event.start_time).toLocaleString() : 'Fecha no disponible'} -
                                {event.end_time ? new Date(event.end_time).toLocaleString() : 'Fecha no disponible'}
                            </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-2 text-violet-500" />
                            <span>{event.location && (
                                <p className="text-gray-500 text-sm mt-1">Ubicación: {event.location}</p>
                            )}</span>
                        </div>
                        {/* <p className="text-sm text-gray-600 line-clamp-2 mt-2">{event.description}</p> */}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                    <Button variant="outline" size="sm"
                    onClick={onEdit}
                    >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:border-red-200"
                    onClick={onDelete}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                    </Button>
                </CardFooter>
            </Card>
        </>
    )
}

export default CardEvents;