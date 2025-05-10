import uuid
from datetime import datetime

from pydantic import BaseModel, validator


class BookingCreate(BaseModel):
    room_id: uuid.UUID
    start_time: datetime
    end_time: datetime


class DetailAvailableSlot(BaseModel):
    id: uuid.UUID
    room_id: uuid.UUID
    start_time: str
    end_time: str
    is_available: bool

    class Config:
        orm_mode = True

    @validator('start_time', 'end_time', pre=True)
    def format_datetime(cls, value):
        if isinstance(value, datetime):
            return value.strftime('%b %d %H:%M')  # Example: 'Feb 17 9:00'
        return value
