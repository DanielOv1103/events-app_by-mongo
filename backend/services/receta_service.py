from typing import List, Optional
from bson import ObjectId
from models.receta import Receta
import db  


def create_receta(receta: Receta) -> Receta:
    """Inserta una receta en MongoDB y retorna el modelo con ID asignado."""
    data = receta.dict(by_alias=True, exclude={"id"})  # Excluye el campo id, no se debe enviar
    result = db.db["recetas"].insert_one(data)  # MongoDB genera automáticamente el _id
    receta.id = str(result.inserted_id)  # Asigna el _id generado por MongoDB
    return receta


def get_receta(receta_id: str) -> Optional[Receta]:
    """Busca una receta por ObjectId y retorna el modelo o None."""
    doc = db.db["recetas"].find_one({"_id": ObjectId(receta_id)})
    if doc:
        doc["id"] = str(doc["_id"])                  
        del doc["_id"]                               
        return Receta(**doc)                             
    return None


def list_recetas() -> List[Receta]:
    """Devuelve lista de todas las recetas como modelos Pydantic."""
    recetas: List[Receta] = []
    for doc in db.db["recetas"].find():
        doc["id"] = str(doc["_id"])                   
        del doc["_id"]                                 
        recetas.append(Receta(**doc))                    
    return recetas

def delete_receta(receta_id: str):
    """Elimina una receta por ObjectId."""
    try:
        result = db.db["recetas"].delete_one({"_id": ObjectId(receta_id)})
        if result.deleted_count == 0:
            return None  # No se encontró la receta para eliminar
        return True  # La receta fue eliminada correctamente
    except Exception as e:
        # Manejo de excepciones para capturar cualquier error durante la eliminación
        print(f"Error eliminando receta: {e}")
        return None

def update_receta(receta_data: dict) -> bool:
    """
    Actualiza una receta existente.
    Retorna True si la actualización fue exitosa, False si no se encontró la receta.
    Lanza excepciones para casos de error.
    """
    receta_dict = receta_data.copy()

    try:
        if "_id" not in receta_dict or not receta_dict["_id"]:
            raise HTTPException(status_code=400, detail="Se requiere _id para actualización")

        receta_id = str(receta_dict["_id"])
        _id = ObjectId(receta_id)
        
        receta_dict.pop("_id", None)
        
        result = db.db["recetas"].update_one(
            {"_id": _id},
            {"$set": receta_dict}
        )

        return result.matched_count > 0

    except InvalidId:
        raise HTTPException(status_code=400, detail="ID inválido")
    except Exception as e:
        print(f"Error en update_receta: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")