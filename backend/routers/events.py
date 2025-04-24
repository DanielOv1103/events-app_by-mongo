from fastapi import APIRouter, HTTPException
from models.event import Event
from services.event_service import create_event, get_event, list_events, delete_event, update_event

router = APIRouter()

@router.get("/{event_id}", response_model=Event)
def get_event_endpoint(event_id: str):
    event = get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.get("/", response_model=list[Event])
def list_events_endpoint():
    return list_events()

@router.delete("/{event_id}")
def delete_event_endpoint(event_id: str):
    result = delete_event(event_id)  # Llama a la función delete_event del servicio
    if result is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Evento eliminado con éxito"}

# Crear evento (POST)
@router.post("/events")
async def create_event(event: Event):
    try:
        event_data = event.dict(exclude={"id"})  # Excluir id para creación
        new_event = await Event.insert_one(event_data)
        created_event = await Event.find_one({"_id": new_event.inserted_id})
        return created_event
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/events/{event_id}")
async def update_event_endpoint(event_id: str, event_data: dict):
    try:
        # Asegurar que el ID de la URL coincida con el del cuerpo
        event_data["_id"] = event_id
        success = update_event(event_data)
        if not success:
            raise HTTPException(status_code=404, detail="Evento no encontrado")
        return {"status": "success"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))