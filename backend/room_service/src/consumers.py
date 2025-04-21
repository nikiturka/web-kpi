import json
import uuid

import aio_pika
import asyncio
import logging

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .db import get_async_session, session_factory
from .models import Room

logger = logging.getLogger(__name__)


async def room_exists(
        message: aio_pika.IncomingMessage,
):
    async with message.process():
        body = json.loads(message.body)
        room_id = uuid.UUID(body.get("room_id"))
        print(room_id)
        logger.info(room_id)
        async with session_factory() as session:
            stmt = select(Room).where(Room.id == room_id)
            result = await session.execute(stmt)
            room = result.scalar_one_or_none()

        if not room:
            room_info = {
                "status": "error",
                "detail": "Room not found"
            }
        else:
            room_info = {
                "status": "ok"
            }

        response_message = aio_pika.Message(
            body=json.dumps(room_info).encode(),
            correlation_id=message.correlation_id,
            content_type="application/json"
        )
        connection = await aio_pika.connect("amqp://guest:guest@rabbitmq/")
        channel = await connection.channel()

        await channel.default_exchange.publish(
            response_message,
            routing_key=message.reply_to
        )

        logger.info("Message sent successfully.")


async def consume_queue(queue_name, callback, routing_key):
    max_retries = 5
    for attempt in range(1, max_retries + 1):
        try:
            connection = await aio_pika.connect(host="rabbitmq")
            logger.warning(f"Connected to RabbitMQ on attempt {attempt}")
            break
        except Exception as e:
            logger.warning(f"Failed to connect to RabbitMQ (attempt {attempt}/{max_retries}): {e}")
            if attempt == max_retries:
                logger.error("Max retries reached. Giving up.")
                return
            await asyncio.sleep(5)

    channel = await connection.channel()
    exchange = await channel.get_exchange('amq.direct')
    queue = await channel.declare_queue(queue_name, durable=True)
    await queue.bind(exchange, routing_key=routing_key)

    async with queue.iterator() as queue_iter:
        async for message in queue_iter:
            await callback(message)


async def start_consuming():
    await asyncio.gather(
        consume_queue("check_room_exists_queue", room_exists, 'room.exists'),
    )
