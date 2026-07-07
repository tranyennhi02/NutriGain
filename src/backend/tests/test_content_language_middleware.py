"""
Tests for Content-Language response header middleware (Task 3.3)
"""
import asyncio
import unittest
from unittest.mock import AsyncMock, MagicMock, patch

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.testclient import TestClient

from app.api.middleware import ContentLanguageMiddleware


class TestContentLanguageMiddleware(unittest.TestCase):
    """Test the ContentLanguageMiddleware"""
    
    def setUp(self):
        """Set up test application with middleware"""
        self.app = FastAPI()
        self.app.add_middleware(ContentLanguageMiddleware)
        
        # Add a test endpoint
        @self.app.get("/test")
        async def test_endpoint():
            return {"message": "test"}
        
        self.client = TestClient(self.app)
    
    def test_content_language_header_with_accept_language_vi(self):
        """Test that Content-Language header is set to 'vi' when Accept-Language is 'vi'"""
        response = self.client.get("/test", headers={"Accept-Language": "vi"})
        
        assert response.status_code == 200
        assert "Content-Language" in response.headers
        assert response.headers["Content-Language"] == "vi"
    
    def test_content_language_header_with_accept_language_en(self):
        """Test that Content-Language header is set to 'en' when Accept-Language is 'en'"""
        response = self.client.get("/test", headers={"Accept-Language": "en"})
        
        assert response.status_code == 200
        assert "Content-Language" in response.headers
        assert response.headers["Content-Language"] == "en"
    
    def test_content_language_header_with_accept_language_multiple(self):
        """Test that Content-Language header uses first supported language"""
        response = self.client.get("/test", headers={"Accept-Language": "en-US,en;q=0.9,vi;q=0.8"})
        
        assert response.status_code == 200
        assert "Content-Language" in response.headers
        assert response.headers["Content-Language"] == "en"
    
    def test_content_language_header_fallback_to_default(self):
        """Test that Content-Language header defaults to 'vi' when no Accept-Language"""
        response = self.client.get("/test")
        
        assert response.status_code == 200
        assert "Content-Language" in response.headers
        assert response.headers["Content-Language"] == "vi"
    
    def test_content_language_header_with_unsupported_language(self):
        """Test that Content-Language header falls back to 'vi' for unsupported language"""
        response = self.client.get("/test", headers={"Accept-Language": "fr"})
        
        assert response.status_code == 200
        assert "Content-Language" in response.headers
        assert response.headers["Content-Language"] == "vi"
    
    def test_content_language_header_added_to_all_responses(self):
        """Test that Content-Language header is added to all responses"""
        # Test with multiple endpoints
        response1 = self.client.get("/test", headers={"Accept-Language": "en"})
        response2 = self.client.get("/test", headers={"Accept-Language": "vi"})
        
        assert "Content-Language" in response1.headers
        assert "Content-Language" in response2.headers
        assert response1.headers["Content-Language"] == "en"
        assert response2.headers["Content-Language"] == "vi"
    
    def test_content_language_header_with_malformed_accept_language(self):
        """Test that middleware handles malformed Accept-Language gracefully"""
        response = self.client.get("/test", headers={"Accept-Language": ";;;invalid;;;"})
        
        assert response.status_code == 200
        assert "Content-Language" in response.headers
        # Should fall back to default
        assert response.headers["Content-Language"] == "vi"


class TestContentLanguageMiddlewareWithAuthentication(unittest.TestCase):
    """Test the ContentLanguageMiddleware with authenticated users"""
    
    def setUp(self):
        """Set up test application with middleware"""
        self.app = FastAPI()
        self.app.add_middleware(ContentLanguageMiddleware)
        
        # Add a test endpoint
        @self.app.get("/test")
        async def test_endpoint():
            return {"message": "test"}
        
        self.client = TestClient(self.app)
    
    @patch('app.core.database.SessionLocal')
    @patch('app.core.security.decode_access_token')
    @patch('app.repositories.user_repository.UserRepository')
    def test_content_language_with_authenticated_user_preference(
        self, 
        mock_user_repo_class, 
        mock_decode_token, 
        mock_session_local
    ):
        """Test that authenticated user's preferred_language is used"""
        # Mock database session
        mock_db = MagicMock()
        mock_session_local.return_value = mock_db
        
        # Mock token decoding
        mock_decode_token.return_value = {"sub": "1"}
        
        # Mock user with English preference
        mock_user = MagicMock()
        mock_user.preferred_language = "en"
        mock_user.is_active = True
        mock_user.status = "ACTIVE"
        
        mock_user_repo = MagicMock()
        mock_user_repo.get_by_id.return_value = mock_user
        mock_user_repo_class.return_value = mock_user_repo
        
        # Make request with Authorization header
        response = self.client.get(
            "/test",
            headers={"Authorization": "Bearer fake_token"}
        )
        
        assert response.status_code == 200
        assert "Content-Language" in response.headers
        assert response.headers["Content-Language"] == "en"
    
    @patch('app.core.database.SessionLocal')
    @patch('app.core.security.decode_access_token')
    def test_content_language_with_invalid_token(
        self, 
        mock_decode_token, 
        mock_session_local
    ):
        """Test that invalid token doesn't crash and falls back to default"""
        # Mock database session
        mock_db = MagicMock()
        mock_session_local.return_value = mock_db
        
        # Mock token decoding to raise exception
        mock_decode_token.side_effect = Exception("Invalid token")
        
        # Make request with invalid Authorization header
        response = self.client.get(
            "/test",
            headers={"Authorization": "Bearer invalid_token"}
        )
        
        assert response.status_code == 200
        assert "Content-Language" in response.headers
        # Should fall back to default
        assert response.headers["Content-Language"] == "vi"
    
    @patch('app.core.database.SessionLocal')
    @patch('app.core.security.decode_access_token')
    @patch('app.repositories.user_repository.UserRepository')
    def test_accept_language_takes_precedence_over_user_preference(
        self, 
        mock_user_repo_class, 
        mock_decode_token, 
        mock_session_local
    ):
        """Test that Accept-Language header takes precedence over user preference"""
        # Mock database session
        mock_db = MagicMock()
        mock_session_local.return_value = mock_db
        
        # Mock token decoding
        mock_decode_token.return_value = {"sub": "1"}
        
        # Mock user with English preference
        mock_user = MagicMock()
        mock_user.preferred_language = "en"
        mock_user.is_active = True
        mock_user.status = "ACTIVE"
        
        mock_user_repo = MagicMock()
        mock_user_repo.get_by_id.return_value = mock_user
        mock_user_repo_class.return_value = mock_user_repo
        
        # Make request with Authorization header AND Accept-Language header
        response = self.client.get(
            "/test",
            headers={
                "Authorization": "Bearer fake_token",
                "Accept-Language": "vi"
            }
        )
        
        assert response.status_code == 200
        assert "Content-Language" in response.headers
        # Accept-Language should take precedence
        assert response.headers["Content-Language"] == "vi"


if __name__ == "__main__":
    unittest.main()
