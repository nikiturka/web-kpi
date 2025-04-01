import uuid

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserDetail(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    role: str