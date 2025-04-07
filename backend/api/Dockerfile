FROM python
WORKDIR /api/
ADD . /api/
RUN pip install aio-pika pika fastapi uvicorn pydantic-settings httpx
CMD [ "python3", "main.py" ]