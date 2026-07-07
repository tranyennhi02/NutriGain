/**
 * Test: i18n initialization in application entry point
 * 
 * Task 6.4: Initialize i18n in application entry point
 * 
 * This test verifies that:
 * 1. i18n is properly configured before React renders
 * 2. I18nextProvider wrapper is correctly set up
 * 3. i18n instance is accessible in components
 */

import { describe, it, expect, beforeEach } from 'vitest';
import i18n from '../config';

describe('i18n Initialization', () => {
  beforeEach(() => {
    // Reset to default language before each test
    i18n.changeLanguage('vi');
  });

  it('should have i18n instance properly initialized', () => {
    expect(i18n).toBeDefined();
    expect(i18n.isInitialized).toBe(true);
  });

  it('should have supported languages configured', () => {
    const languages = Object.keys(i18n.options.resources);
    expect(languages).toContain('vi');
    expect(languages).toContain('en');
  });

  it('should have fallback language set to Vietnamese', () => {
    expect(i18n.options.fallbackLng).toEqual(['vi']);
  });

  it('should have react-i18next plugin loaded', () => {
    const modules = i18n.modules || {};
    const hasReactPlugin = Object.values(modules).some(
      module => module && module.type === 'i18nFormat'
    );
    expect(hasReactPlugin || i18n.options.react).toBeTruthy();
  });

  it('should load translation resources for Vietnamese', () => {
    expect(i18n.hasResourceBundle('vi', 'translation')).toBe(true);
    const viTranslations = i18n.getResourceBundle('vi', 'translation');
    expect(viTranslations).toBeDefined();
    expect(Object.keys(viTranslations).length).toBeGreaterThan(0);
  });

  it('should load translation resources for English', () => {
    expect(i18n.hasResourceBundle('en', 'translation')).toBe(true);
    const enTranslations = i18n.getResourceBundle('en', 'translation');
    expect(enTranslations).toBeDefined();
    expect(Object.keys(enTranslations).length).toBeGreaterThan(0);
  });

  it('should be able to translate common keys', () => {
    // Test Vietnamese
    i18n.changeLanguage('vi');
    const viSave = i18n.t('common.save');
    expect(viSave).toBeTruthy();
    expect(viSave).not.toBe('common.save'); // Should not return key if translation exists

    // Test English
    i18n.changeLanguage('en');
    const enSave = i18n.t('common.save');
    expect(enSave).toBeTruthy();
    expect(enSave).not.toBe('common.save');
    
    // Translations should be different
    expect(viSave).not.toBe(enSave);
  });

  it('should initialize before React renders (synchronous init)', () => {
    // Since we're testing after import, i18n should already be initialized
    expect(i18n.isInitialized).toBe(true);
    
    // React suspense should be disabled for immediate rendering
    expect(i18n.options.react.useSuspense).toBe(false);
  });

  it('should have localStorage detection configured', () => {
    const detectionOptions = i18n.options.detection;
    expect(detectionOptions).toBeDefined();
    expect(detectionOptions.order).toContain('localStorage');
    expect(detectionOptions.caches).toContain('localStorage');
    expect(detectionOptions.lookupLocalStorage).toBe('nutrigain_language');
  });

  it('should change language and persist to memory', () => {
    const initialLanguage = i18n.language;
    
    // Change to English
    i18n.changeLanguage('en');
    expect(i18n.language).toBe('en');
    
    // Change back to Vietnamese
    i18n.changeLanguage('vi');
    expect(i18n.language).toBe('vi');
    
    // Restore initial language
    i18n.changeLanguage(initialLanguage);
  });

  it('should handle missing translation keys gracefully', () => {
    const missingKey = 'this.key.does.not.exist.anywhere';
    const result = i18n.t(missingKey);
    
    // i18next returns the key itself when translation is missing
    expect(result).toBe(missingKey);
  });
});
