from pydantic import BaseModel
from typing import Optional

class Airport(BaseModel):
    id: Optional[str]
    name: str
    code: str
    city: str
    country: str
    description: str
    image: Optional[str] = None
    ability: str
    created_day: str
    updated_day: str
    
    class Config:
        validate_by_name = True
        allow_population_by_field_name = True  # útil para trabajar con `id` desde el frontend