from fastapi import APIRouter, HTTPException
from models.user import User
from services.user_service import create_user, get_user, list_users, delete_user, update_user

router = APIRouter()

@router.get("/{user_id}", response_model=User)
def get_user_endpoint(user_id: str):
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/", response_model=list[User])
def list_users_endpoint():
    return list_users()

@router.delete("/{user_id}")
def delete_user_endpoint(user_id: str):
    result = delete_user(user_id)  # Llama a la función delete_user del servicio
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@router.post("/")
def create_user_endpoint(user: User):
    print(user.dict())  
    return create_user(user)

@router.put("/{user_id}")
async def update_user_endpoint(user_id: str, user_data: User):
    user_dict = user_data.dict()
    user_dict["_id"] = user_id
    success = update_user(user_dict)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")    
    return {"status": "success"}