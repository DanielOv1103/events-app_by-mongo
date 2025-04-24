import eventService from '../../api/eventService'
import { CreateEvent } from "../../modules/index"
import { CardEvents } from "../../components/index"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import React, { useState, useEffect } from 'react'

const EventsComponent = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [currentEvent, setCurrentEvent] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const fetchEvents = () => {
        setLoading(true)
        eventService.list()
            .then(setEvents)
            .catch(err => {
                console.error('Error fetching events:', err)
                setError('Error al cargar eventos')
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const handleEditEvent = (event) => {
        setCurrentEvent(event)
        setIsCreating(false)
        setIsFormOpen(true)
    }

    const handleOpenCreateForm = () => {
        setCurrentEvent(null)
        setIsCreating(true)
        setIsFormOpen(true)
    }

    const handleDeleteEvent = async (evt) => {
        try {
            await eventService.remove(evt._id)
            fetchEvents()
        } catch (err) {
            setError(err.message)
        } finally {
            setIsFormOpen(false)
            setCurrentEvent(null)
        }
    }

    const handleCreateEvent = async (eventData) => {
        setError(null)
        setSuccess(null)
        try {
            // Desestructurar para asegurarnos de no enviar el _id
            const { _id, ...eventWithoutId } = eventData;

            const formattedEvent = {
                ...eventWithoutId,
                start_time: new Date(eventData.start_time).toISOString(),
                end_time: new Date(eventData.end_time).toISOString(),
            }

            await eventService.createEvent(formattedEvent)
            setSuccess('Evento creado correctamente')
            fetchEvents()
            setIsFormOpen(false)
        } catch (err) {
            console.error('Error creating event:', err)
            setError(err.message)
        }
    }

    const handleSaveEditEvent = async (eventData) => {
        try {
            if (!eventData._id) throw new Error("Falta el ID del evento a editar")

            await eventService.updateEvent(eventData._id, eventData)
            setSuccess("Evento actualizado correctamente")
            fetchEvents()
        } catch (err) {
            setError(err.message)
        } finally {
            setIsFormOpen(false)
            setCurrentEvent(null)
        }
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Eventos Destacados</h1>
                <Button
                    onClick={handleOpenCreateForm}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 transition-all text-white duration-300"
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nuevo Evento
                </Button>
            </div>

            {loading ? (
                <p className="text-center">Cargando eventos...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {events.map(evt => (
                        <CardEvents
                            key={evt._id}
                            event={evt}
                            onEdit={() => handleEditEvent(evt)}
                            onDelete={() => handleDeleteEvent(evt)}
                        />
                    ))}
                </div>
            )}

            {error && (
                <div className="text-center text-red-500 mt-4">{error}</div>
            )}

            {isFormOpen && (
                <CreateEvent
                    event={currentEvent}
                    onSave={isCreating ? handleCreateEvent : handleSaveEditEvent}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </div>
    )
}

export default EventsComponent
