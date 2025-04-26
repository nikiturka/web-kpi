import datetime
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from .models import Room, AvailableSlot, RoomType


rooms = [
    Room(
        id=uuid.uuid4(),
        name="Meeting Room 1",
        location="Building A",
        capacity=10,
        type=RoomType.MEETING,
        description="A room for meetings",
    ),
    Room(
        id=uuid.uuid4(),
        name="Workspace 1",
        location="Building B",
        capacity=6,
        type=RoomType.WORKSPACE,
        description="A collaborative workspace",
    ),
    Room(
        id=uuid.uuid4(),
        name="Conference Hall 1",
        location="Building C",
        capacity=100,
        type=RoomType.CONFERENCE_HALL,
        description="A large hall for conferences",
    ),
    Room(
        id=uuid.uuid4(),
        name="Lounge 1",
        location="Building D",
        capacity=20,
        type=RoomType.LOUNGE,
        description="A relaxing lounge area",
    ),
    Room(
        id=uuid.uuid4(),
        name="Training Room 1",
        location="Building E",
        capacity=15,
        type=RoomType.TRAINING_ROOM,
        description="A room for training sessions",
    ),
]


async def create_test_rooms_and_slots(session: AsyncSession):
    await session.execute(delete(AvailableSlot))
    await session.execute(delete(Room))
    await session.commit()

    session.add_all(rooms)
    await session.commit()

    room_ids = [room.id for room in rooms]

    slots = []
    start_of_day = datetime.datetime.combine(datetime.date.today(), datetime.time(9, 0))

    for room_id in room_ids:
        for i in range(9, 17):
            start_time = start_of_day + datetime.timedelta(hours=i - 9)
            end_time = start_time + datetime.timedelta(hours=1)

            slots.append(
                AvailableSlot(
                    id=uuid.uuid4(),
                    room_id=room_id,
                    start_time=start_time,
                    end_time=end_time,
                    is_available=True
                )
            )

    session.add_all(slots)
    await session.commit()
