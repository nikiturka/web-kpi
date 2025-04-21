from fastapi import FastAPI

# from .api import rooms_router
# from .db import create_tables, drop_tables

app = FastAPI()
# app.include_router(rooms_router)


# @app.on_event("startup")
# async def startup_event():
#     await drop_tables()
#     await create_tables()
