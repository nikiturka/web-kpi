import asyncio

from fastapi import FastAPI

from .api import rooms_router
from .consumers import start_consuming
from .db import create_tables, session_factory
from .utils import create_test_rooms_and_slots

app = FastAPI()
app.include_router(rooms_router)


@app.on_event("startup")
async def startup_event():
    await create_tables()
    print("✅ Tables created.")

    async with session_factory() as session:
        await create_test_rooms_and_slots(session)
    print("✅ Test rooms and slots created.")

    asyncio.create_task(start_consuming())
    print("✅ Consumer started.")
