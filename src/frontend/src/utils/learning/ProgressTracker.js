/**
 * ProgressTracker - Manages and persists user learning progress
 * 
 * Tracks lesson completion, scroll positions, time spent, and XP earned.
 * Persists all data to localStorage via StorageManager.
 */

import storageManager from './StorageManager.js';

class ProgressTracker {
  constructor() {
    this.KEYS = {
      LESSON_PROGRESS: 'lesson_progress',
      COMPLETED_LESSONS: 'completed_lessons',
      TOTAL_XP: 'total_xp',
      SIDEBAR_COLLAPSED: 'sidebar_collapsed'
    };
  }

  /**
   * Save lesson progress
   * @param {string} lessonId - The lesson ID
   * @param {Object} progress - Progress data
   */
  saveProgress(lessonId, progress) {
    const allProgress = this.loadAllProgress();
    allProgress[lessonId] = {
      ...allProgress[lessonId],
      ...progress,
      lastUpdated: Date.now()
    };
    storageManager.save(this.KEYS.LESSON_PROGRESS, allProgress);
  }

  /**
   * Load all lesson progress
   * @returns {Object} Map of lesson IDs to progress objects
   */
  loadAllProgress() {
    return storageManager.load(this.KEYS.LESSON_PROGRESS) || {};
  }

  /**
   * Load progress for a specific lesson
   * @param {string} lessonId - The lesson ID
   * @returns {Object|null} Progress object or null if not found
   */
  loadProgress(lessonId) {
    const allProgress = this.loadAllProgress();
    return allProgress[lessonId] || null;
  }

  /**
   * Mark lesson as complete
   * @param {string} lessonId - The lesson ID
   * @param {number} score - Quiz score (0-100)
   * @param {number} xp - XP earned
   */
  markLessonComplete(lessonId, score, xp) {
    const progress = this.loadProgress(lessonId) || {};
    
    // Update lesson progress
    this.saveProgress(lessonId, {
      ...progress,
      completed: true,
      score,
      xpEarned: xp,
      completedAt: Date.now()
    });

    // Update completed lessons set
    const completedLessons = this.getCompletedLessons();
    completedLessons.add(lessonId);
    storageManager.save(this.KEYS.COMPLETED_LESSONS, Array.from(completedLessons));

    // Update total XP
    const currentXP = this.getTotalXP();
    storageManager.save(this.KEYS.TOTAL_XP, currentXP + xp);
  }

  /**
   * Update scroll position for a lesson
   * @param {string} lessonId - The lesson ID
   * @param {number} position - Scroll position (0-100)
   */
  updateScrollPosition(lessonId, position) {
    const progress = this.loadProgress(lessonId) || { startedAt: Date.now() };
    this.saveProgress(lessonId, {
      ...progress,
      scrollPosition: Math.max(0, Math.min(100, position))
    });
  }

  /**
   * Update time spent on a lesson
   * @param {string} lessonId - The lesson ID
   * @param {number} timeSpent - Time in seconds
   */
  updateTimeSpent(lessonId, timeSpent) {
    const progress = this.loadProgress(lessonId) || { startedAt: Date.now() };
    this.saveProgress(lessonId, {
      ...progress,
      timeSpent
    });
  }

  /**
   * Initialize lesson progress when first opened
   * @param {string} lessonId - The lesson ID
   */
  initializeLessonProgress(lessonId) {
    const existing = this.loadProgress(lessonId);
    if (!existing || !existing.startedAt) {
      this.saveProgress(lessonId, {
        lessonId,
        completed: false,
        score: 0,
        xpEarned: 0,
        scrollPosition: 0,
        timeSpent: 0,
        startedAt: Date.now(),
        completedAt: null
      });
    }
  }

  /**
   * Get set of completed lesson IDs
   * @returns {Set<string>} Set of completed lesson IDs
   */
  getCompletedLessons() {
    const completed = storageManager.load(this.KEYS.COMPLETED_LESSONS) || [];
    return new Set(completed);
  }

  /**
   * Get total XP earned
   * @returns {number} Total XP
   */
  getTotalXP() {
    return storageManager.load(this.KEYS.TOTAL_XP) || 0;
  }

  /**
   * Calculate category completion percentage
   * @param {Array} lessons - Array of lesson objects in the category
   * @returns {number} Completion percentage (0-100)
   */
  getCategoryCompletion(lessons) {
    const completedLessons = this.getCompletedLessons();
    const completedCount = lessons.filter(lesson => 
      completedLessons.has(lesson.id)
    ).length;
    
    return lessons.length > 0 
      ? Math.round((completedCount / lessons.length) * 100)
      : 0;
  }

  /**
   * Save sidebar collapsed state
   * @param {boolean} collapsed - Whether sidebar is collapsed
   */
  saveSidebarState(collapsed) {
    storageManager.save(this.KEYS.SIDEBAR_COLLAPSED, collapsed);
  }

  /**
   * Load sidebar collapsed state
   * @returns {boolean} Collapsed state
   */
  loadSidebarState() {
    return storageManager.load(this.KEYS.SIDEBAR_COLLAPSED) || false;
  }

  /**
   * Clear all progress data (for testing or reset)
   */
  clearAllProgress() {
    storageManager.remove(this.KEYS.LESSON_PROGRESS);
    storageManager.remove(this.KEYS.COMPLETED_LESSONS);
    storageManager.remove(this.KEYS.TOTAL_XP);
  }
}

// Export singleton instance
export default new ProgressTracker();
