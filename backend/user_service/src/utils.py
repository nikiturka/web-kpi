import uuid
import bcrypt
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from .models import User, Role


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

    for user_data in default_users:
        hashed_password = bcrypt.hashpw(user_data["password"].encode(), bcrypt.gensalt())

        user = User(
            id=uuid.uuid4(),
            name=user_data["name"],
            email=user_data["email"],
            password=hashed_password,
            role=user_data["role"]
        )
        session.add(user)

    await session.commit()
    print("Default users created: admin@example.com and user@example.com")
