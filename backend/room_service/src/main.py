import asyncio

from fastapi import FastAPI

from .api import rooms_router
from .consumers import start_consuming
from .db import create_tables

app = FastAPI()
app.include_router(rooms_router)


@app.on_event("startup")
async def startup_event():
    await create_tables()
    asyncio.create_task(start_consuming())
