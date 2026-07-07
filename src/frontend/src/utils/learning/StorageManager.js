/**
 * StorageManager - Abstraction layer for localStorage operations
 * 
 * Provides a consistent interface for saving, loading, and removing data
 * from browser localStorage with error handling and fallback support.
 */

class StorageManager {
  constructor(namespace = 'nutrigain') {
    this.namespace = namespace;
    this.inMemoryFallback = new Map();
    this.storageAvailable = this.checkStorageAvailability();
  }

  /**
   * Check if localStorage is available and working
   * @returns {boolean} True if localStorage is available
   */
  checkStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage is not available, using in-memory fallback');
      return false;
    }
  }

  /**
   * Generate namespaced key
   * @param {string} key - The key to namespace
   * @returns {string} Namespaced key
   */
  getKey(key) {
    return `${this.namespace}_${key}`;
  }

  /**
   * Save data to storage
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be JSON stringified)
   */
  save(key, value) {
    const namespacedKey = this.getKey(key);
    
    try {
      const serialized = JSON.stringify(value);
      
      if (this.storageAvailable) {
        localStorage.setItem(namespacedKey, serialized);
      } else {
        this.inMemoryFallback.set(namespacedKey, serialized);
      }
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
      
      // If localStorage is full, try in-memory fallback
      if (error.name === 'QuotaExceededError') {
        this.storageAvailable = false;
        this.inMemoryFallback.set(namespacedKey, JSON.stringify(value));
      }
    }
  }

  /**
   * Load data from storage
   * @param {string} key - Storage key
   * @returns {any|null} Parsed value or null if not found
   */
  load(key) {
    const namespacedKey = this.getKey(key);
    
    try {
      let serialized;
      
      if (this.storageAvailable) {
        serialized = localStorage.getItem(namespacedKey);
      } else {
        serialized = this.inMemoryFallback.get(namespacedKey);
      }
      
      return serialized ? JSON.parse(serialized) : null;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove data from storage
   * @param {string} key - Storage key
   */
  remove(key) {
    const namespacedKey = this.getKey(key);
    
    try {
      if (this.storageAvailable) {
        localStorage.removeItem(namespacedKey);
      } else {
        this.inMemoryFallback.delete(namespacedKey);
      }
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  }

  /**
   * Clear all namespaced data from storage
   */
  clear() {
    try {
      if (this.storageAvailable) {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(this.namespace)) {
            localStorage.removeItem(key);
          }
        });
      } else {
        const keys = Array.from(this.inMemoryFallback.keys());
        keys.forEach(key => {
          if (key.startsWith(this.namespace)) {
            this.inMemoryFallback.delete(key);
          }
        });
      }
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  /**
   * Check if storage is available
   * @returns {boolean} True if localStorage is available
   */
  isAvailable() {
    return this.storageAvailable;
  }
}

// Export singleton instance
export default new StorageManager('nutrigain');
