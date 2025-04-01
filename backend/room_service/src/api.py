from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, insert
from sqlalchemy.ext.asyncio import AsyncSession

from .db import get_async_session
from .models import Room, AvailableSlot, RoomType
from .schemas import RoomCreate, DetailAvailableSlot, CreateAvailableSlot
from .utils import create_test_rooms_and_slots

rooms_router = APIRouter(
    prefix="/rooms",
    tags=["Rooms"],
)


@rooms_router.post("/test-data")
async def create_test_data(session: AsyncSession = Depends(get_async_session)):
    try:
        await create_test_rooms_and_slots(session)
        return {'response': 200}
    except Exception as e:
        return {'error': str(e)}


@rooms_router.get("/")
async def get_rooms(session: AsyncSession = Depends(get_async_session)):
    query = select(Room)
    res = await session.execute(query)
    rooms = res.scalars().all()

    return rooms


@rooms_router.post("/")
async def create_room(
        room_data: RoomCreate,
        session: AsyncSession = Depends(get_async_session)
):
    try:
        room_dict = room_data.model_dump()
        room_dict["type"] = RoomType(room_dict["type"])

        stmt = insert(Room).values(**room_dict)
        await session.execute(stmt)
        await session.commit()

        return {"response": 200}

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid room type")


@rooms_router.get("/{room_id}/slots", response_model=list[DetailAvailableSlot])
async def get_room_slots(
        room_id: UUID,
        session: AsyncSession = Depends(get_async_session),
):
    query = select(AvailableSlot).where(AvailableSlot.room_id == room_id)
    res = await session.execute(query)
    rooms = res.scalars().all()

    return rooms


@rooms_router.post("/{room_id}/slots")
async def create_room_slots(
        slot_data: CreateAvailableSlot,
        session: AsyncSession = Depends(get_async_session),
):
    query = select(Room).filter(Room.id == slot_data.room_id)
    result = await session.execute(query)
    room = result.scalar_one_or_none()

    if room is None:
        return {"error": "Room not found"}

    stmt = insert(AvailableSlot).values(**slot_data.dict())
    await session.execute(stmt)
    await session.commit()

    return {"response": 200}
