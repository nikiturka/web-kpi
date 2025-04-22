import uuid
import json
import asyncio
import aio_pika
from pydantic_settings import BaseSettings
import logging


logger = logging.getLogger(__name__)


class RoomProducerSettings(BaseSettings):
    exchanger: str = "amq.direct"

    user_exists_queue: str = "check_user_exists_queue"
    room_exists_queue: str = "check_room_exists_queue"
    update_available_slots_queue: str = "update_available_slots_queue"

    routing_key_to_user_exists_queue: str = "user.exists"
    routing_key_to_room_exists_queue: str = "room.exists"
    routing_key_to_update_available_slots_queue: str = "slots.update"


Settings = RoomProducerSettings()


async def rpc_request(queue_name: str, exchanger: str, routing_key: str, data: dict):
    connection = await aio_pika.connect_robust(host="rabbitmq")
    channel = await connection.channel()
    exchange = await channel.get_exchange(exchanger)

    callback_queue = await channel.declare_queue(exclusive=True)
    correlation_id = str(uuid.uuid4())
    future = asyncio.get_event_loop().create_future()

    async def on_response(message: aio_pika.IncomingMessage):
        if message.correlation_id == correlation_id:
            future.set_result(json.loads(message.body))

    await callback_queue.consume(on_response)

    message = aio_pika.Message(
        body=json.dumps(data).encode(),
        content_type="application/json",
        reply_to=callback_queue.name,
        correlation_id=correlation_id,
    )

    await exchange.publish(message, routing_key=routing_key)

    try:
        result = await asyncio.wait_for(future, timeout=10)
    except asyncio.TimeoutError:
        result = {"error": "Timeout while waiting for response"}

    await connection.close()
    return result
