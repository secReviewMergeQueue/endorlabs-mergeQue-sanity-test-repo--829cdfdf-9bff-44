from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional

from backend.src.models.user import User, TokenData
from backend.src.auth.utils import verify_token, get_user

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Get the current user from JWT token"""
    token_data = verify_token(token)
    user = get_user(username=token_data.username)
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get the current active user"""
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return current_user


def get_optional_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[User]:
    """Get the current user if a token is provided (optional authentication)"""
    if token is None:
        return None
    
    try:
        token_data = verify_token(token)
        user = get_user(username=token_data.username)
        return user
    except HTTPException:
        return None 