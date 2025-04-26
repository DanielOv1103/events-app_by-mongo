from fastapi import APIRouter, HTTPException
from models.products import Products 
from services.product_service import create_product, get_product, list_products, delete_product, update_product

router = APIRouter()

@router.get("/{product_id}", response_model=Products)
def get_product_endpoint(product_id: str):
    product = get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product

@router.get("/", response_model=list[Products])
def list_products_endpoint():
    return list_products()

@router.delete("/{product_id}")
def delete_product_endpoint(product_id: str):
    result = delete_product(product_id)  # Llama a la función delete_product del servicio
    if result is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"message": "Producto eliminado correctamente"}

@router.post("/")
def create_product_endpoint(product: Products):
    return create_product(product)

@router.patch("/{product_id}")
async def update_product_endpoint(product_id: str, product_data: Products):
    product_dict = product_data.dict()
    product_dict["_id"] = product_id
    success = update_product(product_dict)
    if not success:
        raise HTTPException(status_code=404, detail="Producto no encontrado")    
    return {"status": "success"}