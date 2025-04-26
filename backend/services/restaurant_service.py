from typing import List
from bson import ObjectId
from models.restaurants import Restaurant
import db

def create_restaurant(restaurant: Restaurant):
    """Inserta un restaurante en MongoDB y retorna el modelo con ID asignado."""
    data = restaurant.dict(by_alias=True, exclude={"id"})  # Excluye el campo id, no se debe enviar
    result = db.db["restaurants"].insert_one(data)  # MongoDB genera automáticamente el _id
    restaurant.id = str(result.inserted_id)  # Asigna el _id generado por MongoDB
    return restaurant


def get_restaurant(restaurant_id: str) -> Restaurant:
    """Busca un restaurante por ObjectId y retorna el modelo."""
    doc = db.db["restaurants"].find_one({"_id": ObjectId(restaurant_id)})
    if doc:
        doc["id"] = str(doc["_id"])                  
        del doc["_id"]                               
        return Restaurant(**doc)                             
    return None


def list_restaurants() -> List[Restaurant]:
    """Devuelve lista de todos los restaurantes como modelos Pydantic."""
    restaurants: List[Restaurant] = []
    for doc in db.db["restaurants"].find():
        doc["id"] = str(doc["_id"])                   
        del doc["_id"]                                 
        restaurants.append(Restaurant(**doc))                    
    return restaurants

def delete_restaurant(restaurant_id: str):
    """Elimina un restaurante por ObjectId."""
    try:
        result = db.db["restaurants"].delete_one({"_id": ObjectId(restaurant_id)})
        if result.deleted_count == 0:
            return None  # No se encontró el restaurante para eliminar
        return True  # El restaurante fue eliminado correctamente
    except Exception as e:
        # Manejo de excepciones para capturar cualquier error durante la eliminación
        print(f"Error eliminando restaurante: {e}")
        return None

def update_restaurant(restaurant_data: dict) -> bool:
    """Actualiza un restaurante en MongoDB."""
    try:
        result = db.db["restaurants"].update_one({"_id": ObjectId(restaurant_data["id"])}, {"$set": restaurant_data})
        if result.modified_count == 0:
            return False  # No se encontró el restaurante para actualizar
        return True  # El restaurante fue actualizado correctamente
    except Exception as e:
        # Manejo de excepciones para capturar cualquier error durante la actualización
        print(f"Error actualizando restaurante: {e}")        
        return False 