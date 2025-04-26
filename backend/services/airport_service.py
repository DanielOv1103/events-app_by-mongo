from typing import List
from bson import ObjectId
from models.airport import Airport
import db

def create_airport(airport: Airport):
    """Inserta un aeropuerto en MongoDB y retorna el modelo con ID asignado."""
    data = airport.dict(by_alias=True, exclude={"id"})  # Excluye el campo id, no se debe enviar
    result = db.db["airports"].insert_one(data)  # MongoDB genera automáticamente el _id
    airport.id = str(result.inserted_id)  # Asigna el _id generado por MongoDB
    return airport


def get_airport(airport_id: str) -> Airport:
    """Busca un aeropuerto por ObjectId y retorna el modelo."""
    doc = db.db["airports"].find_one({"_id": ObjectId(airport_id)})
    if doc:
        doc["id"] = str(doc["_id"])                  
        del doc["_id"]                               
        return Airport(**doc)                             
    return None


def list_airports() -> List[Airport]:
    """Devuelve lista de todos los aeropuertos como modelos Pydantic."""
    airports: List[Airport] = []
    for doc in db.db["airports"].find():
        doc["id"] = str(doc["_id"])                   
        del doc["_id"]                                 
        airports.append(Airport(**doc))                    
    return airports

def delete_airport(airport_id: str):
    """Elimina un aeropuerto por ObjectId."""
    try:
        result = db.db["airports"].delete_one({"_id": ObjectId(airport_id)})
        if result.deleted_count == 0:
            return None  # No se encontró el aeropuerto para eliminar
        return True  # El aeropuerto fue eliminado correctamente
    except Exception as e:
        # Manejo de excepciones para capturar cualquier error durante la eliminación
        print(f"Error eliminando aeropuerto: {e}")
        return None

def update_airport(airport_data: dict) -> bool:
    """Actualiza un aeropuerto en MongoDB."""
    try:
        result = db.db["airports"].update_one({"_id": ObjectId(airport_data["id"])}, {"$set": airport_data})
        if result.modified_count == 0:
            return False  # No se encontró el aeropuerto para actualizar
        return True  # El aeropuerto fue actualizado correctamente
    except Exception as e:
        # Manejo de excepciones para capturar cualquier error durante la actualización
        print(f"Error actualizando aeropuerto: {e}")
        return False