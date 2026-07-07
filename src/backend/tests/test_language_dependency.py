"""
Tests for language resolution dependency (Task 3.1)
"""
import unittest
from unittest.mock import MagicMock

from fastapi import Request

from app.api.dependencies import get_user_language
from app.models.entities import User


class TestLanguageResolutionDependency(unittest.TestCase):
    """Test the get_user_language dependency function"""
    
    def test_accept_language_header_vietnamese(self):
        """Test that Accept-Language header with 'vi' returns 'vi'"""
        request = MagicMock(spec=Request)
        request.headers.get.return_value = "vi"
        
        result = get_user_language(request, current_user=None)
        
        assert result == "vi"
    
    def test_accept_language_header_english(self):
        """Test that Accept-Language header with 'en' returns 'en'"""
        request = MagicMock(spec=Request)
        request.headers.get.return_value = "en"
        
        result = get_user_language(request, current_user=None)
        
        assert result == "en"
    
    def test_accept_language_header_with_quality_values(self):
        """Test parsing Accept-Language header with quality values"""
        request = MagicMock(spec=Request)
        request.headers.get.return_value = "en-US,en;q=0.9,vi;q=0.8"
        
        result = get_user_language(request, current_user=None)
        
        assert result == "en"
    
    def test_accept_language_header_with_locale(self):
        """Test parsing Accept-Language header with locale (en-US -> en)"""
        request = MagicMock(spec=Request)
        request.headers.get.return_value = "en-US"
        
        result = get_user_language(request, current_user=None)
        
        assert result == "en"
    
    def test_accept_language_header_unsupported_language(self):
        """Test that unsupported language in Accept-Language falls through"""
        request = MagicMock(spec=Request)
        request.headers.get.return_value = "fr"
        
        result = get_user_language(request, current_user=None)
        
        # Should fall back to default since no user preference
        assert result == "vi"
    
    def test_user_preferred_language(self):
        """Test that authenticated user's preferred_language is used"""
        request = MagicMock(spec=Request)
        request.headers.get.return_value = None
        
        user = MagicMock(spec=User)
        user.preferred_language = "en"
        
        result = get_user_language(request, current_user=user)
        
        assert result == "en"
    
    def test_accept_language_takes_precedence_over_user_preference(self):
        """Test that Accept-Language header takes precedence over user preference"""
        request = MagicMock(spec=Request)
        request.headers.get.return_value = "vi"
        
        user = MagicMock(spec=User)
        user.preferred_language = "en"
        
        result = get_user_language(request, current_user=user)
        
        # Accept-Language should take precedence
        assert result == "vi"
    
    def test_fallback_to_default_when_no_preference(self):
        """Test fallback to Vietnamese when no language preference found"""
        request = MagicMock(spec=Request)
        request.headers.get.return_value = None
        
        result = get_user_language(request, current_user=None)
        
        assert result == "vi"
    
    def test_fallback_to_default_when_user_preference_null(self):
        """Test fallback to Vietnamese when user's preferred_language is None"""
        request = MagicMock(spec=Request)
        request.headers.get.return_value = None
        
        user = MagicMock(spec=User)
        user.preferred_language = None
        
        result = get_user_language(request, current_user=user)
        
        assert result == "vi"
    
    def test_fallback_to_default_when_user_preference_unsupported(self):
        """Test fallback to Vietnamese when user's preferred_language is unsupported"""
        request = MagicMock(spec=Request)
        request.headers.get.return_value = None
        
        user = MagicMock(spec=User)
        user.preferred_language = "fr"
        
        result = get_user_language(request, current_user=user)
        
        assert result == "vi"
    
    def test_accept_language_header_multiple_languages_first_supported(self):
        """Test that first supported language is selected from multiple languages"""
        request = MagicMock(spec=Request)
        # French not supported, but Vietnamese is
        request.headers.get.return_value = "fr,vi,en"
        
        result = get_user_language(request, current_user=None)
        
        assert result == "vi"
    
    def test_malformed_accept_language_header(self):
        """Test that malformed Accept-Language header doesn't crash"""
        request = MagicMock(spec=Request)
        request.headers.get.return_value = ";;;invalid;;;"
        
        # Should not raise exception and should fall back to default
        result = get_user_language(request, current_user=None)
        
        assert result == "vi"
    
    def test_empty_accept_language_header(self):
        """Test that empty Accept-Language header falls through"""
        request = MagicMock(spec=Request)
        request.headers.get.return_value = ""
        
        result = get_user_language(request, current_user=None)
        
        assert result == "vi"


if __name__ == "__main__":
    unittest.main()
