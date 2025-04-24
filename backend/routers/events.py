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
@router.post("/")
def create_event_endpoint(event: Event):
    print(event.dict())  
    return create_event(event)

# Actualizar evento (PUT)
@router.put("/{event_id}")
async def update_event_endpoint(event_id: str, event_data: Event):
    event_dict = event_data.dict()
    event_dict["_id"] = event_id
    success = update_event(event_dict)
    if not success:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return {"status": "success"}