import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import viTranslations from './locales/vi.json';
import enTranslations from './locales/en.json';

// Language resources
const resources = {
  vi: {
    translation: viTranslations
  },
  en: {
    translation: enTranslations
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'vi', // Default language
    lng: localStorage.getItem('nutrigain_language') || 'vi', // Get saved language or default
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache user language selection
      caches: ['localStorage'],
      lookupLocalStorage: 'nutrigain_language',
    },
    
    react: {
      useSuspense: false // Disable suspense for simpler setup
    }
  });

export default i18n;
