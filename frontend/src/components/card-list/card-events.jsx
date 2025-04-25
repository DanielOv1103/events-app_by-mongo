import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Edit2, Trash2, Clock } from "lucide-react"


const CardEvents = ({ event, onEdit, onDelete }) => {
    // Si event es undefined/null, muestra un mensaje o retorna null
    if (!event) {
        return <div className="bg-white rounded-lg shadow p-4">Evento no disponible</div>;
        // o return null; si prefieres no renderizar nada
    }

    const startDate = event.start_time ? new Date(event.start_time) : null;
    const endDate = event.end_time ? new Date(event.end_time) : null;

    const startDateStr = startDate ? startDate.toLocaleDateString() : 'Fecha no disponible';
    const endDateStr = endDate ? endDate.toLocaleDateString() : 'Fecha no disponible';

    const startTimeStr = startDate ? startDate.toLocaleTimeString() : 'Hora no disponible';
    const endTimeStr = endDate ? endDate.toLocaleTimeString() : 'Hora no disponible';
    const url = event.image ? event.image : '/placeholder.svg?height=32&width=32'
    console.log(url)
    return (
        <>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group border-none">
                <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url(${event.image})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                        <Badge className="mb-2 text-white bg-violet-600 hover:bg-violet-700 rounded-2xl">{event.category}</Badge>
                        <h3 className="text-xl font-bold text-white">{event.name}</h3>
                    </div>
                </div>
                <CardContent className="pt-4">
                    <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2 text-violet-500" />
                            <span>
                                {startDateStr} - {endDateStr}
                            </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-2 text-violet-500" />
                            <span>{startTimeStr} - {endTimeStr} </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-2 text-violet-500" />
                            <span>{event.location && (
                                <p className="text-gray-500 text-sm mt-1">Ubicación: {event.location}</p>
                            )}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-2">{event.description}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="text-violet-500 hover:bg-violet-700 hover:text-white"
                        onClick={onEdit}
                    >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:bg-red-700 hover:text-white"
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