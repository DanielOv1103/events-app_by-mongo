from fastapi import FastAPI
from db import connect_to_mongo, close_mongo_connection
from routers.auth import router as auth_router
from routers.events import router as events_router
from routers.users import router as user_router
from routers.receta import router as receta_router
from routers.products import router as product_router
from routers.music import router as music_router
from routers.filmes import router as filme_router
from routers.providers import router as provider_router
from routers.citys import router as city_router
from routers.restaurants import router as restaurant_router
from routers.airports import router as airport_router
from routers.cinemas import router as cinema_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="My Event App",
    version="0.1.0",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Añade el middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # quién puede llamar
    allow_credentials=True,         # si se permiten cookies/credenciales
    allow_methods=["*"],            # qué métodos HTTP se permiten
    allow_headers=["*"],            # qué cabeceras se permiten
)

def startup_db_client():
    connect_to_mongo()
app.add_event_handler("startup", startup_db_client)

def shutdown_db_client():
    close_mongo_connection()
app.add_event_handler("shutdown", shutdown_db_client)


app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(events_router, prefix="/events", tags=["events"])
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(receta_router, prefix="/recetas", tags=["recetas"])
app.include_router(filme_router, prefix="/filmes", tags=["filmes"])
app.include_router(music_router, prefix="/music", tags=["music"])
app.include_router(product_router, prefix="/productos", tags=["productos"])
app.include_router(provider_router, prefix="/providers", tags=["providers"])
app.include_router(city_router, prefix="/ciudades", tags=["ciudades"])
app.include_router(restaurant_router, prefix="/restaurantes", tags=["restaurantes"])
app.include_router(airport_router, prefix="/aeropuertos", tags=["aeropuertos"])
app.include_router(cinema_router, prefix="/cines", tags=["cines"])