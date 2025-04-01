from pathlib import Path

from pydantic import BaseModel

SRC_DIR = Path(__file__).resolve().parent.parent


class JWTConfig(BaseModel):
    private_key: Path = SRC_DIR / 'auth' / 'certs' / 'jwt-private.pem'
    public_key: Path = SRC_DIR / 'auth' / 'certs' / 'jwt-public.pem'
    algorithm: str = 'RS256'
    access_token_expires_in: int = 15