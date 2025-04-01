import jwt
import bcrypt
from datetime import timedelta, datetime

from .config import JWTConfig


jwt_config = JWTConfig()


def encode_jwt(
        payload: dict,
        private_key: str = jwt_config.private_key.read_text(),
        algorithm: str = jwt_config.algorithm,
        expiration: int = jwt_config.access_token_expires_in,
):
    time_now = datetime.utcnow()
    expire = time_now + timedelta(minutes=expiration)
    payload['exp'] = expire

    return jwt.encode(payload=payload, key=private_key, algorithm=algorithm)


def decode_jwt(
        token: str,
        public_key: str = jwt_config.public_key.read_text(),
        algorithm: str = jwt_config.algorithm
):
    return jwt.decode(jwt=token, key=public_key, algorithms=[algorithm])


def hash_password(password: str) -> bytes:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt)


def validate_password(
        password: str,
        hashed_password: bytes
) -> bool:
    return bcrypt.checkpw(password.encode(), hashed_password)
