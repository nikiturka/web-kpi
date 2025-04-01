from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from .models import User, Role
import uuid
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


default_users = [
    {
        "name": "admin",
        "email": "admin@example.com",
        "password": "admin",
        "role": Role.admin
    },
    {
        "name": "user",
        "email": "user@example.com",
        "password": "user",
        "role": Role.user
    }
]


async def create_default_users(session: AsyncSession):
    await session.execute(delete(User))
    await session.commit()
    print("All users deleted.")

    # Теперь создаем новых пользователей из списка
    for user_data in default_users:
        # Хешируем пароли
        user_data['password'] = pwd_context.hash(user_data['password'])
        user = User(
            id=uuid.uuid4(),
            name=user_data['name'],
            email=user_data['email'],
            password=user_data['password'],
            role=user_data['role']
        )
        session.add(user)

    await session.commit()
    print("Default users created: admin@example.com and user@example.com")