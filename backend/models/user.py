from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    name: str
    last_name: str
    name_user: str
    email: str
    created_day: datetime
    updated_day: datetime
    role: str
    image: Optional[str] = None
    
    class Config:
        validate_by_name = True
        allow_population_by_field_name = True  # útil para trabajar con `id` desde el frontend