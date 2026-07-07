/**
 * LessonUnlocker - Manages sequential lesson unlocking logic
 * 
 * Determines which lessons are unlocked based on completion status
 * and provides unlock requirement messages.
 */

class LessonUnlocker {
  /**
   * Check if a lesson is unlocked
   * @param {string} lessonId - The lesson ID to check
   * @param {Array} categories - Array of category objects with lessons
   * @param {Set<string>} completedLessons - Set of completed lesson IDs
   * @returns {boolean} True if lesson is unlocked
   */
  isLessonUnlocked(lessonId, categories, completedLessons) {
    // Find the lesson and its position in its category
    for (const category of categories) {
      const lessonIndex = category.lessons.findIndex(lesson => lesson.id === lessonId);
      
      if (lessonIndex !== -1) {
        // First lesson in each category is always unlocked
        if (lessonIndex === 0) {
          return true;
        }
        
        // Check if previous lesson is completed
        const previousLesson = category.lessons[lessonIndex - 1];
        return completedLessons.has(previousLesson.id);
      }
    }
    
    // Lesson not found, consider it locked
    return false;
  }

  /**
   * Get the next lesson to unlock after completing current lesson
   * @param {string} currentLessonId - The ID of the lesson just completed
   * @param {Array} categories - Array of category objects with lessons
   * @returns {string|null} ID of next lesson to unlock, or null if none
   */
  unlockNextLesson(currentLessonId, categories) {
    for (const category of categories) {
      const lessonIndex = category.lessons.findIndex(
        lesson => lesson.id === currentLessonId
      );
      
      if (lessonIndex !== -1) {
        // Check if there's a next lesson in this category
        if (lessonIndex < category.lessons.length - 1) {
          return category.lessons[lessonIndex + 1].id;
        }
        
        // No more lessons in this category
        return null;
      }
    }
    
    return null;
  }

  /**
   * Get unlock requirements message for a locked lesson
   * @param {string} lessonId - The lesson ID
   * @param {Array} categories - Array of category objects with lessons
   * @returns {string} Unlock requirements message
   */
  getUnlockRequirements(lessonId, categories) {
    for (const category of categories) {
      const lessonIndex = category.lessons.findIndex(lesson => lesson.id === lessonId);
      
      if (lessonIndex !== -1 && lessonIndex > 0) {
        const previousLesson = category.lessons[lessonIndex - 1];
        return `Hoàn thành bài học "${previousLesson.title}" để mở khóa`;
      }
    }
    
    return 'Bài học này hiện đang bị khóa';
  }

  /**
   * Get recommended next lesson after completing current one
   * @param {string} currentLessonId - The ID of the lesson just completed
   * @param {Array} categories - Array of category objects with lessons
   * @returns {Object|null} Next lesson object or null
   */
  getNextRecommendation(currentLessonId, categories) {
    // Find current lesson's category and position
    for (let catIndex = 0; catIndex < categories.length; catIndex++) {
      const category = categories[catIndex];
      const lessonIndex = category.lessons.findIndex(
        lesson => lesson.id === currentLessonId
      );
      
      if (lessonIndex !== -1) {
        // Try next lesson in same category
        if (lessonIndex < category.lessons.length - 1) {
          return category.lessons[lessonIndex + 1];
        }
        
        // Try first lesson of next category
        if (catIndex < categories.length - 1) {
          return categories[catIndex + 1].lessons[0];
        }
        
        // All lessons completed
        return null;
      }
    }
    
    return null;
  }

  /**
   * Get all unlocked lesson IDs
   * @param {Array} categories - Array of category objects with lessons
   * @param {Set<string>} completedLessons - Set of completed lesson IDs
   * @returns {Set<string>} Set of unlocked lesson IDs
   */
  getAllUnlockedLessons(categories, completedLessons) {
    const unlocked = new Set();
    
    categories.forEach(category => {
      category.lessons.forEach((lesson, index) => {
        if (this.isLessonUnlocked(lesson.id, categories, completedLessons)) {
          unlocked.add(lesson.id);
        }
      });
    });
    
    return unlocked;
  }

  /**
   * Check if all lessons in a category are completed
   * @param {Object} category - Category object with lessons
   * @param {Set<string>} completedLessons - Set of completed lesson IDs
   * @returns {boolean} True if all lessons completed
   */
  isCategoryComplete(category, completedLessons) {
    return category.lessons.every(lesson => completedLessons.has(lesson.id));
  }

  /**
   * Check if all lessons across all categories are completed
   * @param {Array} categories - Array of category objects with lessons
   * @param {Set<string>} completedLessons - Set of completed lesson IDs
   * @returns {boolean} True if all lessons completed
   */
  isAllLessonsComplete(categories, completedLessons) {
    return categories.every(category => 
      this.isCategoryComplete(category, completedLessons)
    );
  }
}

// Export singleton instance
export default new LessonUnlocker();
