from fastapi import FastAPI

from .api import users_router
from .db import create_tables


app = FastAPI()
app.include_router(users_router)


@app.on_event("startup")
async def startup_event():
    await create_tables()
