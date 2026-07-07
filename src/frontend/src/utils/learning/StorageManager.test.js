/**
 * Tests for StorageManager utility
 * Requirements: 11.1, 11.2
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import storageManager from './StorageManager.js';

describe('StorageManager', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe('save and load operations', () => {
    it('should save and load string values', () => {
      storageManager.save('test_key', 'test_value');
      const loaded = storageManager.load('test_key');
      expect(loaded).toBe('test_value');
    });

    it('should save and load object values', () => {
      const testObj = { name: 'Test', value: 123, nested: { key: 'value' } };
      storageManager.save('test_obj', testObj);
      const loaded = storageManager.load('test_obj');
      expect(loaded).toEqual(testObj);
    });

    it('should save and load array values', () => {
      const testArray = [1, 2, 3, 'four', { five: 5 }];
      storageManager.save('test_array', testArray);
      const loaded = storageManager.load('test_array');
      expect(loaded).toEqual(testArray);
    });

    it('should save and load boolean values', () => {
      storageManager.save('test_bool', true);
      const loaded = storageManager.load('test_bool');
      expect(loaded).toBe(true);
    });

    it('should save and load number values', () => {
      storageManager.save('test_num', 42);
      const loaded = storageManager.load('test_num');
      expect(loaded).toBe(42);
    });

    it('should return null for non-existent keys', () => {
      const loaded = storageManager.load('non_existent_key');
      expect(loaded).toBeNull();
    });

    it('should namespace keys correctly', () => {
      storageManager.save('my_key', 'my_value');
      // Check that the key is namespaced in localStorage
      const directValue = localStorage.getItem('nutrigain_my_key');
      expect(directValue).toBe(JSON.stringify('my_value'));
    });
  });

  describe('remove operation', () => {
    it('should remove stored values', () => {
      storageManager.save('remove_test', 'value');
      expect(storageManager.load('remove_test')).toBe('value');
      
      storageManager.remove('remove_test');
      expect(storageManager.load('remove_test')).toBeNull();
    });

    it('should not throw error when removing non-existent key', () => {
      expect(() => {
        storageManager.remove('non_existent');
      }).not.toThrow();
    });
  });

  describe('clear operation', () => {
    it('should clear all namespaced data', () => {
      storageManager.save('key1', 'value1');
      storageManager.save('key2', 'value2');
      storageManager.save('key3', 'value3');
      
      storageManager.clear();
      
      expect(storageManager.load('key1')).toBeNull();
      expect(storageManager.load('key2')).toBeNull();
      expect(storageManager.load('key3')).toBeNull();
    });

    it('should only clear namespaced keys', () => {
      // Add a non-namespaced key directly
      localStorage.setItem('other_app_key', 'should_remain');
      
      storageManager.save('my_key', 'my_value');
      storageManager.clear();
      
      // Namespaced key should be removed
      expect(storageManager.load('my_key')).toBeNull();
      
      // Non-namespaced key should remain
      expect(localStorage.getItem('other_app_key')).toBe('should_remain');
    });
  });

  describe('storage availability', () => {
    it('should detect localStorage availability', () => {
      expect(storageManager.isAvailable()).toBe(true);
    });

    it('should handle localStorage being unavailable', () => {
      // Mock localStorage being unavailable
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('localStorage is not available');
      });

      // Create new instance to test fallback
      const testManager = new (storageManager.constructor)('test');
      
      // Should use in-memory fallback
      expect(testManager.isAvailable()).toBe(false);
      
      // Should still work with in-memory storage
      testManager.save('test', 'value');
      expect(testManager.load('test')).toBe('value');
      
      // Restore original
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('error handling', () => {
    it('should handle JSON parse errors gracefully', () => {
      // Directly set invalid JSON in localStorage
      localStorage.setItem('nutrigain_invalid', 'invalid json {');
      
      const loaded = storageManager.load('invalid');
      expect(loaded).toBeNull();
    });

    it('should handle quota exceeded errors', () => {
      // Mock quota exceeded error
      const originalSetItem = Storage.prototype.setItem;
      let callCount = 0;
      
      Storage.prototype.setItem = vi.fn(function(key, value) {
        callCount++;
        if (callCount === 1) {
          const error = new Error('QuotaExceededError');
          error.name = 'QuotaExceededError';
          throw error;
        }
        // Allow subsequent calls to succeed (in-memory fallback)
      });

      // This should trigger fallback to in-memory storage
      storageManager.save('large_data', 'x'.repeat(10000));
      
      // Should still be able to save and load (from memory)
      storageManager.save('test', 'value');
      expect(storageManager.load('test')).toBe('value');
      
      // Restore original
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('data persistence', () => {
    it('should persist data across multiple operations', () => {
      storageManager.save('persist1', 'value1');
      storageManager.save('persist2', 'value2');
      
      expect(storageManager.load('persist1')).toBe('value1');
      expect(storageManager.load('persist2')).toBe('value2');
      
      storageManager.save('persist1', 'updated_value');
      
      expect(storageManager.load('persist1')).toBe('updated_value');
      expect(storageManager.load('persist2')).toBe('value2');
    });

    it('should overwrite existing values', () => {
      storageManager.save('overwrite', 'original');
      storageManager.save('overwrite', 'updated');
      
      expect(storageManager.load('overwrite')).toBe('updated');
    });
  });
});
