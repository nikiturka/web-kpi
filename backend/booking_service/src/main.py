from fastapi import FastAPI

from .api import booking_router
from .db import create_tables, drop_tables

app = FastAPI()
app.include_router(booking_router)


@app.on_event("startup")
async def startup_event():
    await drop_tables()
    await create_tables()
