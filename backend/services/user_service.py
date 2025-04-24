from typing import List, Optional
from bson import ObjectId
from models.user import User
import db  


def create_user(user: User) -> User:
    """Inserta un usuario en MongoDB y retorna el modelo con ID asignado."""
    data = user.dict(by_alias=True, exclude={"id"})  # Excluye el campo id, no se debe enviar
    result = db.db["users"].insert_one(data)  # MongoDB genera automáticamente el _id
    user.id = str(result.inserted_id)  # Asigna el _id generado por MongoDB
    return user


def get_user(user_id: str) -> Optional[User]:
    """Busca un usuario por ObjectId y retorna el modelo o None."""
    doc = db.db["users"].find_one({"_id": ObjectId(user_id)})
    if doc:
        doc["id"] = str(doc["_id"])                  
        del doc["_id"]                               
        return User(**doc)                             
    return None


def list_users() -> List[User]:
    """Devuelve lista de todos los usuarios como modelos Pydantic."""
    users: List[User] = []
    for doc in db.db["users"].find():
        doc["id"] = str(doc["_id"])                   
        del doc["_id"]                                 
        users.append(User(**doc))                    
    return users

def delete_user(user_id: str):
    """Elimina un usuario por ObjectId."""
    try:
        result = db.db["users"].delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            return None  # No se encontró el usuario para eliminar
        return True  # El usuario fue eliminado correctamente
    except Exception as e:
        # Manejo de excepciones para capturar cualquier error durante la eliminación
        print(f"Error eliminando usuario: {e}")
        return None

def update_user(user_data: dict) -> bool:
    """
    Actualiza un usuario existente.
    Retorna True si la actualización fue exitosa, False si no se encontró el usuario.
    Lanza excepciones para casos de error.
    """
    user_dict = user_data.copy()

    try:
        if "_id" not in user_dict or not user_dict["_id"]:
            raise HTTPException(status_code=400, detail="Se requiere _id para actualización")

        user_id = str(user_dict["_id"])
        _id = ObjectId(user_id)
        
        user_dict.pop("_id", None)
        
        result = db.db["users"].update_one(
            {"_id": _id},
            {"$set": user_dict}
        )

        return result.matched_count > 0

    except InvalidId:
        raise HTTPException(status_code=400, detail="ID inválido")
    except Exception as e:
        print(f"Error en update_user: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")