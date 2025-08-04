from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from extraer_evento import extraer_datos

app = FastAPI()

# Configuración CORS para permitir cualquier origen (puedes restringir en producción)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar a dominios específicos si es necesario
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextoEntrada(BaseModel):
    texto: str

@app.post("/extraer")
async def recibir_texto(entrada: TextoEntrada):
    resultado = extraer_datos(entrada.texto)
    return resultado
