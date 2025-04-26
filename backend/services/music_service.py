from typing import List, Optional
from bson import ObjectId
from models.music import Music
import db  


def create_music(music: Music) -> Music:
    """Inserta un music en MongoDB y retorna el modelo con ID asignado."""
    data = music.dict(by_alias=True, exclude={"id"})  # Excluye el campo id, no se debe enviar
    result = db.db["music"].insert_one(data)  # MongoDB genera automáticamente el _id
    music.id = str(result.inserted_id)  # Asigna el _id generado por MongoDB
    return music


def get_music(music_id: str) -> Optional[Music]:
    """Busca un music por ObjectId y retorna el modelo o None."""
    doc = db.db["music"].find_one({"_id": ObjectId(music_id)})
    if doc:
        doc["id"] = str(doc["_id"])                  
        del doc["_id"]                               
        return Music(**doc)                             
    return None


def list_music() -> List[Music]:
    """Devuelve lista de todos los music como modelos Pydantic."""
    music: List[Music] = []
    for doc in db.db["music"].find():
        doc["id"] = str(doc["_id"])                   
        del doc["_id"]                                 
        music.append(Music(**doc))                    
    return music

def delete_music(music_id: str):
    """Elimina un music por ObjectId."""
    try:
        result = db.db["music"].delete_one({"_id": ObjectId(music_id)})
        if result.deleted_count == 0:
            return None  # No se encontró el music para eliminar
        return True  # El music fue eliminado correctamente
    except Exception as e:
        # Manejo de excepciones para capturar cualquier error durante la eliminación
        print(f"Error eliminando music: {e}")
        return None

def update_music(music_data: dict) -> bool:
    """
    Actualiza un music existente.
    Retorna True si la actualización fue exitosa, False si no se encontró el music.
    Lanza excepciones para casos de error.
    """
    music_dict = music_data.copy()

    try:
        if "_id" not in music_dict or not music_dict["_id"]:
            raise HTTPException(status_code=400, detail="Se requiere _id para actualización")

        music_id = str(music_dict["_id"])
        _id = ObjectId(music_id)
        
        music_dict.pop("_id", None)
        
        result = db.db["music"].update_one(
            {"_id": _id},
            {"$set": music_dict}
        )

        return result.matched_count > 0

    except InvalidId:
        raise HTTPException(status_code=400, detail="ID inválido")
    except Exception as e:
        print(f"Error en update_music: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")