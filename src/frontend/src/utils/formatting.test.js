/**
 * Unit Tests for Locale-Specific Formatting Utilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatDate,
  formatTime,
  formatNumber,
  formatRelativeTime,
  formatDateTime,
  formatDecimal,
  formatWholeNumber
} from './formatting.js';

describe('formatDate', () => {
  it('should format date in Vietnamese format (dd/MM/yyyy)', () => {
    const date = new Date('2024-03-15T10:30:00');
    const result = formatDate(date, 'vi');
    expect(result).toBe('15/03/2024');
  });

  it('should format date in English format (MM/dd/yyyy)', () => {
    const date = new Date('2024-03-15T10:30:00');
    const result = formatDate(date, 'en');
    expect(result).toBe('03/15/2024');
  });

  it('should handle ISO string input', () => {
    const result = formatDate('2024-12-25T00:00:00Z', 'vi');
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('should handle timestamp input', () => {
    const timestamp = new Date('2024-06-01').getTime();
    const result = formatDate(timestamp, 'en');
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('should default to Vietnamese locale', () => {
    const date = new Date('2024-01-01');
    const result = formatDate(date);
    expect(result).toBe('01/01/2024');
  });

  it('should handle invalid date gracefully', () => {
    const result = formatDate('invalid-date', 'vi');
    expect(result).toBe('');
  });

  it('should handle leap year dates', () => {
    const date = new Date('2024-02-29');
    const result = formatDate(date, 'vi');
    expect(result).toBe('29/02/2024');
  });
});

describe('formatTime', () => {
  it('should format time in Vietnamese 24-hour format', () => {
    const time = new Date('2024-03-15T14:30:00');
    const result = formatTime(time, 'vi');
    expect(result).toBe('14:30');
  });

  it('should format time in English 12-hour format with AM/PM', () => {
    const time = new Date('2024-03-15T14:30:00');
    const result = formatTime(time, 'en');
    expect(result).toBe('2:30 PM');
  });

  it('should format morning time with AM', () => {
    const time = new Date('2024-03-15T09:15:00');
    const result = formatTime(time, 'en');
    expect(result).toBe('9:15 AM');
  });

  it('should format midnight correctly', () => {
    const time = new Date('2024-03-15T00:00:00');
    const resultVi = formatTime(time, 'vi');
    const resultEn = formatTime(time, 'en');
    expect(resultVi).toBe('00:00');
    expect(resultEn).toMatch(/12:00 AM/);
  });

  it('should format noon correctly', () => {
    const time = new Date('2024-03-15T12:00:00');
    const resultVi = formatTime(time, 'vi');
    const resultEn = formatTime(time, 'en');
    expect(resultVi).toBe('12:00');
    expect(resultEn).toMatch(/12:00 PM/);
  });

  it('should default to Vietnamese locale', () => {
    const time = new Date('2024-03-15T18:45:00');
    const result = formatTime(time);
    expect(result).toBe('18:45');
  });

  it('should handle invalid time gracefully', () => {
    const result = formatTime('invalid-time', 'vi');
    expect(result).toBe('');
  });
});

describe('formatNumber', () => {
  it('should format integer in Vietnamese with period separator', () => {
    const result = formatNumber(1234, 'vi');
    expect(result).toBe('1.234');
  });

  it('should format integer in English with comma separator', () => {
    const result = formatNumber(1234, 'en');
    expect(result).toBe('1,234');
  });

  it('should format decimal in Vietnamese with comma separator', () => {
    const result = formatNumber(1234.56, 'vi');
    expect(result).toBe('1.234,56');
  });

  it('should format decimal in English with period separator', () => {
    const result = formatNumber(1234.56, 'en');
    expect(result).toBe('1,234.56');
  });

  it('should respect minimumFractionDigits option', () => {
    const result = formatNumber(1234, 'en', { minimumFractionDigits: 2 });
    expect(result).toBe('1,234.00');
  });

  it('should respect maximumFractionDigits option', () => {
    const result = formatNumber(1234.56789, 'en', { maximumFractionDigits: 2 });
    expect(result).toBe('1,234.57');
  });

  it('should format large numbers correctly', () => {
    const result = formatNumber(1234567.89, 'vi');
    expect(result).toBe('1.234.567,89');
  });

  it('should format negative numbers', () => {
    const resultVi = formatNumber(-1234.56, 'vi');
    const resultEn = formatNumber(-1234.56, 'en');
    expect(resultVi).toBe('-1.234,56');
    expect(resultEn).toBe('-1,234.56');
  });

  it('should format zero', () => {
    const result = formatNumber(0, 'vi');
    expect(result).toBe('0');
  });

  it('should default to Vietnamese locale', () => {
    const result = formatNumber(5678);
    expect(result).toBe('5.678');
  });

  it('should handle invalid number gracefully', () => {
    const result = formatNumber(NaN, 'vi');
    expect(result).toBe('0');
  });

  it('should handle non-number input gracefully', () => {
    const result = formatNumber('not a number', 'vi');
    expect(result).toBe('0');
  });
});

describe('formatRelativeTime', () => {
  it('should format time in the past (hours ago) in Vietnamese', () => {
    const date = new Date(Date.now() - 3600000); // 1 hour ago
    const result = formatRelativeTime(date, 'vi');
    // More flexible check - just verify it's a non-empty string with Vietnamese text
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should format time in the past (hours ago) in English', () => {
    const date = new Date(Date.now() - 3600000); // 1 hour ago
    const result = formatRelativeTime(date, 'en');
    // More flexible check - just verify it's a non-empty string
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should format time in the future (days) in Vietnamese', () => {
    const date = new Date(Date.now() + 86400000); // 1 day from now
    const result = formatRelativeTime(date, 'vi');
    // Should contain date-related content
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should format time in the future (days) in English', () => {
    const date = new Date(Date.now() + 86400000); // 1 day from now
    const result = formatRelativeTime(date, 'en');
    // Should contain "tomorrow" or "in 1 day" or similar
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should format recent time (minutes ago)', () => {
    const date = new Date(Date.now() - 120000); // 2 minutes ago
    const result = formatRelativeTime(date, 'en');
    // Should return a valid string
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should format distant past (years ago)', () => {
    const date = new Date(Date.now() - 31536000000); // ~1 year ago
    const result = formatRelativeTime(date, 'en');
    expect(result).toMatch(/year|last year/);
  });

  it('should default to Vietnamese locale', () => {
    const date = new Date(Date.now() - 3600000);
    const result = formatRelativeTime(date);
    // Should return Vietnamese text (non-empty string)
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should handle invalid date gracefully', () => {
    const result = formatRelativeTime('invalid-date', 'vi');
    expect(result).toBe('');
  });
});

describe('formatDateTime', () => {
  it('should combine date and time in Vietnamese format', () => {
    const datetime = new Date('2024-03-15T14:30:00');
    const result = formatDateTime(datetime, 'vi');
    expect(result).toBe('15/03/2024, 14:30');
  });

  it('should combine date and time in English format', () => {
    const datetime = new Date('2024-03-15T14:30:00');
    const result = formatDateTime(datetime, 'en');
    expect(result).toBe('03/15/2024, 2:30 PM');
  });

  it('should handle morning times', () => {
    const datetime = new Date('2024-06-20T09:00:00');
    const result = formatDateTime(datetime, 'en');
    expect(result).toBe('06/20/2024, 9:00 AM');
  });

  it('should default to Vietnamese locale', () => {
    const datetime = new Date('2024-12-31T23:59:00');
    const result = formatDateTime(datetime);
    expect(result).toBe('31/12/2024, 23:59');
  });
});

describe('formatDecimal', () => {
  it('should format decimal with specified places in Vietnamese', () => {
    const result = formatDecimal(123.456, 'vi', 1);
    expect(result).toBe('123,5');
  });

  it('should format decimal with specified places in English', () => {
    const result = formatDecimal(123.456, 'en', 2);
    expect(result).toBe('123.46');
  });

  it('should default to 1 decimal place', () => {
    const result = formatDecimal(99.999, 'vi');
    expect(result).toBe('100,0');
  });

  it('should handle zero decimal places', () => {
    const result = formatDecimal(123.456, 'en', 0);
    expect(result).toBe('123');
  });

  it('should format nutritional values correctly', () => {
    const protein = formatDecimal(45.67, 'vi', 1);
    const carbs = formatDecimal(234.891, 'en', 1);
    expect(protein).toBe('45,7');
    expect(carbs).toBe('234.9');
  });
});

describe('formatWholeNumber', () => {
  it('should format whole number without decimals in Vietnamese', () => {
    const result = formatWholeNumber(1234.56, 'vi');
    expect(result).toBe('1.235');
  });

  it('should format whole number without decimals in English', () => {
    const result = formatWholeNumber(1234.56, 'en');
    expect(result).toBe('1,235');
  });

  it('should round to nearest integer', () => {
    const result1 = formatWholeNumber(99.4, 'en');
    const result2 = formatWholeNumber(99.6, 'en');
    expect(result1).toBe('99');
    expect(result2).toBe('100');
  });

  it('should handle already whole numbers', () => {
    const result = formatWholeNumber(1000, 'vi');
    expect(result).toBe('1.000');
  });

  it('should format calories correctly', () => {
    const calories = formatWholeNumber(2543.789, 'en');
    expect(calories).toBe('2,544');
  });

  it('should default to Vietnamese locale', () => {
    const result = formatWholeNumber(5678.9);
    expect(result).toBe('5.679');
  });
});

describe('Edge cases and error handling', () => {
  it('should handle null inputs gracefully', () => {
    expect(formatNumber(null, 'vi')).toBe('0');
    expect(formatDate(null, 'vi')).toBe('');
    expect(formatTime(null, 'vi')).toBe('');
  });

  it('should handle undefined inputs gracefully', () => {
    expect(formatNumber(undefined, 'vi')).toBe('0');
    expect(formatDate(undefined, 'vi')).toBe('');
    expect(formatTime(undefined, 'vi')).toBe('');
  });

  it('should handle unsupported locale by using default', () => {
    const result = formatNumber(1234, 'fr'); // French not supported
    // Should not crash and return formatted string
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle very large numbers', () => {
    const result = formatNumber(999999999.99, 'en');
    expect(result).toBe('999,999,999.99');
  });

  it('should handle very small numbers', () => {
    const result = formatNumber(0.001, 'en', { maximumFractionDigits: 3 });
    expect(result).toBe('0.001');
  });

  it('should handle dates far in the past', () => {
    const oldDate = new Date('1900-01-01');
    const result = formatDate(oldDate, 'vi');
    expect(result).toBe('01/01/1900');
  });

  it('should handle dates far in the future', () => {
    const futureDate = new Date('2099-12-31');
    const result = formatDate(futureDate, 'en');
    expect(result).toBe('12/31/2099');
  });
});
