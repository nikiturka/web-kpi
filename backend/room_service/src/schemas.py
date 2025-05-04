import uuid
from datetime import datetime

from pydantic import BaseModel


class RoomCreate(BaseModel):
    name: str
    location: str
    capacity: int
    type: str
    description: str | None = None


class CreateAvailableSlot(BaseModel):
    room_id: uuid.UUID
    start_time: datetime
    end_time: datetime


class DetailAvailableSlot(BaseModel):
    id: uuid.UUID
    room_id: uuid.UUID
    start_time: datetime
    end_time: datetime
    is_available: bool

    class Config:
        orm_mode = True
