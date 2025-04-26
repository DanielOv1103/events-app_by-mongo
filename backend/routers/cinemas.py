from fastapi import APIRouter, HTTPException
from models.cinema import Cinema
from services.cinema_service import create_cinema, get_cinema, list_cinemas, delete_cinema, update_cinema

router = APIRouter()

@router.get("/{cinema_id}", response_model=Cinema)
def get_cinema_endpoint(cinema_id: str):
    cinema = get_cinema(cinema_id)
    if not cinema:
        raise HTTPException(status_code=404, detail="Cinema not found")
    return cinema

@router.get("/", response_model=list[Cinema])
def list_cinemas_endpoint():
    return list_cinemas()

@router.delete("/{cinema_id}")
def delete_cinema_endpoint(cinema_id: str):
    result = delete_cinema(cinema_id)  # Llama a la función delete_cinema del servicio
    if result is None:
        raise HTTPException(status_code=404, detail="Cinema not found")
    return {"message": "Cinema deleted successfully"}

@router.post("/")
def create_cinema_endpoint(cinema: Cinema):
    return create_cinema(cinema)

@router.patch("/{cinema_id}")
async def update_cinema_endpoint(cinema_id: str, cinema_data: Cinema):
    cinema_dict = cinema_data.dict()
    cinema_dict["_id"] = cinema_id
    success = update_cinema(cinema_dict)
    if not success:
        raise HTTPException(status_code=404, detail="Cinema not found")    
    return {"status": "success"}