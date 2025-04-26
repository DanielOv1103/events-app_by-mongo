from fastapi import APIRouter, HTTPException
from models.receta import Receta 
from services.receta_service import create_receta, get_receta, list_recetas, delete_receta, update_receta

router = APIRouter()

@router.get("/{receta_id}", response_model=Receta)
def get_receta_endpoint(receta_id: str):
    receta = get_receta(receta_id)
    if not receta:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return receta

@router.get("/", response_model=list[Receta])
def list_recetas_endpoint():
    return list_recetas()

@router.delete("/{receta_id}")
def delete_receta_endpoint(receta_id: str):
    result = delete_receta(receta_id)  # Llama a la función delete_receta del servicio
    if result is None:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return {"message": "Receta eliminada correctamente"}

@router.post("/")
def create_receta_endpoint(receta: Receta):
    return create_receta(receta)

@router.patch("/{receta_id}")
async def update_receta_endpoint(receta_id: str, receta_data: Receta):
    receta_dict = receta_data.dict()
    receta_dict["_id"] = receta_id
    success = update_receta(receta_dict)
    if not success:
        raise HTTPException(status_code=404, detail="Receta no encontrada")    
    return {"status": "success"}