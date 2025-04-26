from typing import List
from bson import ObjectId
from models.cinema import Cinema
import db

def create_cinema(cinema: Cinema):
    """Inserta un cinema en MongoDB y retorna el modelo con ID asignado."""
    data = cinema.dict(by_alias=True, exclude={"id"})  # Excluye el campo id, no se debe enviar
    result = db.db["cinemas"].insert_one(data)  # MongoDB genera automáticamente el _id
    cinema.id = str(result.inserted_id)  # Asigna el _id generado por MongoDB
    return cinema


def get_cinema(cinema_id: str) -> Cinema:
    """Busca un cinema por ObjectId y retorna el modelo."""
    doc = db.db["cinemas"].find_one({"_id": ObjectId(cinema_id)})
    if doc:
        doc["id"] = str(doc["_id"])                  
        del doc["_id"]                               
        return Cinema(**doc)                             
    return None


def list_cinemas() -> List[Cinema]:
    """Devuelve lista de todos los cinemas como modelos Pydantic."""
    cinemas: List[Cinema] = []
    for doc in db.db["cinemas"].find():
        doc["id"] = str(doc["_id"])                   
        del doc["_id"]                                 
        cinemas.append(Cinema(**doc))                    
    return cinemas

def delete_cinema(cinema_id: str):
    """Elimina un cinema por ObjectId."""
    try:
        result = db.db["cinemas"].delete_one({"_id": ObjectId(cinema_id)})
        if result.deleted_count == 0:
            return None  # No se encontró el cinema para eliminar
        return True  # El cinema fue eliminado correctamente
    except Exception as e:
        # Manejo de excepciones para capturar cualquier error durante la eliminación
        print(f"Error eliminando cinema: {e}")
        return None

def update_cinema(cinema_data: dict) -> bool:
    """Actualiza un cinema en MongoDB."""
    try:
        result = db.db["cinemas"].update_one({"_id": ObjectId(cinema_data["id"])}, {"$set": cinema_data})
        if result.modified_count == 0:
            return False  # No se encontró el cinema para actualizar
        return True  # El cinema fue actualizado correctamente
    except Exception as e:
        # Manejo de excepciones para capturar cualquier error durante la actualización
        print(f"Error actualizando cinema: {e}")
        return False