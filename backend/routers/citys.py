from fastapi import APIRouter, HTTPException
from models.city import City 
from services.city_services import create_city, get_city, list_cities, delete_city, update_city

router = APIRouter()

@router.get("/{city_id}", response_model=City)
def get_city_endpoint(city_id: str):
    city = get_city(city_id)
    if not city:
        raise HTTPException(status_code=404, detail="City no encontrado")
    return city

@router.get("/", response_model=list[City])
def list_cities_endpoint():
    return list_cities()

@router.delete("/{city_id}")
def delete_city_endpoint(city_id: str):
    result = delete_city(city_id)  # Llama a la función delete_city del servicio
    if result is None:
        raise HTTPException(status_code=404, detail="City no encontrado")
    return {"message": "City eliminado correctamente"}

@router.post("/")
def create_city_endpoint(city: City):
    return create_city(city)

@router.patch("/{city_id}")
async def update_city_endpoint(city_id: str, city_data: City):
    city_dict = city_data.dict()
    city_dict["_id"] = city_id
    success = update_city(city_dict)
    if not success:
        raise HTTPException(status_code=404, detail="City no encontrado")    
    return {"status": "success"}