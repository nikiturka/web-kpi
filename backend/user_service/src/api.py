from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, insert
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext

from .db import get_async_session
from .models import User
from .schemas import UserCreate, UserLogin
from .utils import create_default_users

users_router = APIRouter(
    prefix="/users",
    tags=["Users"],
)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@users_router.get("/")
async def get_users(session: AsyncSession = Depends(get_async_session)):
    query = select(User)
    res = await session.execute(query)
    users = res.scalars().all()

    return users


@users_router.post("/test-data")
async def create_test_users(session: AsyncSession = Depends(get_async_session)):
    try:
        await create_default_users(session)
        return {'response': 200}
    except Exception as e:
        return {'error': str(e)}

@users_router.post("/register")
async def register_user(
        user_data: UserCreate,
        session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed_password = pwd_context.hash(user_data.password)

    stmt = insert(User).values(name=user_data.name, email=user_data.email, password=hashed_password)
    await session.execute(stmt)
    await session.commit()

    return {"response": 200}


@users_router.post("/login")
async def login_user(
        user_data: UserLogin,
        session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(select(User).where(User.email == user_data.email))
    user = result.scalars().first()

    if not user or not pwd_context.verify(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"response": "Login successful"}
