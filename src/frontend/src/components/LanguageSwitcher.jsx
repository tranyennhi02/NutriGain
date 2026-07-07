import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Supported languages: Vietnamese, English, and Japanese (Requirements 2.1, 2.2, 2.3)
const LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

/**
 * LanguageSwitcher Component
 * 
 * Allows users to switch between Vietnamese, English, and Japanese languages.
 * 
 * @param {Object} props - Component props
 * @param {'full' | 'compact'} props.variant - Display variant:
 *   - 'full': Card-style buttons with full language names and flags (for settings page)
 *   - 'compact': Dropdown menu (for headers/navbars)
 * @param {string} props.className - Additional CSS classes
 * 
 * Requirements:
 * - 2.1: Display all supported languages (Vietnamese, English, Japanese)
 * - 2.2: Display native names (Tiếng Việt, English, 日本語)
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
    return (
      <div className="relative" ref={dropdownRef}>
        {/* Trigger button — pill style */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={t('language.selectLanguage')}
          aria-expanded={isOpen}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px 6px 8px',
            borderRadius: '999px',
            border: '1.5px solid rgba(16,185,129,0.25)',
            background: isOpen
              ? 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(5,150,105,0.08))'
              : 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: isOpen
              ? '0 0 0 3px rgba(16,185,129,0.15), 0 4px 16px rgba(16,185,129,0.12)'
              : '0 2px 8px rgba(15,23,42,0.08)',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          {/* Globe icon */}
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#10b981,#059669)',
            flexShrink: 0,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </span>

          {/* Flag + code */}
          <span style={{ fontSize: '15px', lineHeight: 1 }}>{currentLanguage.flag}</span>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: '#0f172a',
            lineHeight: 1,
          }}>
            {currentLanguage.code.toUpperCase()}
          </span>

          {/* Chevron */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              flexShrink: 0,
            }}
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {/* Dropdown panel */}
        {isOpen && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 10px)',
            width: '200px',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(226,232,240,0.8)',
            boxShadow: '0 20px 60px rgba(15,23,42,0.15), 0 4px 16px rgba(15,23,42,0.08)',
            padding: '6px',
            zIndex: 50,
            overflow: 'hidden',
          }}>
            {/* Header label */}
            <div style={{
              padding: '8px 12px 6px',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#94a3b8',
              textTransform: 'uppercase',
            }}>
              {t('language.selectLanguage')}
            </div>

            {LANGUAGES.map((lang) => {
              const isActive = currentLanguage.code === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isActive
                      ? 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(5,150,105,0.08))'
                      : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(241,245,249,0.8)';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>{lang.flag}</span>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? '#059669' : '#334155',
                    flex: 1,
                  }}>
                    {lang.name}
                  </span>
                  {isActive && (
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg,#10b981,#059669)',
                      flexShrink: 0,
                      boxShadow: '0 0 0 3px rgba(16,185,129,0.2)',
                    }} />
                  )}
                </button>
              );
            })}
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
          <p className="text-sm font-semibold text-slate-600">{t('language.selectSubtitle')}</p>
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

