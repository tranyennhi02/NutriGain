from __future__ import annotations

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.entities import User
from app.repositories.user_repository import UserRepository


bearer_scheme = HTTPBearer(auto_error=False)

# Supported languages
SUPPORTED_LANGUAGES = ["vi", "en"]
DEFAULT_LANGUAGE = "vi"


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is required",
        )

    try:
        payload = decode_access_token(credentials.credentials)
        user_id = int(payload["sub"])
        print(f"[AUTH TOKEN DECODED] sub={payload.get('sub')}, user_id={user_id}")
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from exc

    user = UserRepository(db).get_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    print(f"[GET CURRENT USER] user_id={user.id}, email={user.email}")
    user_status = str(getattr(user, "status", "") or "").upper()
    if not user.is_active or user_status == "LOCKED":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tài khoản đã bị khóa.")
    return user


def get_optional_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User | None:
    """Return current user or None without raising on missing/invalid token or DB errors."""
    try:
        if credentials is None or credentials.scheme.lower() != "bearer":
            return None

        try:
            payload = decode_access_token(credentials.credentials)
            user_id = int(payload["sub"])
        except Exception:
            return None

        try:
            user = UserRepository(db).get_by_id(user_id)
        except Exception:
            # DB error — treat as unauthenticated to avoid 500 in routes
            return None

        if user is None:
            return None
        user_status = str(getattr(user, "status", "") or "").upper()
        if not user.is_active or user_status == "LOCKED":
            return None
        return user
    except Exception:
        return None


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if str(current_user.role or "").upper() not in {"ADMIN", "SUPER_ADMIN"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền truy cập chức năng quản trị.",
        )
    return current_user


def get_user_language(
    request: Request,
    current_user: User | None = Depends(get_optional_current_user),
) -> str:
    """
    Determine the language for the current request.
    
    Resolution order:
    1. Accept-Language HTTP header
    2. User's preferred_language field (if authenticated)
    3. Fallback to Vietnamese ('vi')
    
    Returns:
        Language code (vi, en)
    """
    # Step 1: Check Accept-Language header
    accept_language_header = request.headers.get("Accept-Language")
    if accept_language_header:
        language = _parse_accept_language(accept_language_header)
        if language in SUPPORTED_LANGUAGES:
            return language
    
    # Step 2: Check user's preferred_language if authenticated
    if current_user is not None and current_user.preferred_language:
        if current_user.preferred_language in SUPPORTED_LANGUAGES:
            return current_user.preferred_language
    
    # Step 3: Fallback to default language
    return DEFAULT_LANGUAGE


def _parse_accept_language(header: str) -> str | None:
    """
    Parse Accept-Language header and return the first supported language code.
    
    Header format examples:
    - "en"
    - "en-US,en;q=0.9,vi;q=0.8"
    - "vi"
    
    Args:
        header: Accept-Language header value
        
    Returns:
        First language code found, or None if header is invalid
    """
    if not header:
        return None
    
    try:
        # Split by comma to get language preferences
        languages = header.split(",")
        
        for lang_entry in languages:
            # Remove quality value (e.g., "en;q=0.9" -> "en")
            lang_code = lang_entry.split(";")[0].strip()
            
            # Extract just the language part (e.g., "en-US" -> "en")
            if "-" in lang_code:
                lang_code = lang_code.split("-")[0]
            
            # Return first valid language code
            if lang_code:
                return lang_code
        
        return None
    except Exception:
        # If parsing fails, return None to fall through to next resolution step
        return None
