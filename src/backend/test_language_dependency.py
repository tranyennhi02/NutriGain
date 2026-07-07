"""
Unit tests for language resolution dependency (get_user_language).

Tests the implementation of task 3.1: Implement language resolution dependency
from the multilingual-support spec.
"""
import pytest
from fastapi import Request
from unittest.mock import Mock, MagicMock

from app.api.dependencies import get_user_language, _parse_accept_language, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE
from app.models.entities import User


class TestParseAcceptLanguage:
    """Test the _parse_accept_language helper function."""
    
    def test_parse_single_language(self):
        """Test parsing a single language code."""
        assert _parse_accept_language("en") == "en"
        assert _parse_accept_language("vi") == "vi"
    
    def test_parse_language_with_region(self):
        """Test parsing language with region code (e.g., en-US)."""
        assert _parse_accept_language("en-US") == "en"
        assert _parse_accept_language("vi-VN") == "vi"
    
    def test_parse_multiple_languages(self):
        """Test parsing multiple languages - should return first."""
        assert _parse_accept_language("en,vi") == "en"
        assert _parse_accept_language("vi,en") == "vi"
    
    def test_parse_with_quality_values(self):
        """Test parsing with quality values (q parameter)."""
        assert _parse_accept_language("en;q=0.9") == "en"
        assert _parse_accept_language("en-US,en;q=0.9,vi;q=0.8") == "en"
    
    def test_parse_with_whitespace(self):
        """Test parsing with extra whitespace."""
        assert _parse_accept_language("  en  ") == "en"
        assert _parse_accept_language("en , vi") == "en"
    
    def test_parse_empty_header(self):
        """Test parsing empty or None header."""
        assert _parse_accept_language("") is None
        assert _parse_accept_language(None) is None
    
    def test_parse_invalid_format(self):
        """Test parsing malformed header - should not raise exception."""
        # Should handle gracefully and return None
        result = _parse_accept_language(";;;;")
        # Either returns None or empty string, both acceptable fallback behavior
        assert result is None or result == ""


class TestGetUserLanguage:
    """Test the get_user_language dependency function."""
    
    def test_accept_language_header_priority(self):
        """Test that Accept-Language header has highest priority."""
        # Mock request with Accept-Language header
        request = Mock(spec=Request)
        request.headers.get.return_value = "en"
        
        # Mock authenticated user with different preference
        user = Mock(spec=User)
        user.preferred_language = "vi"
        
        result = get_user_language(request, user)
        
        # Should use Accept-Language header (en) over user preference (vi)
        assert result == "en"
    
    def test_user_preferred_language_fallback(self):
        """Test that user's preferred_language is used when Accept-Language is not present."""
        # Mock request without Accept-Language header
        request = Mock(spec=Request)
        request.headers.get.return_value = None
        
        # Mock authenticated user with preference
        user = Mock(spec=User)
        user.preferred_language = "en"
        
        result = get_user_language(request, user)
        
        assert result == "en"
    
    def test_default_language_fallback(self):
        """Test fallback to default language when no preference is available."""
        # Mock request without Accept-Language header
        request = Mock(spec=Request)
        request.headers.get.return_value = None
        
        # No user (not authenticated)
        user = None
        
        result = get_user_language(request, user)
        
        assert result == DEFAULT_LANGUAGE
        assert result == "vi"
    
    def test_unauthenticated_user_with_accept_language(self):
        """Test that unauthenticated users can still get language from Accept-Language."""
        request = Mock(spec=Request)
        request.headers.get.return_value = "en"
        
        user = None
        
        result = get_user_language(request, user)
        
        assert result == "en"
    
    def test_user_with_null_preferred_language(self):
        """Test user with NULL preferred_language falls back to default."""
        request = Mock(spec=Request)
        request.headers.get.return_value = None
        
        user = Mock(spec=User)
        user.preferred_language = None
        
        result = get_user_language(request, user)
        
        assert result == DEFAULT_LANGUAGE
        assert result == "vi"
    
    def test_unsupported_accept_language_uses_user_preference(self):
        """Test that unsupported Accept-Language falls back to user preference."""
        request = Mock(spec=Request)
        request.headers.get.return_value = "fr"  # French not supported
        
        user = Mock(spec=User)
        user.preferred_language = "en"
        
        result = get_user_language(request, user)
        
        # Should fall back to user preference since "fr" is not supported
        assert result == "en"
    
    def test_unsupported_accept_language_unauthenticated_uses_default(self):
        """Test that unsupported Accept-Language for unauthenticated user uses default."""
        request = Mock(spec=Request)
        request.headers.get.return_value = "fr"  # French not supported
        
        user = None
        
        result = get_user_language(request, user)
        
        # Should fall back to default language
        assert result == DEFAULT_LANGUAGE
        assert result == "vi"
    
    def test_supported_languages_constant(self):
        """Test that SUPPORTED_LANGUAGES contains expected values."""
        assert "vi" in SUPPORTED_LANGUAGES
        assert "en" in SUPPORTED_LANGUAGES
        assert len(SUPPORTED_LANGUAGES) == 2
    
    def test_vietnamese_is_default(self):
        """Test that Vietnamese is the default fallback language."""
        assert DEFAULT_LANGUAGE == "vi"
    
    def test_complex_accept_language_header(self):
        """Test complex Accept-Language header with multiple entries and quality values."""
        request = Mock(spec=Request)
        request.headers.get.return_value = "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,vi;q=0.6"
        
        user = None
        
        result = get_user_language(request, user)
        
        # Should find first supported language (en) and use it
        assert result == "en"
    
    def test_accept_language_takes_precedence_over_user_preference(self):
        """Test resolution order: Accept-Language > User preference > Default."""
        # Test case 1: Accept-Language present
        request = Mock(spec=Request)
        request.headers.get.return_value = "en"
        user = Mock(spec=User)
        user.preferred_language = "vi"
        
        assert get_user_language(request, user) == "en"
        
        # Test case 2: No Accept-Language, use user preference
        request.headers.get.return_value = None
        assert get_user_language(request, user) == "vi"
        
        # Test case 3: No Accept-Language, no user, use default
        assert get_user_language(request, None) == "vi"
    
    def test_user_unsupported_preferred_language_uses_default(self):
        """Test that user with unsupported preferred_language falls back to default."""
        request = Mock(spec=Request)
        request.headers.get.return_value = None
        
        user = Mock(spec=User)
        user.preferred_language = "fr"  # Unsupported language
        
        result = get_user_language(request, user)
        
        # Should fall back to default since user's preference is not supported
        assert result == DEFAULT_LANGUAGE
        assert result == "vi"


class TestLanguageResolutionIntegration:
    """Integration tests for the full language resolution flow."""
    
    def test_resolution_order_complete(self):
        """Test the complete resolution order with all scenarios."""
        scenarios = [
            # (accept_language, user_pref, expected_result)
            ("en", "vi", "en"),           # Accept-Language wins
            ("vi", "en", "vi"),           # Accept-Language wins
            (None, "en", "en"),           # User preference used
            (None, "vi", "vi"),           # User preference used
            (None, None, "vi"),           # Default fallback
            ("fr", "en", "en"),           # Unsupported Accept-Language, use user pref
            ("fr", None, "vi"),           # Unsupported Accept-Language, use default
            ("en-US", "vi", "en"),        # Region code stripped, Accept-Language wins
        ]
        
        for accept_lang, user_pref, expected in scenarios:
            request = Mock(spec=Request)
            request.headers.get.return_value = accept_lang
            
            if user_pref is not None:
                user = Mock(spec=User)
                user.preferred_language = user_pref
            else:
                user = None
            
            result = get_user_language(request, user)
            assert result == expected, f"Failed for accept_lang={accept_lang}, user_pref={user_pref}"


if __name__ == "__main__":
    # Run tests with pytest
    pytest.main([__file__, "-v"])
