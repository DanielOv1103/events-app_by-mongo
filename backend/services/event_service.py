from typing import List, Optional
from bson import ObjectId
from models.event import Event
import db  


def create_event(event: Event) -> Event:
    """Inserta un evento en MongoDB y retorna el modelo con ID asignado."""
    data = event.dict(by_alias=True, exclude={"id"})  
    result = db.db["events"].insert_one(data)       
    event.id = str(result.inserted_id)                 
    return event


def get_event(event_id: str) -> Optional[Event]:
    """Busca un evento por ObjectId y retorna el modelo o None."""
    doc = db.db["events"].find_one({"_id": ObjectId(event_id)})
    if doc:
        doc["id"] = str(doc["_id"])                  
        del doc["_id"]                               
        return Event(**doc)                             
    return None


def list_events() -> List[Event]:
    """Devuelve lista de todos los eventos como modelos Pydantic."""
    events: List[Event] = []
    for doc in db.db["events"].find():
        doc["id"] = str(doc["_id"])                   
        del doc["_id"]                                 
        events.append(Event(**doc))                    
    return events

def delete_event(event_id: str):
    """Elimina un evento por ObjectId."""
    try:
        result = db.db["events"].delete_one({"_id": ObjectId(event_id)})
        if result.deleted_count == 0:
            return None  # No se encontró el evento para eliminar
        return True  # El evento fue eliminado correctamente
    except Exception as e:
        # Manejo de excepciones para capturar cualquier error durante la eliminación
        print(f"Error eliminando evento: {e}")
        return None

def update_event(event_id: str, event: Event) -> None:
    """Actualiza un evento por ObjectId."""
    db.db["events"].update_one({"_id": ObjectId(event_id)}, {"$set": event.dict(by_alias=True, exclude={"id"})})
    return None
