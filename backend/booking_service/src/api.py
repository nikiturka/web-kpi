import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select, insert, delete
from sqlalchemy.ext.asyncio import AsyncSession

from .db import get_async_session
from .models import Booking, BookingStatus
from .producers import rpc_request, Settings
from .schemas import BookingCreate
from .utils import floor_to_hour, ceil_to_hour

booking_router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
)
http_bearer = HTTPBearer()


@booking_router.get("/{user_id}/")
async def get_bookings_for_user(
    session: AsyncSession = Depends(get_async_session),
    user_id = int
):
    query = select(Booking).where(Booking.user_id == user_id)
    res = await session.execute(query)
    bookings = res.scalars().all()

    return bookings


@booking_router.post("/")
async def create_booking_for_user(
    booking_data: BookingCreate,
    session: AsyncSession = Depends(get_async_session),
    credentials: HTTPAuthorizationCredentials = Depends(http_bearer),
):
    token = credentials.credentials

    booking_data.start_time = floor_to_hour(booking_data.start_time)
    booking_data.end_time = ceil_to_hour(booking_data.end_time)

    user_exists = await rpc_request(
        queue_name=Settings.user_exists_queue,
        exchanger=Settings.exchanger,
        routing_key=Settings.routing_key_to_user_exists_queue,
        data={"token": token}
    )
    if user_exists["status"] == "error":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=user_exists.get("detail", user_exists.get("detail"))
        )

    room_exists = await rpc_request(
        queue_name=Settings.room_exists_queue,
        exchanger=Settings.exchanger,
        routing_key=Settings.routing_key_to_room_exists_queue,
        data={
            "room_id": str(booking_data.room_id),
            "start_time": booking_data.start_time.isoformat(),
            "end_time": booking_data.end_time.isoformat()
        }
    )
    if room_exists["status"] == "error":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=room_exists.get("detail", user_exists.get("detail"))
        )

    stmt = insert(Booking).values(**booking_data.dict(), user_id=uuid.UUID(user_exists["user_id"]), status=BookingStatus.CONFIRMED)
    await session.execute(stmt)
    await session.commit()

    return {"status": 200}


@booking_router.delete("/{booking_id}")
async def delete_booking(booking_id: int, session: AsyncSession = Depends(get_async_session)):
    query = select(Booking).where(Booking.id == booking_id)
    existing_booking = await session.execute(query)
    booking = existing_booking.scalar()

    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")

    delete_stmt = delete(Booking).where(Booking.id == booking_id)
    await session.execute(delete_stmt)
    await session.commit()

    return {"message": "Booking deleted successfully"}
