# Requirements Document

## Introduction

Hệ thống NutriGain cần hỗ trợ đa ngôn ngữ (internationalization/i18n) để phục vụ người dùng ở nhiều quốc gia khác nhau. Tính năng này cho phép người dùng chọn ngôn ngữ hiển thị giao diện, lưu trữ preference ngôn ngữ, và dịch tất cả nội dung tĩnh cũng như nội dung động từ database. Hệ thống sẽ hỗ trợ ít nhất 2 ngôn ngữ: Tiếng Việt và Tiếng Anh.

## Glossary

- **I18n_System**: Hệ thống đa ngôn ngữ của NutriGain bao gồm frontend (React với i18next) và backend (FastAPI)
- **Language_Preference**: Ngôn ngữ hiển thị được người dùng chọn, được lưu trong database và localStorage
- **Translation_Key**: Khóa định danh duy nhất cho một đoạn văn bản cần dịch (ví dụ: "common.save", "dashboard.breakfast")
- **Static_Content**: Nội dung giao diện cố định như nhãn, nút bấm, tiêu đề, thông báo lỗi, validation messages
- **Dynamic_Content**: Nội dung từ database như tên món ăn, mô tả thực phẩm, category names
- **User_Profile**: Thông tin cá nhân người dùng trong database, bao gồm language preference
- **Backend_API**: FastAPI backend xử lý yêu cầu từ frontend và trả về dữ liệu
- **Translation_Service**: Service backend cung cấp bản dịch cho dynamic content
- **Language_Switcher**: Component giao diện cho phép người dùng thay đổi ngôn ngữ
- **Locale**: Mã ngôn ngữ theo chuẩn ISO 639-1 (vi, en)
- **Fallback_Language**: Ngôn ngữ mặc định (Tiếng Việt) được sử dụng khi không tìm thấy bản dịch

## Requirements

### Requirement 1: Frontend Language Support

**User Story:** Là người dùng, tôi muốn giao diện hiển thị bằng ngôn ngữ tôi chọn, để tôi có thể hiểu và sử dụng hệ thống dễ dàng hơn.

#### Acceptance Criteria

1. THE I18n_System SHALL support Tiếng Việt (vi) as the default language
2. THE I18n_System SHALL support Tiếng Anh (en) as an additional language
3. WHEN a user opens the application for the first time, THE I18n_System SHALL detect browser language preferences
4. WHEN the browser language is not supported, THE I18n_System SHALL default to Tiếng Việt
5. THE I18n_System SHALL store Language_Preference in browser localStorage with key "nutrigain_language"
6. WHEN Language_Preference exists in localStorage, THE I18n_System SHALL apply that language on application load
7. THE I18n_System SHALL translate all Static_Content including UI labels, buttons, navigation menus, page titles, form labels, placeholder text, tooltips, and help text
8. THE I18n_System SHALL translate all error messages and validation messages
9. THE I18n_System SHALL translate all success messages and notification messages
10. WHEN a Translation_Key is missing for the selected language, THE I18n_System SHALL display the Fallback_Language translation

### Requirement 2: Language Switcher Component

**User Story:** Là người dùng, tôi muốn có thể thay đổi ngôn ngữ hiển thị bất cứ lúc nào, để tôi có thể chuyển đổi giữa các ngôn ngữ theo nhu cầu.

#### Acceptance Criteria

1. THE I18n_System SHALL provide a Language_Switcher component accessible from the user interface
2. THE Language_Switcher SHALL display all supported languages with their native names (Tiếng Việt, English)
3. THE Language_Switcher SHALL display a flag icon or language code for each language
4. THE Language_Switcher SHALL highlight the currently selected language
5. WHEN a user clicks on a language option, THE I18n_System SHALL change the interface language immediately
6. WHEN the language is changed, THE I18n_System SHALL update localStorage with the new Language_Preference
7. WHEN the language is changed, THE I18n_System SHALL NOT require page reload
8. THE Language_Switcher SHALL be accessible from the settings page or user profile menu
9. THE Language_Switcher SHALL support both full variant (card-style) and compact variant (dropdown) for different UI contexts

### Requirement 3: Backend Language Preference Persistence

**User Story:** Là người dùng đã đăng nhập, tôi muốn preference ngôn ngữ của tôi được lưu trữ và đồng bộ trên mọi thiết bị, để tôi không phải chọn lại ngôn ngữ mỗi khi đăng nhập.

#### Acceptance Criteria

1. THE User_Profile SHALL include a "preferred_language" field storing the Locale code
2. THE User_Profile SHALL allow preferred_language to be NULL for users who have not set a preference
3. WHEN a registered user changes language, THE Backend_API SHALL update the preferred_language field in User_Profile
4. WHEN a registered user logs in, THE Backend_API SHALL return the preferred_language as part of user data
5. WHEN preferred_language is NULL, THE I18n_System SHALL use browser language detection or Fallback_Language
6. WHEN a user logs in from a new device, THE I18n_System SHALL apply the user's preferred_language from User_Profile
7. THE Backend_API SHALL provide an endpoint to update user language preference: PATCH /api/v1/users/me/language
8. THE Backend_API SHALL validate that the language code is one of the supported languages before saving
9. WHEN an invalid language code is provided, THE Backend_API SHALL return a 400 Bad Request error with message "Unsupported language code"

### Requirement 4: Dynamic Content Translation for Food Items

**User Story:** Là người dùng, tôi muốn tên món ăn và mô tả thực phẩm hiển thị bằng ngôn ngữ tôi chọn, để tôi có thể hiểu rõ nội dung dinh dưỡng.

#### Acceptance Criteria

1. THE Backend_API SHALL provide translations for food names in all supported languages
2. THE Food table SHALL include fields "name_vi" and "name_en" for storing Vietnamese and English food names
3. WHEN a user requests food data, THE Backend_API SHALL return the food name in the user's Language_Preference
4. WHEN a translation is missing for the requested language, THE Backend_API SHALL return the Fallback_Language translation
5. THE Backend_API SHALL translate category names (clean_category, food_group_vi) to the requested language
6. THE Backend_API SHALL translate meal_role labels (main, side, protein, carbs) to the requested language
7. WHEN generating meal plans, THE Backend_API SHALL provide food names and descriptions in the user's preferred language
8. THE Backend_API SHALL accept "Accept-Language" HTTP header to determine the response language for API requests
9. WHEN Accept-Language header is not provided, THE Backend_API SHALL use the user's preferred_language from User_Profile
10. THE Backend_API SHALL provide translated serving_display text (e.g., "1 chén" vs "1 bowl")

### Requirement 5: Translation Service for Backend

**User Story:** Là developer, tôi muốn có một Translation_Service tập trung để quản lý bản dịch backend, để dễ dàng mở rộng và bảo trì các bản dịch.

#### Acceptance Criteria

1. THE Backend_API SHALL implement a Translation_Service to manage all backend translations
2. THE Translation_Service SHALL load translations from JSON files organized by language code (vi.json, en.json)
3. THE Translation_Service SHALL provide a method get_translation(key, language, **params) to retrieve translated text
4. THE Translation_Service SHALL support parameter interpolation for dynamic values (e.g., "Welcome, {name}")
5. WHEN a Translation_Key is not found, THE Translation_Service SHALL return the key itself as a fallback
6. THE Translation_Service SHALL support nested translation keys using dot notation (e.g., "errors.auth.invalid_credentials")
7. THE Translation_Service SHALL be initialized on application startup and cache translations in memory
8. THE Translation_Service SHALL provide translations for API error messages, validation errors, and system notifications
9. THE Backend_API SHALL use Translation_Service for all user-facing messages in API responses
10. THE Translation_Service SHALL log warnings when a Translation_Key is missing for any supported language

### Requirement 6: API Response Language Header

**User Story:** Là frontend developer, tôi muốn API trả về dữ liệu bằng ngôn ngữ phù hợp, để giao diện hiển thị đúng nội dung mong muốn.

#### Acceptance Criteria

1. THE Backend_API SHALL inspect the "Accept-Language" HTTP header in all API requests
2. THE Backend_API SHALL parse Accept-Language header to extract the preferred language code
3. WHEN Accept-Language header contains multiple languages, THE Backend_API SHALL use the first supported language
4. WHEN Accept-Language header is not provided, THE Backend_API SHALL check User_Profile.preferred_language
5. WHEN both Accept-Language and preferred_language are unavailable, THE Backend_API SHALL use Fallback_Language
6. THE Backend_API SHALL include a "Content-Language" response header indicating the language used in the response
7. THE Backend_API SHALL apply the determined language to all Dynamic_Content in the response
8. THE Backend_API SHALL translate error messages and validation messages to the determined language
9. WHEN the requested language is not supported, THE Backend_API SHALL use Fallback_Language and log a warning
10. THE Backend_API SHALL provide consistent language handling across all endpoints

### Requirement 7: Database Migration for Language Support

**User Story:** Là system administrator, tôi muốn database được cập nhật để hỗ trợ đa ngôn ngữ, để dữ liệu được lưu trữ đầy đủ cho tất cả ngôn ngữ.

#### Acceptance Criteria

1. THE I18n_System SHALL add "preferred_language" column to User_Profile table with type VARCHAR(10)
2. THE I18n_System SHALL allow preferred_language to be NULL
3. THE I18n_System SHALL add "name_en" column to Food table with type TEXT for English food names
4. THE I18n_System SHALL populate name_en for existing food items with default or translated values
5. THE I18n_System SHALL create database migration scripts using Alembic or SQLAlchemy migrations
6. THE I18n_System SHALL ensure migrations are reversible for rollback scenarios
7. THE I18n_System SHALL add indexes on preferred_language column for query performance
8. THE I18n_System SHALL add "category_en" column to FoodCategory table with type VARCHAR(255)
9. WHEN applying migrations, THE I18n_System SHALL NOT lose any existing data
10. THE I18n_System SHALL provide migration documentation with rollback instructions

### Requirement 8: Translation File Structure and Management

**User Story:** Là developer, tôi muốn các file dịch được tổ chức rõ ràng và dễ bảo trì, để dễ dàng thêm mới và cập nhật bản dịch.

#### Acceptance Criteria

1. THE I18n_System SHALL organize frontend translation files in src/i18n/locales/ directory
2. THE I18n_System SHALL name translation files by language code: vi.json, en.json
3. THE I18n_System SHALL structure translations using nested JSON objects by feature/module
4. THE I18n_System SHALL organize backend translation files in app/translations/ directory
5. THE I18n_System SHALL use consistent Translation_Key naming across frontend and backend
6. THE I18n_System SHALL document translation file structure in a README.md file
7. THE I18n_System SHALL validate translation files for missing keys during build or startup
8. THE I18n_System SHALL provide a translation key reference document listing all keys and their purposes
9. WHEN a new Translation_Key is added to one language file, THE I18n_System SHALL require the same key in all language files
10. THE I18n_System SHALL support comments in translation files for translator context

### Requirement 9: Date, Time, and Number Formatting

**User Story:** Là người dùng, tôi muốn ngày tháng, giờ, và số được hiển thị theo định dạng của ngôn ngữ tôi chọn, để dễ đọc và hiểu.

#### Acceptance Criteria

1. THE I18n_System SHALL format dates according to the selected language locale (dd/MM/yyyy for vi, MM/dd/yyyy for en)
2. THE I18n_System SHALL format time according to the selected language locale (24-hour for vi, 12-hour for en)
3. THE I18n_System SHALL format numbers with appropriate thousand separators (comma for en, period for vi if needed)
4. THE I18n_System SHALL format decimal numbers with appropriate decimal separators (period for en, comma for vi if needed)
5. THE I18n_System SHALL use locale-appropriate currency formatting if displaying prices
6. THE I18n_System SHALL format relative time (e.g., "2 giờ trước" vs "2 hours ago") according to language
7. THE I18n_System SHALL format meal times (breakfast_time, lunch_time, dinner_time) according to locale
8. THE I18n_System SHALL use language-appropriate units (kg, cm) consistently across languages
9. WHEN displaying nutritional values, THE I18n_System SHALL use consistent decimal places across languages
10. THE I18n_System SHALL provide helper functions for date, time, and number formatting in both frontend and backend

### Requirement 10: Translation Completeness Validation

**User Story:** Là developer, tôi muốn hệ thống kiểm tra tính đầy đủ của bản dịch, để đảm bảo không có Translation_Key nào bị thiếu.

#### Acceptance Criteria

1. THE I18n_System SHALL provide a validation script to check translation file completeness
2. THE I18n_System SHALL compare all Translation_Keys across all language files
3. WHEN a Translation_Key exists in one language but missing in another, THE I18n_System SHALL report the missing key
4. THE I18n_System SHALL run translation validation as part of the build process
5. WHEN translation validation fails, THE I18n_System SHALL display a warning but NOT block the build
6. THE I18n_System SHALL generate a translation coverage report showing percentage of translated keys per language
7. THE I18n_System SHALL detect duplicate Translation_Keys within the same language file
8. THE I18n_System SHALL validate that translation files are valid JSON format
9. THE I18n_System SHALL provide a command-line tool to check translation completeness: npm run check:i18n
10. THE I18n_System SHALL log all missing or invalid translations to a report file for review

### Requirement 11: Meal Plan and Recommendation Translations

**User Story:** Là người dùng, tôi muốn meal plans và recommendations hiển thị bằng ngôn ngữ tôi chọn, để tôi có thể hiểu và theo dõi kế hoạch dinh dưỡng của mình.

#### Acceptance Criteria

1. THE Backend_API SHALL translate meal type names (breakfast, lunch, dinner, snack) to the user's language
2. THE Backend_API SHALL translate meal_name_vi field based on the requested language
3. THE Backend_API SHALL translate reason field in FoodItemView to the user's language
4. THE Backend_API SHALL translate balance_status labels (balanced, high_protein, etc.) to the user's language
5. THE Backend_API SHALL translate validation messages in meal plan responses to the user's language
6. THE Backend_API SHALL translate recommendation explanations to the user's language
7. THE Backend_API SHALL translate profile snapshot field labels (weight, height, BMI) to the user's language
8. WHEN generating meal plans, THE Backend_API SHALL use translated food names from Dynamic_Content
9. THE Backend_API SHALL translate serving_display text for each meal plan item to the user's language
10. THE Backend_API SHALL translate meal reminder emails and SMS messages to the user's preferred language

### Requirement 12: Error Message and Validation Translation

**User Story:** Là người dùng, tôi muốn thông báo lỗi và validation messages hiển thị bằng ngôn ngữ tôi hiểu, để tôi biết cách khắc phục vấn đề.

#### Acceptance Criteria

1. THE Backend_API SHALL translate all HTTP error messages (400, 401, 403, 404, 500) to the requested language
2. THE Backend_API SHALL translate Pydantic validation errors to the requested language
3. THE Backend_API SHALL translate custom business logic errors to the requested language
4. THE Backend_API SHALL translate authentication errors (invalid credentials, token expired) to the requested language
5. THE Backend_API SHALL translate authorization errors (insufficient permissions) to the requested language
6. THE Backend_API SHALL translate database constraint violation errors to user-friendly messages in the requested language
7. WHEN validation fails for form fields, THE Backend_API SHALL return field-specific error messages in the requested language
8. THE Backend_API SHALL translate error messages for phone number validation to the requested language
9. THE Backend_API SHALL translate error messages for weight and height validation to the requested language
10. THE I18n_System SHALL maintain consistent error message tone and style across all languages

### Requirement 13: Admin Interface Language Support

**User Story:** Là admin, tôi muốn giao diện quản trị hỗ trợ đa ngôn ngữ, để tôi có thể làm việc bằng ngôn ngữ tôi thành thạo nhất.

#### Acceptance Criteria

1. THE I18n_System SHALL translate all admin dashboard labels and titles to the selected language
2. THE I18n_System SHALL translate admin table column headers to the selected language
3. THE I18n_System SHALL translate admin action button labels (approve, reject, delete) to the selected language
4. THE I18n_System SHALL translate admin statistics and metrics labels to the selected language
5. THE I18n_System SHALL translate admin form field labels and placeholders to the selected language
6. THE I18n_System SHALL translate admin confirmation dialogs and warnings to the selected language
7. THE I18n_System SHALL translate admin food management interface to the selected language
8. THE I18n_System SHALL translate admin user management interface to the selected language
9. THE I18n_System SHALL translate admin feedback management interface to the selected language
10. THE I18n_System SHALL provide language switcher in admin interface accessible from the header or settings

### Requirement 14: Performance and Caching for Translations

**User Story:** Là user, tôi muốn giao diện tải nhanh và mượt mà khi chuyển đổi ngôn ngữ, để trải nghiệm sử dụng không bị gián đoạn.

#### Acceptance Criteria

1. THE I18n_System SHALL load translation files asynchronously on application initialization
2. THE I18n_System SHALL cache loaded translations in memory to avoid repeated file reads
3. THE I18n_System SHALL preload both Vietnamese and English translations on application startup
4. WHEN switching languages, THE I18n_System SHALL apply new translations within 100 milliseconds
5. THE I18n_System SHALL minimize translation file size by removing unnecessary whitespace
6. THE I18n_System SHALL bundle translation files with the application build for production
7. THE Backend_API SHALL cache Translation_Service translations in memory during application runtime
8. THE Backend_API SHALL reload translations from files only when explicitly triggered by admin action
9. THE I18n_System SHALL use lazy loading for large translation sections when appropriate
10. THE I18n_System SHALL measure and log translation loading performance metrics in development mode

### Requirement 15: Testing and Quality Assurance for I18n

**User Story:** Là QA engineer, tôi muốn có test coverage đầy đủ cho chức năng đa ngôn ngữ, để đảm bảo tính năng hoạt động đúng và ổn định.

#### Acceptance Criteria

1. THE I18n_System SHALL include unit tests for Translation_Service methods
2. THE I18n_System SHALL include integration tests for API endpoints with different Accept-Language headers
3. THE I18n_System SHALL include frontend tests for Language_Switcher component behavior
4. THE I18n_System SHALL include tests verifying localStorage persistence of Language_Preference
5. THE I18n_System SHALL include tests for fallback behavior when translations are missing
6. THE I18n_System SHALL include tests for parameter interpolation in translated strings
7. THE I18n_System SHALL include tests for date, time, and number formatting in different locales
8. THE I18n_System SHALL include visual regression tests to detect UI layout issues with different languages
9. THE I18n_System SHALL include tests for database migration scripts
10. THE I18n_System SHALL achieve at least 80% code coverage for all i18n-related code

### Requirement 16: Documentation and Developer Guide

**User Story:** Là developer mới, tôi muốn có tài liệu hướng dẫn rõ ràng về cách sử dụng hệ thống i18n, để tôi có thể dễ dàng thêm bản dịch mới và mở rộng hệ thống.

#### Acceptance Criteria

1. THE I18n_System SHALL provide a comprehensive i18n developer guide in README.md
2. THE I18n_System SHALL document how to add new translation keys in frontend
3. THE I18n_System SHALL document how to add new translation keys in backend
4. THE I18n_System SHALL document how to use the Translation_Service in backend code
5. THE I18n_System SHALL document how to use the useTranslation hook in React components
6. THE I18n_System SHALL provide examples of parameter interpolation in translations
7. THE I18n_System SHALL document the translation file structure and naming conventions
8. THE I18n_System SHALL document how to add support for a new language
9. THE I18n_System SHALL document how to test translations locally
10. THE I18n_System SHALL provide a troubleshooting guide for common i18n issues
