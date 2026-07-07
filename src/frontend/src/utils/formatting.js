/**
 * Locale-Specific Formatting Utilities
 * 
 * Provides formatting functions for dates, times, numbers, and relative time
 * using the browser's native Intl API for consistency across locales.
 * 
 * Supported locales:
 * - 'vi': Vietnamese (default) - dd/MM/yyyy, 24-hour time
 * - 'en': English - MM/dd/yyyy, 12-hour time (AM/PM)
 */

/**
 * Format a date according to locale conventions
 * 
 * @param {Date|string|number} date - Date to format (Date object, ISO string, or timestamp)
 * @param {string} locale - Locale code ('vi' or 'en')
 * @returns {string} Formatted date string
 * 
 * @example
 * formatDate(new Date('2024-03-15'), 'vi') // "15/03/2024"
 * formatDate(new Date('2024-03-15'), 'en') // "03/15/2024"
 */
export function formatDate(date, locale = 'vi') {
  // Handle null/undefined explicitly
  if (date === null || date === undefined) {
    console.warn('Null or undefined date provided to formatDate');
    return '';
  }
  
  // Ensure we have a valid Date object
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Validate date
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to formatDate:', date);
    return '';
  }
  
  // Validate and normalize locale
  const normalizedLocale = locale === 'en' ? 'en-US' : 'vi-VN';
  
  try {
    // Use Intl.DateTimeFormat for locale-specific formatting
    const formatter = new Intl.DateTimeFormat(normalizedLocale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    return formatter.format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    // Fallback to ISO format
    return dateObj.toISOString().split('T')[0];
  }
}

/**
 * Format a time according to locale conventions
 * Vietnamese uses 24-hour format, English uses 12-hour format with AM/PM
 * 
 * @param {Date|string|number} time - Time to format (Date object, ISO string, or timestamp)
 * @param {string} locale - Locale code ('vi' or 'en')
 * @returns {string} Formatted time string
 * 
 * @example
 * formatTime(new Date('2024-03-15T14:30:00'), 'vi') // "14:30"
 * formatTime(new Date('2024-03-15T14:30:00'), 'en') // "2:30 PM"
 */
export function formatTime(time, locale = 'vi') {
  // Handle null/undefined explicitly
  if (time === null || time === undefined) {
    console.warn('Null or undefined time provided to formatTime');
    return '';
  }
  
  // Ensure we have a valid Date object
  const timeObj = time instanceof Date ? time : new Date(time);
  
  // Validate time
  if (isNaN(timeObj.getTime())) {
    console.warn('Invalid time provided to formatTime:', time);
    return '';
  }
  
  // Validate and normalize locale
  const normalizedLocale = locale === 'en' ? 'en-US' : 'vi-VN';
  
  try {
    // For Vietnamese, use 2-digit to ensure proper formatting (00:00 instead of 0:00)
    // For English, use numeric to avoid leading zeros (2:30 PM instead of 02:30 PM)
    const options = {
      hour: locale === 'vi' ? '2-digit' : 'numeric',
      minute: '2-digit',
      hour12: locale === 'en' // 12-hour for English, 24-hour for Vietnamese
    };
    
    const formatter = new Intl.DateTimeFormat(normalizedLocale, options);
    return formatter.format(timeObj);
  } catch (error) {
    console.error('Error formatting time:', error);
    // Fallback to HH:MM format
    const hours = timeObj.getHours().toString().padStart(2, '0');
    const minutes = timeObj.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

/**
 * Format a number with locale-appropriate separators
 * 
 * @param {number} number - Number to format
 * @param {string} locale - Locale code ('vi' or 'en')
 * @param {Object} options - Additional Intl.NumberFormat options
 * @param {number} options.minimumFractionDigits - Minimum decimal places (default: 0)
 * @param {number} options.maximumFractionDigits - Maximum decimal places (default: 2)
 * @returns {string} Formatted number string
 * 
 * @example
 * formatNumber(1234.56, 'vi') // "1.234,56"
 * formatNumber(1234.56, 'en') // "1,234.56"
 * formatNumber(1234, 'en', { minimumFractionDigits: 2 }) // "1,234.00"
 */
export function formatNumber(number, locale = 'vi', options = {}) {
  // Validate number
  if (typeof number !== 'number' || isNaN(number)) {
    console.warn('Invalid number provided to formatNumber:', number);
    return '0';
  }
  
  // Validate and normalize locale
  const normalizedLocale = locale === 'en' ? 'en-US' : 'vi-VN';
  
  try {
    // Default options
    const formatOptions = {
      minimumFractionDigits: options.minimumFractionDigits ?? 0,
      maximumFractionDigits: options.maximumFractionDigits ?? 2,
      ...options
    };
    
    const formatter = new Intl.NumberFormat(normalizedLocale, formatOptions);
    return formatter.format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    // Fallback to toString
    return number.toString();
  }
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 * 
 * @param {Date|string|number} date - Date to format relative to now
 * @param {string} locale - Locale code ('vi' or 'en')
 * @returns {string} Relative time string
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000), 'vi') // "1 giờ trước"
 * formatRelativeTime(new Date(Date.now() - 3600000), 'en') // "1 hour ago"
 * formatRelativeTime(new Date(Date.now() + 86400000), 'vi') // "trong 1 ngày"
 * formatRelativeTime(new Date(Date.now() + 86400000), 'en') // "in 1 day"
 */
export function formatRelativeTime(date, locale = 'vi') {
  // Ensure we have a valid Date object
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Validate date
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to formatRelativeTime:', date);
    return '';
  }
  
  // Validate and normalize locale
  const normalizedLocale = locale === 'en' ? 'en-US' : 'vi-VN';
  
  try {
    // Calculate time difference in milliseconds
    const now = new Date();
    const diffMs = dateObj.getTime() - now.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    // Determine the appropriate unit and value
    let value, unit;
    
    if (Math.abs(diffYears) >= 1) {
      value = diffYears;
      unit = 'year';
    } else if (Math.abs(diffMonths) >= 1) {
      value = diffMonths;
      unit = 'month';
    } else if (Math.abs(diffWeeks) >= 1) {
      value = diffWeeks;
      unit = 'week';
    } else if (Math.abs(diffDays) >= 1) {
      value = diffDays;
      unit = 'day';
    } else if (Math.abs(diffHours) >= 1) {
      value = diffHours;
      unit = 'hour';
    } else if (Math.abs(diffMinutes) >= 1) {
      value = diffMinutes;
      unit = 'minute';
    } else {
      value = diffSeconds;
      unit = 'second';
    }
    
    // Use Intl.RelativeTimeFormat for localized relative time
    const formatter = new Intl.RelativeTimeFormat(normalizedLocale, {
      numeric: 'auto',
      style: 'long'
    });
    
    return formatter.format(value, unit);
  } catch (error) {
    console.error('Error formatting relative time:', error);
    // Fallback to absolute date
    return formatDate(dateObj, locale);
  }
}

/**
 * Format a date and time together
 * 
 * @param {Date|string|number} datetime - Date/time to format
 * @param {string} locale - Locale code ('vi' or 'en')
 * @returns {string} Formatted date and time string
 * 
 * @example
 * formatDateTime(new Date('2024-03-15T14:30:00'), 'vi') // "15/03/2024, 14:30"
 * formatDateTime(new Date('2024-03-15T14:30:00'), 'en') // "03/15/2024, 2:30 PM"
 */
export function formatDateTime(datetime, locale = 'vi') {
  const dateStr = formatDate(datetime, locale);
  const timeStr = formatTime(datetime, locale);
  return `${dateStr}, ${timeStr}`;
}

/**
 * Format a decimal number (useful for nutritional values)
 * 
 * @param {number} number - Number to format
 * @param {string} locale - Locale code ('vi' or 'en')
 * @param {number} decimalPlaces - Number of decimal places (default: 1)
 * @returns {string} Formatted decimal number
 * 
 * @example
 * formatDecimal(123.456, 'vi', 1) // "123,5"
 * formatDecimal(123.456, 'en', 2) // "123.46"
 */
export function formatDecimal(number, locale = 'vi', decimalPlaces = 1) {
  return formatNumber(number, locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });
}

/**
 * Format a whole number (no decimals)
 * 
 * @param {number} number - Number to format
 * @param {string} locale - Locale code ('vi' or 'en')
 * @returns {string} Formatted whole number
 * 
 * @example
 * formatWholeNumber(1234, 'vi') // "1.234"
 * formatWholeNumber(1234, 'en') // "1,234"
 */
export function formatWholeNumber(number, locale = 'vi') {
  return formatNumber(Math.round(number), locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

// Default export with all formatting functions
export default {
  formatDate,
  formatTime,
  formatNumber,
  formatRelativeTime,
  formatDateTime,
  formatDecimal,
  formatWholeNumber
};
