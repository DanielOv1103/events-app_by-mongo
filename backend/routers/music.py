from fastapi import APIRouter, HTTPException
from models.music import Music 
from services.music_service import create_music, get_music, list_music, delete_music, update_music

router = APIRouter()

@router.get("/{music_id}", response_model=Music)
def get_music_endpoint(music_id: str):
    music = get_music(music_id)
    if not music:
        raise HTTPException(status_code=404, detail="Music no encontrado")
    return music

@router.get("/", response_model=list[Music])
def list_music_endpoint():
    return list_music()

@router.delete("/{music_id}")
def delete_music_endpoint(music_id: str):
    result = delete_music(music_id)  # Llama a la función delete_music del servicio
    if result is None:
        raise HTTPException(status_code=404, detail="Music no encontrado")
    return {"message": "Music eliminado correctamente"}

@router.post("/")
def create_music_endpoint(music: Music):
    return create_music(music)

@router.patch("/{music_id}")
async def update_music_endpoint(music_id: str, music_data: Music):
    music_dict = music_data.dict()
    music_dict["_id"] = music_id
    success = update_music(music_dict)
    if not success:
        raise HTTPException(status_code=404, detail="Music no encontrado")    
    return {"status": "success"}