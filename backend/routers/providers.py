from fastapi import APIRouter, HTTPException
from models.provider import Provider 
from services.provider_service import create_provider, get_provider, list_providers, delete_provider, update_provider

router = APIRouter()

@router.get("/{provider_id}", response_model=Provider)
def get_provider_endpoint(provider_id: str):
    provider = get_provider(provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider no encontrado")
    return provider

@router.get("/", response_model=list[Provider])
def list_providers_endpoint():
    return list_providers()

@router.delete("/{provider_id}")
def delete_provider_endpoint(provider_id: str):
    result = delete_provider(provider_id)  # Llama a la función delete_provider del servicio
    if result is None:
        raise HTTPException(status_code=404, detail="Provider no encontrado")
    return {"message": "Provider eliminado correctamente"}

@router.post("/")
def create_provider_endpoint(provider: Provider):
    return create_provider(provider)

@router.patch("/{provider_id}")
async def update_provider_endpoint(provider_id: str, provider_data: Provider):
    provider_dict = provider_data.dict()
    provider_dict["_id"] = provider_id
    success = update_provider(provider_dict)
    if not success:
        raise HTTPException(status_code=404, detail="Provider no encontrado")    
    return {"status": "success"}