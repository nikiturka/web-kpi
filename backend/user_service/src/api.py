from fastapi import APIRouter, Depends, HTTPException, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select, insert
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from starlette import status

from .db import get_async_session
from .models import User, Role
from .schemas import UserCreate, UserLogin, UserDetail
from .utils import create_default_users
from .auth import utils as auth_utils


users_router = APIRouter(
    prefix="/users",
    tags=["Users"],
)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
http_bearer = HTTPBearer()


async def admin_permission(
        credentials: HTTPAuthorizationCredentials = Depends(http_bearer),
        session: AsyncSession = Depends(get_async_session),
):
    token = credentials.credentials
    payload = auth_utils.decode_jwt(token=token)

    result = await session.execute(select(User).where(User.email == payload['email']))
    existing_user = result.scalars().first()
    if not existing_user or existing_user and existing_user.role != Role.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action."
        )


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

    hashed_password = auth_utils.hash_password(user_data.password)

    stmt = insert(User).values(name=user_data.name, email=user_data.email, password=hashed_password, role=Role.user)
    await session.execute(stmt)
    await session.commit()

    return {"response": 200}


@users_router.post("/login")
async def login_user(
        user_data: UserLogin,
        session: AsyncSession = Depends(get_async_session),
):
    unauthorized_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
    )

    result = await session.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalars().first()

    if not existing_user:
        raise unauthorized_exc

    if not auth_utils.validate_password(user_data.password, existing_user.password):
        raise unauthorized_exc

    payload = {
        "email": existing_user.email,
        "role": existing_user.role.value
    }

    token = auth_utils.encode_jwt(payload=payload)
    return {"token": token, "payload": payload}
