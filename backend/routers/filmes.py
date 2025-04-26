from fastapi import APIRouter, HTTPException
from models.filme import Filme 
from services.filme_service import create_filme, get_filme, list_filmes, delete_filme, update_filme

router = APIRouter()

@router.get("/{filme_id}", response_model=Filme)
def get_filme_endpoint(filme_id: str):
    filme = get_filme(filme_id)
    if not filme:
        raise HTTPException(status_code=404, detail="Filme no encontrado")
    return filme

@router.get("/", response_model=list[Filme])
def list_filmes_endpoint():
    return list_filmes()

@router.delete("/{filme_id}")
def delete_filme_endpoint(filme_id: str):
    result = delete_filme(filme_id)  # Llama a la función delete_filme del servicio
    if result is None:
        raise HTTPException(status_code=404, detail="Filme no encontrado")
    return {"message": "Filme eliminado correctamente"}

@router.post("/")
def create_filme_endpoint(filme: Filme):
    return create_filme(filme)

@router.patch("/{filme_id}")
async def update_filme_endpoint(filme_id: str, filme_data: Filme):
    filme_dict = filme_data.dict()
    filme_dict["_id"] = filme_id
    success = update_filme(filme_dict)
    if not success:
        raise HTTPException(status_code=404, detail="Filme no encontrado")    
    return {"status": "success"}