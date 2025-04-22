import json
import aio_pika
import asyncio
import logging

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .auth.utils import decode_jwt
from .models import Role, User
from .db import get_async_session, session_factory

logger = logging.getLogger(__name__)


async def admin_permission(message: aio_pika.IncomingMessage):
    async with message.process():
        body = json.loads(message.body)
        token = body.get("token")
        try:
            payload = decode_jwt(token)
            logger.warning(f"PAYLOAD: {payload}")
            if payload["role"] != 'admin':
                user_info = {
                    "status": "error",
                    "detail": "You are not allowed to perform this action"
                }
            else:
                user_info = {
                    "status": "ok"
                }
        except Exception as e:
            logger.warning(f"JWT decode failed: {e}")
            user_info = {"status": "error", "detail": str(e)}

        response_message = aio_pika.Message(
            body=json.dumps(user_info).encode(),
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


async def user_exists(
        message: aio_pika.IncomingMessage,
):
    async with message.process():
        body = json.loads(message.body)
        token = body.get("token")
        try:
            payload = decode_jwt(token)

            logger.warning(f"PAYLOAD: {payload}")

            async with session_factory() as session:
                stmt = select(User).where(User.email == payload["email"])
                result = await session.execute(stmt)
                user = result.scalar_one_or_none()

            if not user:
                user_info = {
                    "status": "error",
                    "detail": "User not found"
                }
            else:
                user_info = {
                    "status": "ok",
                    "user_id": str(user.id),
                }
        except Exception as e:
            logger.warning(f"JWT decode failed: {e}")
            user_info = {"status": "error", "detail": str(e)}

        response_message = aio_pika.Message(
            body=json.dumps(user_info).encode(),
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
        consume_queue("get_admin_permission_queue", admin_permission, 'user.get'),
        consume_queue("check_user_exists_queue", user_exists, 'user.exists'),
    )
