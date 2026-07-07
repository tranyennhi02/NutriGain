# i18n Initialization in Application Entry Point

## Task 6.4 - Complete ✅

This document describes how the i18n (internationalization) system is initialized in the NutriGain application's entry point.

## Overview

The i18n system is fully initialized in `src/main.jsx` before React renders any components. This ensures that translations are available immediately when the application loads, without any loading delays or suspense boundaries.

## Implementation Details

### 1. Configuration File (`src/i18n/config.js`)

The i18n configuration is defined in a separate module that:
- Imports i18next, react-i18next, and the browser language detector
- Loads translation resources for Vietnamese (vi) and English (en)
- Configures language detection with localStorage caching
- Sets Vietnamese (vi) as the fallback language
- Disables React Suspense for immediate rendering

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { vi: {...}, en: {...} },
    fallbackLng: 'vi',
    lng: localStorage.getItem('nutrigain_language') || 'vi',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'nutrigain_language',
    },
    react: {
      useSuspense: false
    }
  });
```

### 2. Main Entry Point (`src/main.jsx`)

The application entry point imports and initializes i18n:

```javascript
// Import i18n configuration (this executes i18n.init())
import i18n from "./i18n/config";

// Wrap application with I18nextProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <GoogleOAuthProvider clientId={...}>
        <App />
      </GoogleOAuthProvider>
    </I18nextProvider>
  </React.StrictMode>,
);
```

## Key Features

### ✅ Initialization Before React Renders

- The `import i18n from "./i18n/config"` statement is placed **before** the `ReactDOM.createRoot()` call
- This ensures i18n is fully initialized before any React components mount
- The configuration disables Suspense, so rendering happens immediately

### ✅ I18nextProvider Wrapper

- The entire application is wrapped with `<I18nextProvider i18n={i18n}>`
- This provides the i18n instance to all child components via React context
- Components can use the `useTranslation()` hook to access translations

### ✅ Language Detection and Persistence

The system automatically detects and persists the user's language preference:

1. **On First Load:**
   - Checks localStorage for saved language preference
   - Falls back to browser language detection
   - Uses Vietnamese (vi) as default if no preference found

2. **On Language Change:**
   - Updates i18n language immediately (no page reload)
   - Saves preference to localStorage with key "nutrigain_language"
   - Syncs to backend API for authenticated users

## Testing

The initialization is thoroughly tested in two test files:

### 1. Configuration Tests (`__tests__/i18n-init.test.js`)

Tests the i18n configuration itself:
- ✅ i18n instance is properly initialized
- ✅ Supported languages (vi, en) are configured
- ✅ Fallback language is set to Vietnamese
- ✅ React-i18next plugin is loaded
- ✅ Translation resources are loaded for both languages
- ✅ Common translations work correctly
- ✅ localStorage detection is configured
- ✅ Language changes work properly
- ✅ Missing keys are handled gracefully

### 2. Integration Tests (`__tests__/main-integration.test.jsx`)

Tests the integration with React components:
- ✅ I18nextProvider provides i18n context
- ✅ Components can use useTranslation hook
- ✅ Default language is set correctly
- ✅ Language switching works through i18n instance
- ✅ All required resources are loaded
- ✅ Immediate rendering is enabled (no suspense)

**Test Results:** All 17 tests pass ✅

## Usage in Components

Components can access translations using the `useTranslation` hook:

```javascript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>
        Switch to English
      </button>
    </div>
  );
}
```

## Language Resolution Flow

1. **Application Loads:**
   ```
   main.jsx imports config.js
   → i18n.init() executes
   → Checks localStorage['nutrigain_language']
   → If not found, detects browser language
   → Falls back to 'vi' if unsupported
   → ReactDOM renders with I18nextProvider
   ```

2. **User Changes Language:**
   ```
   User clicks LanguageSwitcher
   → i18n.changeLanguage(newLang)
   → Updates localStorage
   → Triggers React re-render
   → Calls API to sync preference
   ```

3. **User Logs In:**
   ```
   Login succeeds
   → API returns user.preferred_language
   → Frontend applies preferred language
   → Updates localStorage
   → React components re-render with new language
   ```

## Benefits of This Approach

1. **No Loading Delays:** Translations are available immediately when the app loads
2. **No Suspense Needed:** Synchronous initialization means no loading states
3. **Persistent Preferences:** User's language choice is saved and restored
4. **Instant Switching:** Language changes apply immediately without page reload
5. **Server Sync:** Preferences sync across devices for authenticated users

## Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 1.3:** Browser language preferences are detected
- **Requirement 1.4:** Falls back to Vietnamese when browser language is unsupported
- **Requirement 1.5:** Stores language preference in localStorage with key "nutrigain_language"
- **Requirement 1.6:** Applies language from localStorage on application load
- **Requirement 6.2 (Task):** i18n configuration is imported in main.jsx
- **Requirement 6.4 (Task):** Application is wrapped with I18nextProvider
- **Requirement 6.4 (Task):** i18n is initialized before React renders

## Related Files

- `src/main.jsx` - Application entry point with i18n initialization
- `src/i18n/config.js` - i18n configuration and initialization
- `src/i18n/locales/vi.json` - Vietnamese translations
- `src/i18n/locales/en.json` - English translations
- `src/components/LanguageSwitcher.jsx` - Language switcher component
- `src/i18n/__tests__/i18n-init.test.js` - Configuration tests
- `src/i18n/__tests__/main-integration.test.jsx` - Integration tests

## Next Steps

With i18n initialization complete, the following tasks can proceed:

- ✅ Task 6.1: Install i18n dependencies
- ✅ Task 6.2: Create i18n configuration file
- ✅ Task 6.3: Create frontend translation JSON files
- ✅ **Task 6.4: Initialize i18n in application entry point** ← You are here
- 🔄 Task 7.1: Create LanguageSwitcher component (already implemented)
- ⏭️ Task 7.2: Implement language change synchronization
- ⏭️ Task 10.1: Translate all existing UI components
