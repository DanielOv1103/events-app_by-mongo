from typing import List, Optional
from bson import ObjectId
from models.products import Products
import db  


def create_product(product: Products) -> Products:
    """Inserta un producto en MongoDB y retorna el modelo con ID asignado."""
    data = product.dict(by_alias=True, exclude={"id"})  # Excluye el campo id, no se debe enviar
    result = db.db["products"].insert_one(data)  # MongoDB genera automáticamente el _id
    product.id = str(result.inserted_id)  # Asigna el _id generado por MongoDB
    return product


def get_product(product_id: str) -> Optional[Products]:
    """Busca un producto por ObjectId y retorna el modelo o None."""
    doc = db.db["products"].find_one({"_id": ObjectId(product_id)})
    if doc:
        doc["id"] = str(doc["_id"])                  
        del doc["_id"]                               
        return Products(**doc)                             
    return None


def list_products() -> List[Products]:
    """Devuelve lista de todos los productos como modelos Pydantic."""
    products: List[Products] = []
    for doc in db.db["products"].find():
        doc["id"] = str(doc["_id"])                   
        del doc["_id"]                                 
        products.append(Products(**doc))                    
    return products

def delete_product(product_id: str):
    """Elimina un producto por ObjectId."""
    try:
        result = db.db["products"].delete_one({"_id": ObjectId(product_id)})
        if result.deleted_count == 0:
            return None  # No se encontró el producto para eliminar
        return True  # El producto fue eliminado correctamente
    except Exception as e:
        # Manejo de excepciones para capturar cualquier error durante la eliminación
        print(f"Error eliminando producto: {e}")
        return None

def update_product(product_data: dict) -> bool:
    """
    Actualiza un producto existente.
    Retorna True si la actualización fue exitosa, False si no se encontró el producto.
    Lanza excepciones para casos de error.
    """
    product_dict = product_data.copy()

    try:
        if "_id" not in product_dict or not product_dict["_id"]:
            raise HTTPException(status_code=400, detail="Se requiere _id para actualización")

        product_id = str(product_dict["_id"])
        _id = ObjectId(product_id)
        
        product_dict.pop("_id", None)
        
        result = db.db["products"].update_one(
            {"_id": _id},
            {"$set": product_dict}
        )

        return result.matched_count > 0

    except InvalidId:
        raise HTTPException(status_code=400, detail="ID inválido")
    except Exception as e:
        print(f"Error en update_product: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")