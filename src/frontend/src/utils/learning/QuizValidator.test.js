/**
 * Tests for QuizValidator utility
 * Requirements: 3.6, 3.7, 3.8, 12.1, 12.2, 12.3, 12.4
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import quizValidator from './QuizValidator.js';
import storageManager from './StorageManager.js';

describe('QuizValidator', () => {
  beforeEach(() => {
    // Clear storage before each test
    storageManager.clear();
  });

  afterEach(() => {
    // Clean up after each test
    storageManager.clear();
  });

  describe('score calculation', () => {
    const mockQuestions = [
      { id: 'q1', correctAnswerIndex: 0 },
      { id: 'q2', correctAnswerIndex: 1 },
      { id: 'q3', correctAnswerIndex: 2 },
      { id: 'q4', correctAnswerIndex: 3 }
    ];

    it('should calculate 100% for all correct answers', () => {
      const answers = [
        { questionId: 'q1', selectedIndex: 0 },
        { questionId: 'q2', selectedIndex: 1 },
        { questionId: 'q3', selectedIndex: 2 },
        { questionId: 'q4', selectedIndex: 3 }
      ];

      const score = quizValidator.calculateScore(mockQuestions, answers);
      expect(score).toBe(100);
    });

    it('should calculate 0% for all incorrect answers', () => {
      const answers = [
        { questionId: 'q1', selectedIndex: 1 },
        { questionId: 'q2', selectedIndex: 0 },
        { questionId: 'q3', selectedIndex: 0 },
        { questionId: 'q4', selectedIndex: 0 }
      ];

      const score = quizValidator.calculateScore(mockQuestions, answers);
      expect(score).toBe(0);
    });

    it('should calculate 75% for 3 out of 4 correct', () => {
      const answers = [
        { questionId: 'q1', selectedIndex: 0 }, // correct
        { questionId: 'q2', selectedIndex: 1 }, // correct
        { questionId: 'q3', selectedIndex: 0 }, // incorrect
        { questionId: 'q4', selectedIndex: 3 }  // correct
      ];

      const score = quizValidator.calculateScore(mockQuestions, answers);
      expect(score).toBe(75);
    });

    it('should calculate 50% for half correct', () => {
      const answers = [
        { questionId: 'q1', selectedIndex: 0 }, // correct
        { questionId: 'q2', selectedIndex: 0 }, // incorrect
        { questionId: 'q3', selectedIndex: 2 }, // correct
        { questionId: 'q4', selectedIndex: 0 }  // incorrect
      ];

      const score = quizValidator.calculateScore(mockQuestions, answers);
      expect(score).toBe(50);
    });

    it('should return 0 for empty questions', () => {
      const score = quizValidator.calculateScore([], []);
      expect(score).toBe(0);
    });

    it('should handle missing answers as incorrect', () => {
      const answers = [
        { questionId: 'q1', selectedIndex: 0 }, // correct
        { questionId: 'q2', selectedIndex: 1 }  // correct
        // q3 and q4 not answered
      ];

      const score = quizValidator.calculateScore(mockQuestions, answers);
      expect(score).toBe(50);
    });

    it('should round score to nearest integer', () => {
      const questions = [
        { id: 'q1', correctAnswerIndex: 0 },
        { id: 'q2', correctAnswerIndex: 1 },
        { id: 'q3', correctAnswerIndex: 2 }
      ];

      const answers = [
        { questionId: 'q1', selectedIndex: 0 }, // correct
        { questionId: 'q2', selectedIndex: 0 }, // incorrect
        { questionId: 'q3', selectedIndex: 0 }  // incorrect
      ];

      const score = quizValidator.calculateScore(questions, answers);
      expect(score).toBe(33); // 33.33 rounded to 33
    });
  });

  describe('passing score threshold', () => {
    it('should identify 70% as passing', () => {
      expect(quizValidator.isPassingScore(70)).toBe(true);
    });

    it('should identify above 70% as passing', () => {
      expect(quizValidator.isPassingScore(75)).toBe(true);
      expect(quizValidator.isPassingScore(85)).toBe(true);
      expect(quizValidator.isPassingScore(100)).toBe(true);
    });

    it('should identify below 70% as failing', () => {
      expect(quizValidator.isPassingScore(69)).toBe(false);
      expect(quizValidator.isPassingScore(50)).toBe(false);
      expect(quizValidator.isPassingScore(0)).toBe(false);
    });
  });

  describe('attempt counter', () => {
    it('should start with 0 attempts', () => {
      const attempts = quizValidator.getAttemptCount('lesson-1');
      expect(attempts).toBe(0);
    });

    it('should increment attempt counter', () => {
      quizValidator.incrementAttempt('lesson-1');
      expect(quizValidator.getAttemptCount('lesson-1')).toBe(1);

      quizValidator.incrementAttempt('lesson-1');
      expect(quizValidator.getAttemptCount('lesson-1')).toBe(2);
    });

    it('should track attempts separately per lesson', () => {
      quizValidator.incrementAttempt('lesson-1');
      quizValidator.incrementAttempt('lesson-1');
      quizValidator.incrementAttempt('lesson-2');

      expect(quizValidator.getAttemptCount('lesson-1')).toBe(2);
      expect(quizValidator.getAttemptCount('lesson-2')).toBe(1);
    });

    it('should reset attempts', () => {
      quizValidator.incrementAttempt('lesson-1');
      quizValidator.incrementAttempt('lesson-1');
      expect(quizValidator.getAttemptCount('lesson-1')).toBe(2);

      quizValidator.resetAttempts('lesson-1');
      expect(quizValidator.getAttemptCount('lesson-1')).toBe(0);
    });
  });

  describe('quiz locking after 3 failed attempts', () => {
    it('should allow retry when attempts < 3', () => {
      expect(quizValidator.canRetry('lesson-1')).toBe(true);

      quizValidator.incrementAttempt('lesson-1');
      expect(quizValidator.canRetry('lesson-1')).toBe(true);

      quizValidator.incrementAttempt('lesson-1');
      expect(quizValidator.canRetry('lesson-1')).toBe(true);
    });

    it('should lock quiz after 3 failed attempts', () => {
      quizValidator.incrementAttempt('lesson-1'); // 1
      quizValidator.incrementAttempt('lesson-1'); // 2
      quizValidator.incrementAttempt('lesson-1'); // 3

      expect(quizValidator.canRetry('lesson-1')).toBe(false);
    });

    it('should set lock timestamp after 3 attempts', () => {
      quizValidator.incrementAttempt('lesson-1');
      quizValidator.incrementAttempt('lesson-1');
      quizValidator.incrementAttempt('lesson-1');

      const lockTime = quizValidator.getLockTimestamp('lesson-1');
      expect(lockTime).toBeDefined();
      expect(lockTime).toBeGreaterThan(0);
    });

    it('should manually lock quiz', () => {
      const lockTime = quizValidator.lockQuiz('lesson-1');
      expect(lockTime).toBeGreaterThan(0);
      expect(quizValidator.getLockTimestamp('lesson-1')).toBe(lockTime);
    });
  });

  describe('unlock after 1 hour cooldown', () => {
    it('should calculate remaining lock time', () => {
      const lockTime = Date.now();
      quizValidator.lockQuiz('lesson-1');

      const remaining = quizValidator.getRemainingLockTime('lesson-1');
      // Should be close to 1 hour (3600000 ms)
      expect(remaining).toBeGreaterThan(3590000);
      expect(remaining).toBeLessThanOrEqual(3600000);
    });

    it('should return 0 remaining time for unlocked quiz', () => {
      const remaining = quizValidator.getRemainingLockTime('lesson-1');
      expect(remaining).toBe(0);
    });

    it('should allow retry after lock expires', () => {
      // Mock a lock from 2 hours ago
      const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
      const allLocks = {};
      allLocks['lesson-1'] = twoHoursAgo;
      storageManager.save('quiz_locks', allLocks);

      const allAttempts = {};
      allAttempts['lesson-1'] = 3;
      storageManager.save('quiz_attempts', allAttempts);

      expect(quizValidator.canRetry('lesson-1')).toBe(true);
    });

    it('should not allow retry before lock expires', () => {
      // Mock a lock from 30 minutes ago
      const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
      const allLocks = {};
      allLocks['lesson-1'] = thirtyMinutesAgo;
      storageManager.save('quiz_locks', allLocks);

      const allAttempts = {};
      allAttempts['lesson-1'] = 3;
      storageManager.save('quiz_attempts', allAttempts);

      expect(quizValidator.canRetry('lesson-1')).toBe(false);
    });

    it('should check and unlock expired locks', () => {
      // Set lock from 2 hours ago
      const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
      const allLocks = {};
      allLocks['lesson-1'] = twoHoursAgo;
      storageManager.save('quiz_locks', allLocks);

      const allAttempts = {};
      allAttempts['lesson-1'] = 3;
      storageManager.save('quiz_attempts', allAttempts);

      const unlocked = quizValidator.checkAndUnlockIfExpired('lesson-1');
      expect(unlocked).toBe(true);
      expect(quizValidator.getAttemptCount('lesson-1')).toBe(0);
      expect(quizValidator.getLockTimestamp('lesson-1')).toBeNull();
    });

    it('should not unlock if lock not expired', () => {
      const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
      const allLocks = {};
      allLocks['lesson-1'] = thirtyMinutesAgo;
      storageManager.save('quiz_locks', allLocks);

      const unlocked = quizValidator.checkAndUnlockIfExpired('lesson-1');
      expect(unlocked).toBe(false);
    });
  });

  describe('remaining time formatting', () => {
    it('should format time in hours and minutes', () => {
      const oneHour = 60 * 60 * 1000;
      const formatted = quizValidator.formatRemainingTime(oneHour);
      expect(formatted).toContain('1 giờ');
      expect(formatted).toContain('0 phút');
    });

    it('should format time in minutes and seconds', () => {
      const thirtyMinutes = 30 * 60 * 1000;
      const formatted = quizValidator.formatRemainingTime(thirtyMinutes);
      expect(formatted).toContain('30 phút');
      expect(formatted).toContain('giây');
    });

    it('should format time in seconds only', () => {
      const fortyFiveSeconds = 45 * 1000;
      const formatted = quizValidator.formatRemainingTime(fortyFiveSeconds);
      expect(formatted).toContain('45 giây');
      expect(formatted).not.toContain('phút');
    });

    it('should handle 0 milliseconds', () => {
      const formatted = quizValidator.formatRemainingTime(0);
      expect(formatted).toBe('0 giây');
    });
  });

  describe('submission validation', () => {
    const mockQuestions = [
      { id: 'q1', options: ['A', 'B', 'C', 'D'] },
      { id: 'q2', options: ['A', 'B', 'C', 'D'] }
    ];

    it('should validate complete submission', () => {
      const answers = [
        { questionId: 'q1', selectedIndex: 0 },
        { questionId: 'q2', selectedIndex: 1 }
      ];

      const result = quizValidator.validateSubmission(mockQuestions, answers);
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    it('should reject incomplete submission', () => {
      const answers = [
        { questionId: 'q1', selectedIndex: 0 }
        // q2 not answered
      ];

      const result = quizValidator.validateSubmission(mockQuestions, answers);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('tất cả câu hỏi');
    });

    it('should reject invalid answer index', () => {
      const answers = [
        { questionId: 'q1', selectedIndex: 0 },
        { questionId: 'q2', selectedIndex: 5 } // Invalid index (> 3)
      ];

      const result = quizValidator.validateSubmission(mockQuestions, answers);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('không hợp lệ');
    });

    it('should reject negative answer index', () => {
      const answers = [
        { questionId: 'q1', selectedIndex: 0 },
        { questionId: 'q2', selectedIndex: -1 } // Negative index
      ];

      const result = quizValidator.validateSubmission(mockQuestions, answers);
      expect(result.isValid).toBe(false);
    });

    it('should reject answers for non-existent questions', () => {
      const answers = [
        { questionId: 'q1', selectedIndex: 0 },
        { questionId: 'q3', selectedIndex: 1 } // q3 doesn't exist
      ];

      const result = quizValidator.validateSubmission(mockQuestions, answers);
      expect(result.isValid).toBe(false);
    });
  });

  describe('reset after successful pass', () => {
    it('should reset attempts and unlock after passing', () => {
      quizValidator.incrementAttempt('lesson-1');
      quizValidator.incrementAttempt('lesson-1');

      quizValidator.resetAttempts('lesson-1');

      expect(quizValidator.getAttemptCount('lesson-1')).toBe(0);
      expect(quizValidator.getLockTimestamp('lesson-1')).toBeNull();
    });

    it('should clear lock when resetting', () => {
      quizValidator.lockQuiz('lesson-1');
      expect(quizValidator.getLockTimestamp('lesson-1')).toBeDefined();

      quizValidator.resetAttempts('lesson-1');
      expect(quizValidator.getLockTimestamp('lesson-1')).toBeNull();
    });
  });
});
