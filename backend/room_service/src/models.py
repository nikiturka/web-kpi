import uuid
import datetime

from sqlalchemy import String, Integer, Text, TIMESTAMP, UUID, text, Enum, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.orm import DeclarativeBase
from enum import Enum as PyEnum


class Base(DeclarativeBase):
    pass


class RoomType(PyEnum):
    MEETING = "meeting"
    WORKSPACE = "workspace"
    CONFERENCE_HALL = "conference_hall"
    LOUNGE = "lounge"
    TRAINING_ROOM = "training_room"


class AvailableSlot(Base):
    __tablename__ = 'available_slots'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("rooms.id"), nullable=False)
    start_time: Mapped[datetime.datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
    end_time: Mapped[datetime.datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class Room(Base):
    __tablename__ = 'rooms'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    type: Mapped[RoomType] = mapped_column(Enum(RoomType, native_enum=False), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("TIMEZONE('utc', now())"), nullable=False
    )
