import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Supported languages: Vietnamese and English only (Requirements 2.1, 2.2, 2.3)
const LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
];

/**
 * LanguageSwitcher Component
 * 
 * Allows users to switch between Vietnamese and English languages.
 * 
 * @param {Object} props - Component props
 * @param {'full' | 'compact'} props.variant - Display variant:
 *   - 'full': Card-style buttons with full language names and flags (for settings page)
 *   - 'compact': Dropdown menu (for headers/navbars)
 * @param {string} props.className - Additional CSS classes
 * 
 * Requirements:
 * - 2.1: Display all supported languages (Vietnamese, English)
 * - 2.2: Display native names (Tiếng Việt, English)
 * - 2.3: Display flag icons for each language
 * - 2.4: Highlight currently selected language
 * - 2.5: Change language immediately on click (no page reload)
 * - 2.6: Update localStorage with new preference
 * - 2.9: Support both full and compact variants
 */
export default function LanguageSwitcher({ variant = 'full', className = '' }) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('nutrigain_language', langCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'compact') {
    // Compact variant for header/navbar
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
        >
          <span className="text-xl">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 transition ${
                  currentLanguage.code === lang.code ? 'text-emerald-600 bg-emerald-50' : 'text-slate-700'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
                {currentLanguage.code === lang.code && (
                  <svg className="ml-auto h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default variant with full styling
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900">{t('language.selectLanguage')}</h3>
          <p className="text-sm font-semibold text-slate-600">Select your preferred language</p>
        </div>
      </div>

      <div className="space-y-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 font-semibold transition ${
              currentLanguage.code === lang.code
                ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="text-3xl">{lang.flag}</span>
            <span className="text-base flex-1 text-left">{lang.name}</span>
            {currentLanguage.code === lang.code && (
              <svg className="h-6 w-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
