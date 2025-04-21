import asyncio

from fastapi import FastAPI

from .api import users_router
from .db import create_tables, drop_tables
from .consumers import start_consuming

app = FastAPI()
app.include_router(users_router)


@app.on_event("startup")
async def startup_event():
    await drop_tables()
    await create_tables()
    asyncio.create_task(start_consuming())