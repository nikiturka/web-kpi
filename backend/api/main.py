import uvicorn
from fastapi import FastAPI, Request
import httpx

app = FastAPI()

# user_service URL for Docker network
USER_SERVICE_URL = "http://user_service:8001"


async def proxy_request(service_url: str, request: Request):
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=f"{service_url}{request.url.path}",
            params=request.query_params,
            json=await request.json() if request.method in ["POST", "PUT", "PATCH"] else None,
            headers=request.headers.raw,
        )
    return response


@app.api_route("/users/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def users_proxy(path: str, request: Request):
    response = await proxy_request(USER_SERVICE_URL, request)
    return response.json(), response.status_code


# @lru_cache
# def get_settings():
#     return Settings()
#
#
# @app.post("/api/user/subscribe")
# def subscribe_user(data: dict, settings: Annotated[Settings, Depends(get_settings)]):
#     publish_to_rabbitmq(
#         queue_name=settings.queue_name_to_first_service,
#         exchanger=settings.exchanger,
#         routing_key=settings.routing_key_to_first_service,
#         data=data
#     )
#     return {"detail": "User subscribed."}
#
#
# @app.post("/api/order/checkout")
# async def order_checkout(data: dict, settings: Annotated[Settings, Depends(get_settings)]):
#     await a_publish_to_rabbitmq(
#         queue_name=settings.queue_name_to_second_service,
#         exchanger=settings.exchanger,
#         routing_key=settings.routing_key_to_second_service,
#         data=data
#     )
#     return {"detail": "Order created."}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000,
                log_level="debug", reload=True)
