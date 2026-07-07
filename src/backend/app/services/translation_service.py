from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


class TranslationService:
    """
    Service for managing backend translations with support for multiple languages.
    
    Features:
    - Loads JSON translation files from app/translations/ directory
    - Supports nested key navigation using dot notation (e.g., "errors.auth.invalid")
    - Parameter interpolation using string formatting
    - Fallback to key itself if translation not found
    - In-memory caching for performance
    """
    
    def __init__(self, translations_dir: str = "app/translations"):
        """
        Initialize TranslationService and load all translation files into memory.
        
        Args:
            translations_dir: Directory containing translation JSON files
        """
        self.translations_dir = Path(translations_dir)
        self.translations: dict[str, dict[str, Any]] = {}
        self.supported_languages: list[str] = []
        self._load_translations()
    
    def _load_translations(self) -> None:
        """
        Load all translation files from the translations directory into memory.
        Translation files should be named by language code (e.g., vi.json, en.json).
        """
        if not self.translations_dir.exists():
            logger.warning(
                "[TRANSLATION SERVICE] Translations directory not found: %s. Creating directory.",
                self.translations_dir
            )
            self.translations_dir.mkdir(parents=True, exist_ok=True)
            return
        
        json_files = list(self.translations_dir.glob("*.json"))
        
        if not json_files:
            logger.warning(
                "[TRANSLATION SERVICE] No translation files found in: %s",
                self.translations_dir
            )
            return
        
        for file_path in json_files:
            language_code = file_path.stem  # Get filename without extension
            
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    translation_data = json.load(f)
                
                self.translations[language_code] = translation_data
                self.supported_languages.append(language_code)
                
                logger.info(
                    "[TRANSLATION SERVICE] Loaded translations for language: %s (%d keys at root level)",
                    language_code,
                    len(translation_data) if isinstance(translation_data, dict) else 0
                )
            except json.JSONDecodeError as exc:
                logger.error(
                    "[TRANSLATION SERVICE] Failed to parse JSON for language %s: %s",
                    language_code,
                    exc
                )
            except Exception as exc:
                logger.error(
                    "[TRANSLATION SERVICE] Failed to load translations for language %s: %s",
                    language_code,
                    exc
                )
        
        logger.info(
            "[TRANSLATION SERVICE] Initialization complete. Supported languages: %s",
            self.supported_languages
        )
    
    def get_translation(
        self,
        key: str,
        language: str = "vi",
        **params
    ) -> str:
        """
        Get translated text for a key with parameter interpolation.
        
        Supports nested key navigation using dot notation (e.g., "errors.auth.invalid_credentials").
        Falls back to returning the key itself if translation is not found.
        
        Args:
            key: Translation key (dot notation supported, e.g., "errors.auth.invalid")
            language: Language code (vi, en). Defaults to "vi".
            **params: Parameters for string interpolation (e.g., name="John", count=5)
        
        Returns:
            Translated string with parameters interpolated, or the key itself if not found.
        
        Examples:
            >>> service.get_translation("errors.auth.invalid_credentials", "en")
            "Invalid email or password"
            
            >>> service.get_translation("welcome.message", "vi", name="John")
            "Xin chào, John!"
            
            >>> service.get_translation("nonexistent.key", "en")
            "nonexistent.key"
        """
        # Get translation data for the specified language
        language_data = self.translations.get(language)
        
        if language_data is None:
            logger.warning(
                "[TRANSLATION SERVICE] Language not found: %s. Returning key as fallback.",
                language
            )
            return key
        
        # Navigate nested keys using dot notation
        keys = key.split(".")
        current = language_data
        
        for key_part in keys:
            if not isinstance(current, dict):
                logger.warning(
                    "[TRANSLATION SERVICE] Translation key not found: %s (language: %s). Returning key as fallback.",
                    key,
                    language
                )
                return key
            
            current = current.get(key_part)
            
            if current is None:
                logger.warning(
                    "[TRANSLATION SERVICE] Translation key not found: %s (language: %s). Returning key as fallback.",
                    key,
                    language
                )
                return key
        
        # At this point, current should be the translation string
        if not isinstance(current, str):
            logger.warning(
                "[TRANSLATION SERVICE] Translation value is not a string for key: %s (language: %s, type: %s). Returning key as fallback.",
                key,
                language,
                type(current).__name__
            )
            return key
        
        # Perform parameter interpolation
        if params:
            try:
                return current.format(**params)
            except KeyError as exc:
                logger.warning(
                    "[TRANSLATION SERVICE] Missing parameter for interpolation in key: %s (language: %s, missing: %s)",
                    key,
                    language,
                    exc
                )
                return current
            except Exception as exc:
                logger.warning(
                    "[TRANSLATION SERVICE] Failed to interpolate parameters for key: %s (language: %s): %s",
                    key,
                    language,
                    exc
                )
                return current
        
        return current
    
    def get_supported_languages(self) -> list[str]:
        """
        Return list of supported language codes.
        
        Returns:
            List of language codes (e.g., ["vi", "en"])
        """
        return self.supported_languages.copy()
    
    def reload_translations(self) -> None:
        """
        Reload translations from files (admin action).
        Clears the in-memory cache and reloads all translation files.
        """
        logger.info("[TRANSLATION SERVICE] Reloading translations from disk")
        self.translations.clear()
        self.supported_languages.clear()
        self._load_translations()


# Singleton instance for application-wide use
_translation_service: TranslationService | None = None


def get_translation_service() -> TranslationService:
    """
    Get the singleton TranslationService instance.
    Creates the instance on first call.
    
    Returns:
        The TranslationService singleton instance
    """
    global _translation_service
    
    if _translation_service is None:
        _translation_service = TranslationService()
    
    return _translation_service
