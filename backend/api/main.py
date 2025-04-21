import uvicorn
import httpx

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# user_service URL for Docker network
USER_SERVICE_URL = "http://user_service:8002"
ROOM_SERVICE_URL = "http://room_service:8003"
BOOKING_SERVICE_URL = "http://booking_service:8004"


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
    return Response(content=response.content, status_code=response.status_code, headers=dict(response.headers))


@app.api_route("/rooms/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def rooms_proxy(path: str, request: Request):
    response = await proxy_request(ROOM_SERVICE_URL, request)
    return Response(content=response.content, status_code=response.status_code, headers=dict(response.headers))


@app.api_route("/bookings/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def bookings_proxy(path: str, request: Request):
    response = await proxy_request(BOOKING_SERVICE_URL, request)
    return Response(content=response.content, status_code=response.status_code, headers=dict(response.headers))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000,
                log_level="debug", reload=True)
