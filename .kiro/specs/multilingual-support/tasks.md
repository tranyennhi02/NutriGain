# Implementation Plan: Multilingual Support (I18n)

## Overview

This implementation plan breaks down the multilingual support feature into discrete, incremental coding tasks. The feature adds internationalization (i18n) to the NutriGain application, supporting Vietnamese (vi) and English (en) languages across frontend UI, backend API responses, and database content.

**Technology Stack:**
- **Frontend**: React with i18next, react-i18next, i18next-browser-languagedetector
- **Backend**: Python with FastAPI, custom TranslationService
- **Database**: MySQL with SQLAlchemy migrations

**Key Implementation Areas:**
1. Database schema updates (migrations)
2. Backend Translation Service and API endpoints
3. Frontend i18n configuration and components
4. Translation file structure and content
5. Property-based and unit tests

## Tasks

### 1. Database Schema and Migration Setup

- [x] 1.1 Create database migration for i18n support
  - Add `preferred_language VARCHAR(10) NULL` column to `users` table
  - Create index on `users.preferred_language` for query performance
  - Add `name_en TEXT NULL` column to `foods` table
  - Ensure migration is reversible with rollback function
  - Test migration on local development database
  - _Requirements: 7.1, 7.2, 7.3, 7.6, 7.7, 7.9_

### 2. Backend Translation Service Infrastructure

- [x] 2.1 Implement TranslationService class
  - Create `app/services/translation_service.py` module
  - Implement `__init__()` to load JSON translation files from `app/translations/` directory
  - Implement `get_translation(key, language, **params)` with nested key navigation (dot notation)
  - Implement parameter interpolation using string formatting
  - Implement fallback logic: return key itself if translation not found
  - Cache translations in memory for performance
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [ ]* 2.2 Write property test for TranslationService parameter interpolation
  - **Property 5: Parameter interpolation**
  - **Validates: Requirements 5.4**
  - Use Hypothesis to generate random parameter dictionaries
  - Verify all placeholders are replaced with provided values
  - Verify no placeholders remain in output

- [ ]* 2.3 Write property test for TranslationService missing key fallback
  - **Property 6: Missing key fallback**
  - **Validates: Requirements 5.5**
  - Use Hypothesis to generate random non-existent keys
  - Verify the key itself is returned (not None, not empty)

- [ ]* 2.4 Write property test for TranslationService nested key navigation
  - **Property 7: Nested key navigation**
  - **Validates: Requirements 5.6**
  - Use Hypothesis to generate nested JSON structures and dot notation keys
  - Verify correct value is returned regardless of nesting depth

- [x] 2.5 Create backend translation JSON files
  - Create `app/translations/vi.json` with Vietnamese translations
  - Create `app/translations/en.json` with English translations
  - Include API error messages, validation errors, success messages
  - Include enum translations (meal_type, meal_role, balance_status)
  - Use nested JSON structure organized by feature/module
  - _Requirements: 5.2, 5.8, 5.9, 8.4, 12.1, 12.2, 12.3, 12.4_

### 3. Backend API Language Resolution

- [x] 3.1 Implement language resolution dependency
  - Create `get_user_language()` dependency in `app/api/dependencies.py`
  - Parse `Accept-Language` HTTP header to extract language code
  - Check authenticated user's `preferred_language` field if available
  - Implement fallback to Vietnamese ('vi') if no preference found
  - Return determined language code
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.10_

- [ ]* 3.2 Write property test for Accept-Language header parsing
  - **Property 8: Accept-Language parsing with priority**
  - **Validates: Requirements 6.2, 6.3**
  - Use Hypothesis to generate Accept-Language headers with multiple languages
  - Verify first supported language is selected
  - Verify fallback to 'vi' when no supported language found
  - Verify no failure on malformed headers

- [x] 3.3 Add Content-Language response header middleware
  - Create middleware to set `Content-Language` header on all API responses
  - Use the determined language from `get_user_language()` dependency
  - _Requirements: 6.6_

### 4. Backend User Language Preference API

- [ ] 4.1 Create language update endpoint
  - Create Pydantic schema `LanguageUpdateSchema` with validation for supported languages
  - Implement `PATCH /api/v1/users/me/language` endpoint
  - Validate language code is 'vi' or 'en'
  - Update `User.preferred_language` in database
  - Return success response with translated message
  - Return 400 error for unsupported language codes
  - _Requirements: 3.3, 3.7, 3.8, 3.9_

- [ ]* 4.2 Write property test for API language update validation
  - **Property 3: API language update validation**
  - **Validates: Requirements 3.3, 3.8, 3.9**
  - Use Hypothesis to generate various language codes (valid and invalid)
  - Verify 'vi' and 'en' are accepted and saved
  - Verify other codes return 400 error with "Unsupported language code"

- [ ]* 4.3 Write integration test for language preference persistence
  - Test PATCH endpoint updates database correctly
  - Test login returns user's preferred_language
  - Test API requests use user's preferred_language when Accept-Language not provided
  - _Requirements: 3.4, 6.4_

### 5. Backend Dynamic Content Translation (Food Items)

- [ ] 5.1 Update Food repository and schemas for multilingual support
  - Modify `FoodItemView` schema to accept language parameter
  - Implement `from_entity()` method to select name field based on language
  - Use `name_en` when language is 'en', otherwise use `name_vi`
  - Implement fallback logic: use `name_vi` if requested translation is NULL
  - Update food query endpoints to use `get_user_language()` dependency
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 5.2 Write property test for food name language selection
  - **Property 4: Food name language selection with fallback**
  - **Validates: Requirements 4.3, 4.4**
  - Use Hypothesis to generate Food entities with various name_vi/name_en combinations
  - Verify correct name field is returned based on language
  - Verify fallback to name_vi when translation missing
  - Verify non-empty result when at least one name exists

- [ ] 5.3 Translate meal plan and recommendation responses
  - Update meal plan generation to use translated food names
  - Translate meal_type labels (breakfast, lunch, dinner, snack)
  - Translate balance_status labels
  - Translate serving_display text based on language
  - Use TranslationService for all enum and label translations
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.8, 11.9_

### 6. Frontend i18n Configuration

- [x] 6.1 Install i18n dependencies
  - Install `i18next`, `react-i18next`, `i18next-browser-languagedetector` packages
  - Install `fast-check` for property-based testing (if not already installed)
  - Update `package.json` with exact versions

- [x] 6.2 Create i18n configuration file
  - Create `src/i18n/config.js` with i18next initialization
  - Configure supported languages: 'vi' (default) and 'en'
  - Set fallback language to 'vi'
  - Configure localStorage detection with key 'nutrigain_language'
  - Configure language detection order: localStorage > navigator > htmlTag
  - Disable React Suspense for immediate rendering
  - Export configured i18n instance
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 6.3 Create frontend translation JSON files
  - Create `src/i18n/locales/vi.json` with Vietnamese translations
  - Create `src/i18n/locales/en.json` with English translations
  - Organize translations by feature/module (common, auth, dashboard, settings, admin)
  - Include all UI labels, buttons, navigation menus, page titles
  - Include form labels, placeholders, tooltips, help text
  - Include error messages, validation messages, success messages, notifications
  - _Requirements: 1.7, 1.8, 1.9, 8.1, 8.2, 8.3_

- [x] 6.4 Initialize i18n in application entry point
  - Import and initialize i18n configuration in `src/main.jsx`
  - Wrap application with I18nextProvider if needed
  - Ensure i18n is initialized before React renders

### 7. Frontend Language Switcher Component

- [x] 7.1 Create LanguageSwitcher component
  - Create `src/components/LanguageSwitcher.jsx` component
  - Accept `variant` prop: 'full' (card-style) or 'compact' (dropdown)
  - Display all supported languages with native names (Tiếng Việt, English)
  - Display flag icons or language codes for each language
  - Highlight currently selected language
  - Implement onClick handler to change language using i18next.changeLanguage()
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.9_

- [ ] 7.2 Implement language change synchronization
  - Update localStorage with new language preference on change
  - Call backend API `PATCH /api/v1/users/me/language` for authenticated users
  - Handle API errors gracefully (show toast notification, retry in background)
  - Ensure UI updates immediately without page reload
  - _Requirements: 2.5, 2.6, 2.7_

- [ ]* 7.3 Write property test for localStorage persistence round-trip
  - **Property 2: Language preference localStorage round-trip**
  - **Validates: Requirements 1.5, 1.6, 2.6**
  - Use fast-check to generate 'vi' and 'en' language codes
  - Verify language is saved to localStorage on change
  - Verify language is restored from localStorage on reload

- [ ]* 7.4 Write property test for unsupported language fallback
  - **Property 1: Unsupported language fallback**
  - **Validates: Requirements 1.4, 1.10**
  - Use fast-check to generate unsupported language codes
  - Verify fallback to 'vi' when unsupported language is set
  - Verify translation still works (non-empty strings returned)

- [ ]* 7.5 Write unit tests for LanguageSwitcher component
  - Test component renders all supported languages
  - Test current language is highlighted
  - Test onClick handler calls i18next.changeLanguage()
  - Test both 'full' and 'compact' variants render correctly

### 8. Frontend User Authentication Integration

- [ ] 8.1 Update login flow to apply user's preferred language
  - Modify login success handler to extract `preferred_language` from user data
  - Apply user's `preferred_language` using i18next.changeLanguage()
  - Update localStorage with user's preference
  - Handle NULL preferred_language (skip language change)
  - _Requirements: 3.4, 3.6_

- [ ]* 8.2 Write integration test for cross-device language synchronization
  - **Property 13: Cross-device language synchronization**
  - **Validates: Requirements 3.6**
  - Clear localStorage before test
  - Mock login with user having preferred_language='en'
  - Verify i18n language is set to 'en' after login
  - Verify localStorage is updated to 'en'

### 9. Frontend API Request Language Headers

- [x] 9.1 Add Accept-Language header to API requests
  - Create Axios interceptor to add `Accept-Language` header to all requests
  - Get current language from i18next.language
  - Ensure header is added before each request
  - _Requirements: 4.8, 6.1_

- [ ] 9.2 Update API response handling for translated content
  - Verify API responses contain translated food names
  - Verify API error messages are in current language
  - Update frontend error handling to display translated messages

### 10. Frontend UI Component Translation

- [ ] 10.1 Translate all existing UI components
  - Update all hardcoded text in components to use `t()` function from useTranslation hook
  - Translate static labels, buttons, titles, navigation items
  - Translate form labels, placeholders, validation messages
  - Translate dashboard page components (DashboardView, meal cards)
  - Translate settings page components
  - _Requirements: 1.7, 1.8, 1.9_

- [ ] 10.2 Translate admin interface
  - Update admin dashboard labels and titles
  - Translate table column headers
  - Translate action button labels (approve, reject, delete)
  - Translate admin statistics and metrics labels
  - Translate admin form fields and confirmation dialogs
  - Add LanguageSwitcher to admin interface header
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 13.10_

### 11. Date, Time, and Number Formatting

- [x] 11.1 Create locale-specific formatting utilities
  - Create `src/utils/formatting.js` module
  - Implement `formatDate(date, locale)` using Intl.DateTimeFormat API
  - Implement `formatTime(time, locale)` with 24-hour (vi) and 12-hour (en) formats
  - Implement `formatNumber(number, locale)` with locale-appropriate separators
  - Implement `formatRelativeTime(date, locale)` for relative time strings
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.6, 9.7, 9.9_

- [ ]* 11.2 Write property test for locale-specific formatting consistency
  - **Property 9: Locale-specific formatting consistency**
  - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.6, 9.7**
  - Use fast-check to generate random dates, times, and numbers
  - Verify formatted output matches locale pattern (dd/MM/yyyy for vi, MM/dd/yyyy for en)
  - Verify time format matches locale (24-hour vs 12-hour)
  - Verify formatted values are parseable back to original

- [ ] 11.3 Apply formatting utilities across application
  - Replace all date/time/number displays with formatting utilities
  - Update meal plan displays to use locale-specific formatting
  - Update profile displays (weight, height, BMI) to use locale formatting

### 12. Translation Validation and Quality Assurance

- [ ] 12.1 Create translation validation script
  - Create `scripts/validate_translations.py` for backend validation
  - Create npm script `check:i18n` in package.json for frontend validation
  - Compare all translation keys across all language files
  - Report missing keys (keys in one language but not others)
  - Detect duplicate keys within same language file
  - Validate JSON format of all translation files
  - Generate translation coverage report
  - Output warnings but do NOT block build
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9_

- [ ]* 12.2 Write property test for translation completeness validation
  - **Property 10: Translation completeness validation**
  - **Validates: Requirements 10.3, 10.7**
  - Use Hypothesis to generate translation files with missing/duplicate keys
  - Verify validation script detects missing keys
  - Verify validation script detects duplicate keys
  - Verify script does not fail (non-blocking)

### 13. Documentation and Developer Guide

- [ ] 13.1 Create comprehensive i18n documentation
  - Create `src/i18n/README.md` with developer guide
  - Document how to add new translation keys in frontend
  - Document how to use useTranslation hook in React components
  - Document LanguageSwitcher component usage
  - Document translation file structure and naming conventions
  - Document how to add support for a new language
  - Include examples of parameter interpolation
  - Provide troubleshooting guide for common issues
  - _Requirements: 16.1, 16.2, 16.5, 16.6, 16.7, 16.8, 16.9, 16.10_

- [ ] 13.2 Create backend i18n documentation
  - Document how to use TranslationService in backend code
  - Document how to add new translation keys in backend
  - Document language resolution dependency usage
  - Include code examples for common scenarios
  - _Requirements: 16.3, 16.4_

### 14. Checkpoint - Ensure all tests pass and review with user
  - Run all property-based tests (frontend and backend)
  - Run all unit tests
  - Run all integration tests
  - Run translation validation scripts
  - Manually test language switching in browser
  - Manually test login with preferred language
  - Manually test API language resolution
  - Ask the user if questions arise or if additional features are needed

## Notes

- **Tasks marked with `*` are optional** and can be skipped for faster MVP. These are primarily test-related sub-tasks.
- **Property-based tests** validate universal correctness properties defined in the design document using Hypothesis (Python) and fast-check (JavaScript).
- **Unit tests** validate specific component behaviors and edge cases.
- **Integration tests** validate end-to-end flows across frontend and backend.
- **Translation files** should be reviewed by native speakers for accuracy and natural phrasing.
- **Database migration** should be tested on a copy of production data before deploying to production.
- **Performance**: Language switching should be instant (<100ms) due to in-memory caching.
- All tasks reference specific requirements for traceability back to the requirements document.

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1.1", "6.1"]
    },
    {
      "id": 1,
      "tasks": ["2.1", "2.5", "6.2", "6.3"]
    },
    {
      "id": 2,
      "tasks": ["2.2", "2.3", "2.4", "3.1", "6.4", "11.1"]
    },
    {
      "id": 3,
      "tasks": ["3.2", "3.3", "4.1", "7.1", "11.2"]
    },
    {
      "id": 4,
      "tasks": ["4.2", "4.3", "5.1", "7.2", "9.1"]
    },
    {
      "id": 5,
      "tasks": ["5.2", "5.3", "7.3", "7.4", "7.5", "9.2"]
    },
    {
      "id": 6,
      "tasks": ["8.1", "10.1", "11.3"]
    },
    {
      "id": 7,
      "tasks": ["8.2", "10.2", "12.1"]
    },
    {
      "id": 8,
      "tasks": ["12.2", "13.1", "13.2"]
    }
  ]
}
```
