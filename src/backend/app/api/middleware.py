"""
Middleware for handling cross-cutting concerns like language headers.
"""
from __future__ import annotations

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from app.api.dependencies import get_user_language, get_optional_current_user
from app.core.database import SessionLocal


class ContentLanguageMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add Content-Language header to all API responses.
    
    This middleware determines the response language using the same logic
    as the get_user_language dependency:
    1. Accept-Language HTTP header
    2. User's preferred_language (if authenticated)
    3. Fallback to Vietnamese ('vi')
    """
    
    async def dispatch(self, request: Request, call_next):
        """
        Process the request and add Content-Language header to response.
        
        Args:
            request: The incoming HTTP request
            call_next: The next middleware or route handler
            
        Returns:
            Response with Content-Language header added
        """
        # Determine the language for this request
        # We need to replicate the get_user_language logic here since
        # middleware doesn't have direct access to dependencies
        language = await self._determine_language(request)
        
        # Call the next middleware or route handler
        response: Response = await call_next(request)
        
        # Add Content-Language header to the response
        response.headers["Content-Language"] = language
        
        return response
    
    async def _determine_language(self, request: Request) -> str:
        """
        Determine the language for the current request.
        
        Resolution order:
        1. Accept-Language HTTP header
        2. User's preferred_language (if authenticated)
        3. Fallback to 'vi'
        
        Args:
            request: The incoming HTTP request
            
        Returns:
            Language code (vi, en)
        """
        from app.api.dependencies import SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, _parse_accept_language
        
        # Step 1: Check Accept-Language header
        accept_language_header = request.headers.get("Accept-Language")
        if accept_language_header:
            language = _parse_accept_language(accept_language_header)
            if language in SUPPORTED_LANGUAGES:
                return language
        
        # Step 2: Check user's preferred_language if authenticated
        try:
            # Create a database session for this request
            db = SessionLocal()
            try:
                # Try to get the current user
                from fastapi.security import HTTPBearer
                from app.core.security import decode_access_token
                from app.repositories.user_repository import UserRepository
                
                bearer_scheme = HTTPBearer(auto_error=False)
                auth_header = request.headers.get("Authorization")
                
                if auth_header and auth_header.startswith("Bearer "):
                    token = auth_header.split(" ")[1]
                    try:
                        payload = decode_access_token(token)
                        user_id = int(payload["sub"])
                        user = UserRepository(db).get_by_id(user_id)
                        
                        if user and user.is_active and user.preferred_language:
                            user_status = str(getattr(user, "status", "") or "").upper()
                            if user_status != "LOCKED" and user.preferred_language in SUPPORTED_LANGUAGES:
                                return user.preferred_language
                    except Exception:
                        # If token is invalid or user not found, continue to fallback
                        pass
            finally:
                db.close()
        except Exception:
            # If anything goes wrong with DB access, continue to fallback
            pass
        
        # Step 3: Fallback to default language
        return DEFAULT_LANGUAGE
