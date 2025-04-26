from typing import List, Optional
from bson import ObjectId
from models.city import City
import db  


def create_city(city: City) -> City:
    """Inserta un city en MongoDB y retorna el modelo con ID asignado."""
    data = city.dict(by_alias=True, exclude={"id"})  # Excluye el campo id, no se debe enviar
    result = db.db["cities"].insert_one(data)  # MongoDB genera automáticamente el _id
    city.id = str(result.inserted_id)  # Asigna el _id generado por MongoDB
    return city


def get_city(city_id: str) -> Optional[City]:
    """Busca un city por ObjectId y retorna el modelo o None."""
    doc = db.db["cities"].find_one({"_id": ObjectId(city_id)})
    if doc:
        doc["id"] = str(doc["_id"])                  
        del doc["_id"]                               
        return City(**doc)                             
    return None


def list_cities() -> List[City]:
    """Devuelve lista de todos los cities como modelos Pydantic."""
    cities: List[City] = []
    for doc in db.db["cities"].find():
        doc["id"] = str(doc["_id"])                   
        del doc["_id"]                                 
        cities.append(City(**doc))                    
    return cities

def delete_city(city_id: str):
    """Elimina un city por ObjectId."""
    try:
        result = db.db["cities"].delete_one({"_id": ObjectId(city_id)})
        if result.deleted_count == 0:
            return None  # No se encontró el city para eliminar
        return True  # El city fue eliminado correctamente
    except Exception as e:
        # Manejo de excepciones para capturar cualquier error durante la eliminación
        print(f"Error eliminando city: {e}")
        return None

def update_city(city_data: dict) -> bool:
    """
    Actualiza un city existente.
    Retorna True si la actualización fue exitosa, False si no se encontró el city.
    Lanza excepciones para casos de error.
    """
    city_dict = city_data.copy()

    try:
        if "_id" not in city_dict or not city_dict["_id"]:
            raise HTTPException(status_code=400, detail="Se requiere _id para actualización")

        city_id = str(city_dict["_id"])
        _id = ObjectId(city_id)
        
        city_dict.pop("_id", None)
        
        result = db.db["cities"].update_one(
            {"_id": _id},
            {"$set": city_dict}
        )

        return result.matched_count > 0

    except InvalidId:
        raise HTTPException(status_code=400, detail="ID inválido")
    except Exception as e:
        print(f"Error en update_city: {e}") 
        raise HTTPException(status_code=500, detail="Error interno del servidor")