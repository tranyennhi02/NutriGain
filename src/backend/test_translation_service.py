#!/usr/bin/env python3
"""
Test script to verify TranslationService implementation.

This tests the requirements for task 2.1:
- Loading JSON translation files
- Nested key navigation with dot notation
- Parameter interpolation
- Fallback logic (return key if not found)
- In-memory caching
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from app.services.translation_service import TranslationService


def test_translation_service():
    """Test TranslationService implementation."""
    print("\n" + "="*60)
    print("Testing TranslationService Implementation")
    print("="*60 + "\n")
    
    # Initialize service (tests loading JSON files and caching)
    print("Test 1: Initialize TranslationService and load translation files")
    service = TranslationService()
    print(f"✓ Service initialized successfully")
    print(f"✓ Supported languages: {service.get_supported_languages()}")
    print()
    
    # Test nested key navigation with dot notation
    print("Test 2: Nested key navigation (dot notation)")
    translation_vi = service.get_translation("errors.auth.invalid_credentials", "vi")
    translation_en = service.get_translation("errors.auth.invalid_credentials", "en")
    print(f"✓ Vietnamese: '{translation_vi}'")
    print(f"✓ English: '{translation_en}'")
    assert translation_vi != "errors.auth.invalid_credentials", "Should return actual translation"
    assert translation_en != "errors.auth.invalid_credentials", "Should return actual translation"
    print()
    
    # Test parameter interpolation
    print("Test 3: Parameter interpolation")
    translation = service.get_translation(
        "errors.validation.required_field", 
        "vi", 
        field="Email"
    )
    print(f"✓ With parameter: '{translation}'")
    assert "Email" in translation, "Should interpolate parameter"
    assert "{field}" not in translation, "Should not have placeholder left"
    print()
    
    # Test multiple parameter interpolation
    print("Test 4: Multiple parameter interpolation")
    translation = service.get_translation(
        "errors.validation.invalid_range",
        "vi",
        field="Weight",
        min=30,
        max=200
    )
    print(f"✓ With multiple parameters: '{translation}'")
    assert "Weight" in translation or "30" in translation, "Should interpolate parameters"
    print()
    
    # Test fallback logic (missing key)
    print("Test 5: Fallback logic (missing key returns key itself)")
    missing_key = "nonexistent.key.that.does.not.exist"
    result = service.get_translation(missing_key, "vi")
    print(f"✓ Result for missing key: '{result}'")
    assert result == missing_key, "Should return key itself when not found"
    print()
    
    # Test unsupported language (fallback)
    print("Test 6: Unsupported language returns key as fallback")
    result = service.get_translation("errors.auth.invalid_credentials", "fr")
    print(f"✓ Result for unsupported language 'fr': '{result}'")
    assert result == "errors.auth.invalid_credentials", "Should return key when language not found"
    print()
    
    # Test deep nesting
    print("Test 7: Deep nested keys")
    translation = service.get_translation("enums.meal_type.breakfast", "vi")
    print(f"✓ Deeply nested key: '{translation}'")
    assert translation != "enums.meal_type.breakfast", "Should return actual translation"
    print()
    
    # Test caching (verify translations are in memory)
    print("Test 8: Verify in-memory caching")
    assert len(service.translations) > 0, "Translations should be cached in memory"
    print(f"✓ Translations cached in memory: {len(service.translations)} language(s)")
    print(f"✓ Keys cached for 'vi': {len(service.translations.get('vi', {}))}")
    print()
    
    # Test reload functionality
    print("Test 9: Test reload_translations()")
    service.reload_translations()
    print(f"✓ Translations reloaded successfully")
    print(f"✓ Supported languages after reload: {service.get_supported_languages()}")
    print()
    
    print("="*60)
    print("✓ ALL TESTS PASSED!")
    print("="*60)
    print("\nSummary:")
    print("- ✓ Loads JSON translation files from app/translations/")
    print("- ✓ Supports nested key navigation with dot notation")
    print("- ✓ Performs parameter interpolation using string formatting")
    print("- ✓ Returns key itself as fallback when translation not found")
    print("- ✓ Caches translations in memory for performance")
    print("- ✓ Supports multiple languages (vi, en)")
    print("- ✓ Provides reload_translations() method")
    print()
    
    return True


if __name__ == "__main__":
    try:
        success = test_translation_service()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n✗ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
