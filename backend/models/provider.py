from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Provider(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    name: str
    description: str
    email: str
    ruc: str
    address: str
    phone: str
    created_day: datetime
    updated_day: datetime
    
    class Config:
        validate_by_name = True
        allow_population_by_field_name = True  # útil para trabajar con `id` desde el frontend