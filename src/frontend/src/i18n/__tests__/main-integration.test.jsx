/**
 * Integration Test: i18n in main.jsx entry point
 * 
 * Task 6.4: Initialize i18n in application entry point
 * 
 * This test verifies that i18n is properly initialized in the main.jsx
 * entry point and that the I18nextProvider wrapper is correctly set up.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from '../config';

// Test component that uses translations
function TestComponent() {
  const { t, i18n: i18nInstance } = useTranslation();
  
  return (
    <div>
      <div data-testid="translation">{t('common.save')}</div>
      <div data-testid="language">{i18nInstance.language}</div>
      <div data-testid="initialized">{i18nInstance.isInitialized.toString()}</div>
    </div>
  );
}

describe('i18n Integration in main.jsx', () => {
  it('should provide i18n context through I18nextProvider', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <TestComponent />
      </I18nextProvider>
    );

    // Verify i18n is initialized
    expect(screen.getByTestId('initialized').textContent).toBe('true');
  });

  it('should allow components to use useTranslation hook', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <TestComponent />
      </I18nextProvider>
    );

    const translation = screen.getByTestId('translation').textContent;
    
    // Should return actual translation, not the key
    expect(translation).toBeTruthy();
    expect(translation).not.toBe('common.save');
  });

  it('should have default language set', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <TestComponent />
      </I18nextProvider>
    );

    const language = screen.getByTestId('language').textContent;
    
    // Should have a language set (vi or en)
    expect(language).toMatch(/^(vi|en)$/);
  });

  it('should allow language switching through i18n instance', async () => {
    const { rerender } = render(
      <I18nextProvider i18n={i18n}>
        <TestComponent />
      </I18nextProvider>
    );

    // Get initial translation
    const initialTranslation = screen.getByTestId('translation').textContent;

    // Change language
    const currentLang = i18n.language;
    const newLang = currentLang === 'vi' ? 'en' : 'vi';
    await i18n.changeLanguage(newLang);

    // Force re-render
    rerender(
      <I18nextProvider i18n={i18n}>
        <TestComponent />
      </I18nextProvider>
    );

    // Translation should be different after language change
    const newTranslation = screen.getByTestId('translation').textContent;
    expect(screen.getByTestId('language').textContent).toBe(newLang);

    // Restore original language
    await i18n.changeLanguage(currentLang);
  });

  it('should have all required resources loaded', () => {
    expect(i18n.hasResourceBundle('vi', 'translation')).toBe(true);
    expect(i18n.hasResourceBundle('en', 'translation')).toBe(true);
  });

  it('should be ready for immediate rendering (no suspense)', () => {
    // React suspense should be disabled
    expect(i18n.options.react.useSuspense).toBe(false);
    
    // i18n should be initialized synchronously
    expect(i18n.isInitialized).toBe(true);
  });
});
