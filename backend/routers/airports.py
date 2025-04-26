from fastapi import APIRouter, HTTPException
from models.airport import Airport
from services.airport_service import create_airport, get_airport, list_airports, delete_airport, update_airport

router = APIRouter()

@router.get("/{airport_id}", response_model=Airport)
def get_airport_endpoint(airport_id: str):
    airport = get_airport(airport_id)
    if not airport:
        raise HTTPException(status_code=404, detail="Airport not found")
    return airport

@router.get("/", response_model=list[Airport])
def list_airports_endpoint():
    return list_airports()

@router.delete("/{airport_id}")
def delete_airport_endpoint(airport_id: str):
    result = delete_airport(airport_id)  # Llama a la función delete_airport del servicio
    if result is None:
        raise HTTPException(status_code=404, detail="Airport not found")
    return {"message": "Airport deleted successfully"}

@router.post("/")
def create_airport_endpoint(airport: Airport):
    return create_airport(airport)

@router.patch("/{airport_id}")
async def update_airport_endpoint(airport_id: str, airport_data: Airport):
    airport_dict = airport_data.dict()
    airport_dict["_id"] = airport_id
    success = update_airport(airport_dict)
    if not success:
        raise HTTPException(status_code=404, detail="Airport not found")    
    return {"status": "success"}