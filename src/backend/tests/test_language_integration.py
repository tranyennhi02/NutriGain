"""
Integration tests for language resolution in API endpoints (Task 3.1)
"""
import unittest
from fastapi import FastAPI, Depends
from fastapi.testclient import TestClient

from app.api.dependencies import get_user_language


# Create a simple test app
app = FastAPI()


@app.get("/test-language")
async def test_language_endpoint(language: str = Depends(get_user_language)):
    """Test endpoint that returns the resolved language"""
    return {"language": language}


class TestLanguageIntegration(unittest.TestCase):
    """Integration tests for language resolution in API requests"""
    
    def setUp(self):
        """Set up test client"""
        self.client = TestClient(app)
    
    def test_api_request_with_accept_language_vietnamese(self):
        """Test API request with Accept-Language: vi"""
        response = self.client.get("/test-language", headers={"Accept-Language": "vi"})
        
        assert response.status_code == 200
        assert response.json() == {"language": "vi"}
    
    def test_api_request_with_accept_language_english(self):
        """Test API request with Accept-Language: en"""
        response = self.client.get("/test-language", headers={"Accept-Language": "en"})
        
        assert response.status_code == 200
        assert response.json() == {"language": "en"}
    
    def test_api_request_with_accept_language_complex(self):
        """Test API request with complex Accept-Language header"""
        response = self.client.get(
            "/test-language", 
            headers={"Accept-Language": "en-US,en;q=0.9,vi;q=0.8"}
        )
        
        assert response.status_code == 200
        assert response.json() == {"language": "en"}
    
    def test_api_request_without_accept_language(self):
        """Test API request without Accept-Language header defaults to 'vi'"""
        response = self.client.get("/test-language")
        
        assert response.status_code == 200
        assert response.json() == {"language": "vi"}
    
    def test_api_request_with_unsupported_language(self):
        """Test API request with unsupported language falls back to 'vi'"""
        response = self.client.get("/test-language", headers={"Accept-Language": "fr"})
        
        assert response.status_code == 200
        assert response.json() == {"language": "vi"}


if __name__ == "__main__":
    unittest.main()
