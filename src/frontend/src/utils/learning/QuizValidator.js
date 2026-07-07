/**
 * QuizValidator - Validates quiz answers and manages retry logic
 * 
 * Handles quiz scoring, passing thresholds, attempt tracking,
 * and quiz locking after failed attempts.
 */

import storageManager from './StorageManager.js';

class QuizValidator {
  constructor() {
    this.PASSING_SCORE = 70; // 70% to pass
    this.MAX_ATTEMPTS = 3;
    this.LOCK_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
    
    this.KEYS = {
      QUIZ_ATTEMPTS: 'quiz_attempts',
      QUIZ_LOCKS: 'quiz_locks'
    };
  }

  /**
   * Calculate quiz score
   * @param {Array} questions - Array of question objects with correctAnswerIndex
   * @param {Array} answers - Array of answer objects with selectedIndex
   * @returns {number} Score as percentage (0-100)
   */
  calculateScore(questions, answers) {
    if (!questions || questions.length === 0) {
      return 0;
    }

    let correctCount = 0;
    
    questions.forEach((question, index) => {
      const answer = answers.find(a => a.questionId === question.id);
      
      if (answer && answer.selectedIndex === question.correctAnswerIndex) {
        correctCount++;
      }
    });

    return Math.round((correctCount / questions.length) * 100);
  }

  /**
   * Check if score is passing
   * @param {number} score - Score percentage (0-100)
   * @returns {boolean} True if passing
   */
  isPassingScore(score) {
    return score >= this.PASSING_SCORE;
  }

  /**
   * Check if user can retry the quiz
   * @param {string} lessonId - The lesson ID
   * @returns {boolean} True if retry is allowed
   */
  canRetry(lessonId) {
    const attempts = this.getAttemptCount(lessonId);
    
    // Check if quiz is locked
    if (attempts >= this.MAX_ATTEMPTS) {
      const lockTime = this.getLockTimestamp(lessonId);
      if (lockTime) {
        const timeElapsed = Date.now() - lockTime;
        return timeElapsed >= this.LOCK_DURATION;
      }
    }
    
    return attempts < this.MAX_ATTEMPTS;
  }

  /**
   * Get remaining time until quiz unlock (in milliseconds)
   * @param {string} lessonId - The lesson ID
   * @returns {number} Remaining time in ms, or 0 if not locked
   */
  getRemainingLockTime(lessonId) {
    const lockTime = this.getLockTimestamp(lessonId);
    
    if (!lockTime) {
      return 0;
    }

    const timeElapsed = Date.now() - lockTime;
    const remaining = this.LOCK_DURATION - timeElapsed;
    
    return Math.max(0, remaining);
  }

  /**
   * Format remaining lock time as human-readable string
   * @param {number} milliseconds - Time in milliseconds
   * @returns {string} Formatted time string
   */
  formatRemainingTime(milliseconds) {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    } else if (minutes > 0) {
      return `${minutes} phút ${seconds} giây`;
    } else {
      return `${seconds} giây`;
    }
  }

  /**
   * Increment attempt counter for a lesson
   * @param {string} lessonId - The lesson ID
   * @returns {number} New attempt count
   */
  incrementAttempt(lessonId) {
    const attempts = this.getAttemptCount(lessonId) + 1;
    
    const allAttempts = storageManager.load(this.KEYS.QUIZ_ATTEMPTS) || {};
    allAttempts[lessonId] = attempts;
    storageManager.save(this.KEYS.QUIZ_ATTEMPTS, allAttempts);

    // If reached max attempts, lock the quiz
    if (attempts >= this.MAX_ATTEMPTS) {
      this.lockQuiz(lessonId);
    }

    return attempts;
  }

  /**
   * Get current attempt count for a lesson
   * @param {string} lessonId - The lesson ID
   * @returns {number} Attempt count
   */
  getAttemptCount(lessonId) {
    const allAttempts = storageManager.load(this.KEYS.QUIZ_ATTEMPTS) || {};
    return allAttempts[lessonId] || 0;
  }

  /**
   * Lock quiz after max failed attempts
   * @param {string} lessonId - The lesson ID
   * @returns {number} Lock timestamp
   */
  lockQuiz(lessonId) {
    const lockTimestamp = Date.now();
    
    const allLocks = storageManager.load(this.KEYS.QUIZ_LOCKS) || {};
    allLocks[lessonId] = lockTimestamp;
    storageManager.save(this.KEYS.QUIZ_LOCKS, allLocks);

    return lockTimestamp;
  }

  /**
   * Get lock timestamp for a lesson
   * @param {string} lessonId - The lesson ID
   * @returns {number|null} Lock timestamp or null if not locked
   */
  getLockTimestamp(lessonId) {
    const allLocks = storageManager.load(this.KEYS.QUIZ_LOCKS) || {};
    return allLocks[lessonId] || null;
  }

  /**
   * Reset attempts and unlock quiz (called after passing or lock expiration)
   * @param {string} lessonId - The lesson ID
   */
  resetAttempts(lessonId) {
    // Remove attempts
    const allAttempts = storageManager.load(this.KEYS.QUIZ_ATTEMPTS) || {};
    delete allAttempts[lessonId];
    storageManager.save(this.KEYS.QUIZ_ATTEMPTS, allAttempts);

    // Remove lock
    const allLocks = storageManager.load(this.KEYS.QUIZ_LOCKS) || {};
    delete allLocks[lessonId];
    storageManager.save(this.KEYS.QUIZ_LOCKS, allLocks);
  }

  /**
   * Validate quiz submission
   * @param {Array} questions - Array of question objects
   * @param {Array} answers - Array of answer objects
   * @returns {Object} Validation result with isValid and message
   */
  validateSubmission(questions, answers) {
    // Check if all questions are answered
    if (answers.length !== questions.length) {
      return {
        isValid: false,
        message: 'Vui lòng trả lời tất cả câu hỏi'
      };
    }

    // Check if all answer indices are valid
    const invalidAnswers = answers.filter(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      return !question || 
             answer.selectedIndex < 0 || 
             answer.selectedIndex >= question.options.length;
    });

    if (invalidAnswers.length > 0) {
      return {
        isValid: false,
        message: 'Một số câu trả lời không hợp lệ'
      };
    }

    return {
      isValid: true,
      message: ''
    };
  }

  /**
   * Check if lock has expired and unlock if needed
   * @param {string} lessonId - The lesson ID
   * @returns {boolean} True if lock was removed
   */
  checkAndUnlockIfExpired(lessonId) {
    const remainingTime = this.getRemainingLockTime(lessonId);
    
    if (remainingTime === 0 && this.getLockTimestamp(lessonId)) {
      this.resetAttempts(lessonId);
      return true;
    }
    
    return false;
  }
}

// Export singleton instance
export default new QuizValidator();
