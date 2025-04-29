import asyncio

from fastapi import FastAPI

from .api import users_router
from .db import create_tables, session_factory
from .consumers import start_consuming
from .utils import create_default_users


app = FastAPI()
app.include_router(users_router)


@app.on_event("startup")
async def startup_event():
    await create_tables()
    print("✅ Tables created.")

    async with session_factory() as session:
        await create_default_users(session)
    print("✅ Default users created.")

    asyncio.create_task(start_consuming())
    print("✅ Consumer started.")
