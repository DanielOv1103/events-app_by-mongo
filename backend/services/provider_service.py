from typing import List, Optional
from bson import ObjectId
from models.provider import Provider
import db  


def create_provider(provider: Provider) -> Provider:
    """Inserta un provider en MongoDB y retorna el modelo con ID asignado."""
    data = provider.dict(by_alias=True, exclude={"id"})  # Excluye el campo id, no se debe enviar
    result = db.db["providers"].insert_one(data)  # MongoDB genera automáticamente el _id
    provider.id = str(result.inserted_id)  # Asigna el _id generado por MongoDB
    return provider


def get_provider(provider_id: str) -> Optional[Provider]:
    """Busca un provider por ObjectId y retorna el modelo o None."""
    doc = db.db["providers"].find_one({"_id": ObjectId(provider_id)})
    if doc:
        doc["id"] = str(doc["_id"])                  
        del doc["_id"]                               
        return Provider(**doc)                             
    return None


def list_providers() -> List[Provider]:
    """Devuelve lista de todos los providers como modelos Pydantic."""
    providers: List[Provider] = []
    for doc in db.db["providers"].find():
        doc["id"] = str(doc["_id"])                   
        del doc["_id"]                                 
        providers.append(Provider(**doc))                    
    return providers

def delete_provider(provider_id: str):
    """Elimina un provider por ObjectId."""
    try:
        result = db.db["providers"].delete_one({"_id": ObjectId(provider_id)})
        if result.deleted_count == 0:
            return None  # No se encontró el provider para eliminar
        return True  # El provider fue eliminado correctamente
    except Exception as e:
        # Manejo de excepciones para capturar cualquier error durante la eliminación
        print(f"Error eliminando provider: {e}")
        return None

def update_provider(provider_data: dict) -> bool:
    """
    Actualiza un provider existente.
    Retorna True si la actualización fue exitosa, False si no se encontró el provider.
    Lanza excepciones para casos de error.
    """
    provider_dict = provider_data.copy()

    try:
        if "_id" not in provider_dict or not provider_dict["_id"]:
            raise HTTPException(status_code=400, detail="Se requiere _id para actualización")

        provider_id = str(provider_dict["_id"])
        _id = ObjectId(provider_id)
        
        provider_dict.pop("_id", None)
        
        result = db.db["providers"].update_one(
            {"_id": _id},
            {"$set": provider_dict}
        )

        return result.matched_count > 0

    except InvalidId:
        raise HTTPException(status_code=400, detail="ID inválido")
    except Exception as e:
        print(f"Error en update_provider: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")