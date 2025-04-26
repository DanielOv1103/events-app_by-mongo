from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Products(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    name: str
    description: str
    price: float
    category: str
    quantity: int
    date_ingested: datetime
    date_expired: datetime
    image: Optional[str] = None
    
    class Config:
        validate_by_name = True
        allow_population_by_field_name = True  # útil para trabajar con `id` desde el frontend 