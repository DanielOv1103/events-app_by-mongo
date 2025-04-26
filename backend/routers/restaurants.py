from fastapi import APIRouter, HTTPException
from models.restaurants import Restaurant
from services.restaurant_service import create_restaurant, get_restaurant, list_restaurants, delete_restaurant, update_restaurant

router = APIRouter()

@router.get("/{restaurant_id}", response_model=Restaurant)
def get_restaurant_endpoint(restaurant_id: str):
    restaurant = get_restaurant(restaurant_id)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurante no encontrado")
    return restaurant

@router.get("/", response_model=list[Restaurant])
def list_restaurants_endpoint():
    return list_restaurants()

@router.delete("/{restaurant_id}")
def delete_restaurant_endpoint(restaurant_id: str):
    result = delete_restaurant(restaurant_id)  # Llama a la función delete_restaurant del servicio
    if result is None:
        raise HTTPException(status_code=404, detail="Restaurante no encontrado")
    return {"message": "Restaurante eliminado correctamente"}

@router.post("/")
def create_restaurant_endpoint(restaurant: Restaurant):
    return create_restaurant(restaurant)

@router.patch("/{restaurant_id}")
async def update_restaurant_endpoint(restaurant_id: str, restaurant_data: Restaurant):
    restaurant_dict = restaurant_data.dict()
    restaurant_dict["_id"] = restaurant_id
    success = update_restaurant(restaurant_dict)
    if not success:
        raise HTTPException(status_code=404, detail="Restaurante no encontrado")    
    return {"status": "success"}