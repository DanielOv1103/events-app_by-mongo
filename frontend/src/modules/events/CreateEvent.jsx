import React, { useState, useEffect } from 'react'
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateEvent({ event, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    category: '',
    image: ''
  })

  useEffect(() => {
    if (event) {
      // Asegurarse de que todos los valores sean strings válidos para inputs controlados
      setFormData({
        name: event.name ?? "",
        description: event.description ?? "",
        start_time: event.start_time?.slice(0, 16) ?? "", // datetime-local needs format: YYYY-MM-DDTHH:mm
        end_time: event.end_time?.slice(0, 16) ?? "",
        location: event.location ?? "",
        category: event.category ?? "",
        image: event.image ?? "",
        _id: event._id ?? undefined, // lo incluimos por si es actualización
      })
    }
  }, [event])


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  
    const eventData = {
      _id: formData._id ?? undefined,
      name: formData.name,
      description: formData.description,
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
      location: formData.location,
      category: formData.category,
      image: formData.image
    }
  
    onSave(eventData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{event ? "Editar Evento" : "Nuevo Evento"}</h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Inicio</Label>
              <Input id="start_time" name="start_time" type="datetime-local" value={formData.start_time} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">Fin</Label>
              <Input id="end_time" name="end_time" type="datetime-local" value={formData.end_time} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select key={formData.category} value={formData.category}  onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder={formData.category || "Selecciona una categoría"}/>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Conferencia">Conferencia</SelectItem>
                <SelectItem value="Taller">Taller</SelectItem>
                <SelectItem value="Concierto">Concierto</SelectItem>
                <SelectItem value="Exposición">Exposición</SelectItem>
                <SelectItem value="Festival">Festival</SelectItem>
                <SelectItem value="Networking">Networking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL de Imagen</Label>
            <Input id="image" name="image" value={formData.image} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
            >
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
