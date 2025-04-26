from fastapi import FastAPI

from .api import booking_router
from .db import create_tables

app = FastAPI()
app.include_router(booking_router)


@app.on_event("startup")
async def startup_event():
    await create_tables()
