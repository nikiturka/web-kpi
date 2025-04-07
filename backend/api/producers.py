import json
import aio_pika
import pika

from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    exchanger: str = "amq.direct"
    queue_name_to_first_service: str = "notify_user"
    queue_name_to_second_service: str = "changebalance_orders"
    queue_name_to_user_service: str = 'test_queue'

    routing_key_to_first_service: str = "user.mailing"
    routing_key_to_second_service: str = "orders.checkout"
    routing_key_to_user_service: str = 'test'


def publish_to_rabbitmq(queue_name: str, exchanger: str, routing_key: str, data: dict) -> None:
    connection = pika.BlockingConnection(pika.ConnectionParameters("rabbitmq"))
    channel = connection.channel()
    channel.queue_bind(queue_name, exchanger, routing_key)
    channel.basic_publish(exchanger, routing_key, json.dumps(data).encode())
    connection.close()


async def a_publish_to_rabbitmq(queue_name: str, exchanger: str, routing_key: str, data: dict) -> None:
    connection = await aio_pika.connect_robust(host="rabbitmq")
    channel = await connection.channel()
    exchange = await channel.get_exchange(exchanger)
    try:
        queue = await channel.get_queue(queue_name)
    except aio_pika.exceptions.ChannelNotFoundEntity:
        queue = await channel.declare_queue(queue_name, durable=True)
    await queue.bind(exchange, routing_key)
    message = aio_pika.Message(json.dumps(
        data).encode(), content_type="application/json")
    await exchange.publish(message, routing_key)
    await connection.close()
