import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import HTTPException, status

from backend.src.models.user import TokenData, User, UserInDB

# Get secret key from environment or use a default one
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "3b3350a35ad3e28cc8fde03fd11657c04b70ffd39d7caf53a1f1ea6c3d4454d9")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password context for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Mock user database - replace with an actual database in production
fake_users_db = {
    "johndoe": {
        "id": 1,
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": pwd_context.hash("secret"),
        "disabled": False,
    },
    "alice": {
        "id": 2,
        "username": "alice",
        "full_name": "Alice Wonderland",
        "email": "alice@example.com",
        "hashed_password": pwd_context.hash("secret123"),
        "disabled": False,
    },
}


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def get_user(username: str) -> Optional[UserInDB]:
    """Get a user from the database"""
    if username in fake_users_db:
        user_dict = fake_users_db[username]
        return UserInDB(**user_dict)
    return None


def authenticate_user(username: str, password: str) -> Optional[User]:
    """Authenticate a user"""
    user = get_user(username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    
    # Set expiration time
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    # Create JWT token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> TokenData:
    """Verify a JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        
        if username is None:
            raise credentials_exception
        
        token_data = TokenData(username=username)
        return token_data
    
    except JWTError:
        raise credentials_exception 