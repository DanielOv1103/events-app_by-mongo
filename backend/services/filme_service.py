from typing import List, Optional
from bson import ObjectId
from models.filme import Filme
import db  


def create_filme(filme: Filme) -> Filme:
    """Inserta un filme en MongoDB y retorna el modelo con ID asignado."""
    data = filme.dict(by_alias=True, exclude={"id"})  # Excluye el campo id, no se debe enviar
    result = db.db["filmes"].insert_one(data)  # MongoDB genera automáticamente el _id
    filme.id = str(result.inserted_id)  # Asigna el _id generado por MongoDB
    return filme


def get_filme(filme_id: str) -> Optional[Filme]:
    """Busca un filme por ObjectId y retorna el modelo o None."""
    doc = db.db["filmes"].find_one({"_id": ObjectId(filme_id)})
    if doc:
        doc["id"] = str(doc["_id"])                  
        del doc["_id"]                               
        return Filme(**doc)                             
    return None


def list_filmes() -> List[Filme]:
    """Devuelve lista de todos los filmes como modelos Pydantic."""
    filmes: List[Filme] = []
    for doc in db.db["filmes"].find():
        doc["id"] = str(doc["_id"])                   
        del doc["_id"]                                 
        filmes.append(Filme(**doc))                    
    return filmes

def delete_filme(filme_id: str):
    """Elimina un filme por ObjectId."""
    try:
        result = db.db["filmes"].delete_one({"_id": ObjectId(filme_id)})
        if result.deleted_count == 0:
            return None  # No se encontró el filme para eliminar
        return True  # El filme fue eliminado correctamente
    except Exception as e:
        # Manejo de excepciones para capturar cualquier error durante la eliminación
        print(f"Error eliminando filme: {e}")
        return None

def update_filme(filme_data: dict) -> bool:
    """
    Actualiza un filme existente.
    Retorna True si la actualización fue exitosa, False si no se encontró el filme.
    Lanza excepciones para casos de error.
    """
    filme_dict = filme_data.copy()

    try:
        if "_id" not in filme_dict or not filme_dict["_id"]:
            raise HTTPException(status_code=400, detail="Se requiere _id para actualización")

        filme_id = str(filme_dict["_id"])
        _id = ObjectId(filme_id)
        
        filme_dict.pop("_id", None)
        
        result = db.db["filmes"].update_one(
            {"_id": _id},
            {"$set": filme_dict}
        )

        return result.matched_count > 0

    except InvalidId:
        raise HTTPException(status_code=400, detail="ID inválido")
    except Exception as e:
        print(f"Error en update_filme: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")   