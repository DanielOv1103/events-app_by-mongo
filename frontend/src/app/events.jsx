import { NavBar } from "../modules/index"
import { CardEvents } from "../components/index"
import CreateEvent from "../pages/events/CreateEvent"
import React, { useState, useEffect } from 'react'
import eventService from '../api/eventService'

// Convierte 'YYYY-MM-DDTHH:MM' a ISO 8601 para la API
function formatToISO(dateLocal) {
    return new Date(dateLocal).toISOString()
}

export default function Events() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [currentEvent, setCurrentEvent] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    const fetchEvents = () => {
        setLoading(true)
        eventService.list()
            .then(data => setEvents(data))
            .catch(err => {
                console.error('Error fetching events:', err)
                setError('Error al cargar eventos')
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const [formData, setForm] = useState({
        name: '',
        description: '',
        start_time: '',
        end_time: '',
        location: '',
        category: '', // <-- corregido aquí
        image: ''
    })

    const handleEditEvent = (event) => {
        setCurrentEvent(event)
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
        try {
            const dataToSend = { ...eventData };
            await eventService.createEvent(dataToSend);
            setSuccess("Evento creado correctamente");
            fetchEvents();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsFormOpen(false);
            setCurrentEvent(null);
        }
    };

    const handleSaveEditEvent = async (eventData) => {
        try {
            if (!eventData._id) throw new Error("Falta el ID del evento a editar");

            await eventService.updateEvent(eventData._id, eventData);
            setSuccess("Evento actualizado correctamente");
            fetchEvents(); // Recargar eventos
        } catch (err) {
            setError(err.message);
        } finally {
            setIsFormOpen(false);
            setCurrentEvent(null);
        }
    }
        ;

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>
    }

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gray-100 p-4">
                <h1 className="text-3xl font-bold text-center mb-6">Lista de Eventos</h1>
                <div className="flex flex-wrap gap-6">
                    {events.map(evt => (
                        <CardEvents key={evt._id} event={evt} onEdit={() => handleEditEvent(evt)} onDelete={() => handleDeleteEvent(evt)} />
                    ))}
                </div>

                {isFormOpen &&
                    <CreateEvent
                        event={currentEvent}
                        onSave={handleSaveEditEvent}
                        onCancel={() => setIsFormOpen(false)}
                    />
                }
            </div>
        </>
    )
}
