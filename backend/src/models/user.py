from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List


class Token(BaseModel):
    """JWT token model"""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """JWT token data model"""
    username: Optional[str] = None


class UserBase(BaseModel):
    """Base user model"""
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None


class UserCreate(UserBase):
    """User creation model"""
    password: str


class User(UserBase):
    """User model"""
    id: Optional[int] = None

    class Config:
        from_attributes = True


class UserInDB(User):
    """User database model"""
    hashed_password: str 