from pydantic import BaseModel
from typing import Optional

class Restaurant(BaseModel):
    id: Optional[str]
    name: str
    description: str
    image: Optional[str] = None
    address: str
    phone: str
    email: str
    website: str
    facebook: str
    twitter: str
    instagram: str
    created_day: str
    updated_day: str
    
    class Config:
        validate_by_name = True
        allow_population_by_field_name = True  # útil para trabajar con `id` desde el frontend