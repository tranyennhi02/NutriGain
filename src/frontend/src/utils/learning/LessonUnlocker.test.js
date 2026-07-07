/**
 * Tests for LessonUnlocker utility
 * Requirements: 6.1, 6.2, 12.1, 12.2, 12.3, 12.4
 */

import { describe, it, expect, beforeEach } from 'vitest';
import lessonUnlocker from './LessonUnlocker.js';

describe('LessonUnlocker', () => {
  let mockCategories;

  beforeEach(() => {
    mockCategories = [
      {
        id: 'cat-1',
        name: 'Category 1',
        lessons: [
          { id: 'cat1-lesson1', title: 'Lesson 1' },
          { id: 'cat1-lesson2', title: 'Lesson 2' },
          { id: 'cat1-lesson3', title: 'Lesson 3' }
        ]
      },
      {
        id: 'cat-2',
        name: 'Category 2',
        lessons: [
          { id: 'cat2-lesson1', title: 'Lesson 1' },
          { id: 'cat2-lesson2', title: 'Lesson 2' }
        ]
      }
    ];
  });

  describe('sequential unlocking rules', () => {
    it('should unlock first lesson in each category by default', () => {
      const completedLessons = new Set();

      expect(lessonUnlocker.isLessonUnlocked('cat1-lesson1', mockCategories, completedLessons)).toBe(true);
      expect(lessonUnlocker.isLessonUnlocked('cat2-lesson1', mockCategories, completedLessons)).toBe(true);
    });

    it('should lock second lesson until first is completed', () => {
      const completedLessons = new Set();

      expect(lessonUnlocker.isLessonUnlocked('cat1-lesson2', mockCategories, completedLessons)).toBe(false);
    });

    it('should unlock second lesson after first is completed', () => {
      const completedLessons = new Set(['cat1-lesson1']);

      expect(lessonUnlocker.isLessonUnlocked('cat1-lesson2', mockCategories, completedLessons)).toBe(true);
    });

    it('should unlock lessons sequentially', () => {
      let completedLessons = new Set();

      // Only first lesson unlocked
      expect(lessonUnlocker.isLessonUnlocked('cat1-lesson1', mockCategories, completedLessons)).toBe(true);
      expect(lessonUnlocker.isLessonUnlocked('cat1-lesson2', mockCategories, completedLessons)).toBe(false);
      expect(lessonUnlocker.isLessonUnlocked('cat1-lesson3', mockCategories, completedLessons)).toBe(false);

      // Complete first lesson
      completedLessons = new Set(['cat1-lesson1']);
      expect(lessonUnlocker.isLessonUnlocked('cat1-lesson2', mockCategories, completedLessons)).toBe(true);
      expect(lessonUnlocker.isLessonUnlocked('cat1-lesson3', mockCategories, completedLessons)).toBe(false);

      // Complete second lesson
      completedLessons = new Set(['cat1-lesson1', 'cat1-lesson2']);
      expect(lessonUnlocker.isLessonUnlocked('cat1-lesson3', mockCategories, completedLessons)).toBe(true);
    });

    it('should not unlock lessons in other categories', () => {
      const completedLessons = new Set(['cat1-lesson1', 'cat1-lesson2']);

      // Cat 2 lessons should not be affected by Cat 1 progress
      expect(lessonUnlocker.isLessonUnlocked('cat2-lesson2', mockCategories, completedLessons)).toBe(false);
    });

    it('should return false for non-existent lesson', () => {
      const completedLessons = new Set();

      expect(lessonUnlocker.isLessonUnlocked('non-existent', mockCategories, completedLessons)).toBe(false);
    });
  });

  describe('next lesson unlocking', () => {
    it('should return next lesson in sequence', () => {
      const nextLesson = lessonUnlocker.unlockNextLesson('cat1-lesson1', mockCategories);
      expect(nextLesson).toBe('cat1-lesson2');
    });

    it('should return next lesson for middle lesson', () => {
      const nextLesson = lessonUnlocker.unlockNextLesson('cat1-lesson2', mockCategories);
      expect(nextLesson).toBe('cat1-lesson3');
    });

    it('should return null for last lesson in category', () => {
      const nextLesson = lessonUnlocker.unlockNextLesson('cat1-lesson3', mockCategories);
      expect(nextLesson).toBeNull();
    });

    it('should return null for non-existent lesson', () => {
      const nextLesson = lessonUnlocker.unlockNextLesson('non-existent', mockCategories);
      expect(nextLesson).toBeNull();
    });
  });

  describe('unlock requirements', () => {
    it('should return requirement message for locked lesson', () => {
      const message = lessonUnlocker.getUnlockRequirements('cat1-lesson2', mockCategories);
      expect(message).toContain('Lesson 1');
      expect(message).toContain('Hoàn thành');
    });

    it('should return requirement for third lesson', () => {
      const message = lessonUnlocker.getUnlockRequirements('cat1-lesson3', mockCategories);
      expect(message).toContain('Lesson 2');
    });

    it('should return generic message for non-existent lesson', () => {
      const message = lessonUnlocker.getUnlockRequirements('non-existent', mockCategories);
      expect(message).toBe('Bài học này hiện đang bị khóa');
    });

    it('should return generic message for first lesson', () => {
      const message = lessonUnlocker.getUnlockRequirements('cat1-lesson1', mockCategories);
      expect(message).toBe('Bài học này hiện đang bị khóa');
    });
  });

  describe('next recommendation', () => {
    it('should recommend next lesson in same category', () => {
      const next = lessonUnlocker.getNextRecommendation('cat1-lesson1', mockCategories);
      expect(next).toBeDefined();
      expect(next.id).toBe('cat1-lesson2');
    });

    it('should recommend first lesson of next category when category complete', () => {
      const next = lessonUnlocker.getNextRecommendation('cat1-lesson3', mockCategories);
      expect(next).toBeDefined();
      expect(next.id).toBe('cat2-lesson1');
    });

    it('should return null when all lessons complete', () => {
      const next = lessonUnlocker.getNextRecommendation('cat2-lesson2', mockCategories);
      expect(next).toBeNull();
    });

    it('should return null for non-existent lesson', () => {
      const next = lessonUnlocker.getNextRecommendation('non-existent', mockCategories);
      expect(next).toBeNull();
    });
  });

  describe('all unlocked lessons', () => {
    it('should return first lessons when nothing completed', () => {
      const completedLessons = new Set();
      const unlocked = lessonUnlocker.getAllUnlockedLessons(mockCategories, completedLessons);

      expect(unlocked.size).toBe(2);
      expect(unlocked.has('cat1-lesson1')).toBe(true);
      expect(unlocked.has('cat2-lesson1')).toBe(true);
    });

    it('should return unlocked lessons based on completion', () => {
      const completedLessons = new Set(['cat1-lesson1', 'cat2-lesson1']);
      const unlocked = lessonUnlocker.getAllUnlockedLessons(mockCategories, completedLessons);

      expect(unlocked.size).toBe(4);
      expect(unlocked.has('cat1-lesson1')).toBe(true);
      expect(unlocked.has('cat1-lesson2')).toBe(true);
      expect(unlocked.has('cat2-lesson1')).toBe(true);
      expect(unlocked.has('cat2-lesson2')).toBe(true);
    });

    it('should return all lessons when all completed', () => {
      const completedLessons = new Set([
        'cat1-lesson1', 'cat1-lesson2', 'cat1-lesson3',
        'cat2-lesson1', 'cat2-lesson2'
      ]);
      const unlocked = lessonUnlocker.getAllUnlockedLessons(mockCategories, completedLessons);

      expect(unlocked.size).toBe(5);
    });
  });

  describe('category completion', () => {
    it('should detect incomplete category', () => {
      const completedLessons = new Set(['cat1-lesson1']);
      const isComplete = lessonUnlocker.isCategoryComplete(mockCategories[0], completedLessons);
      expect(isComplete).toBe(false);
    });

    it('should detect complete category', () => {
      const completedLessons = new Set(['cat1-lesson1', 'cat1-lesson2', 'cat1-lesson3']);
      const isComplete = lessonUnlocker.isCategoryComplete(mockCategories[0], completedLessons);
      expect(isComplete).toBe(true);
    });

    it('should detect empty category as complete', () => {
      const emptyCategory = { id: 'empty', lessons: [] };
      const completedLessons = new Set();
      const isComplete = lessonUnlocker.isCategoryComplete(emptyCategory, completedLessons);
      expect(isComplete).toBe(true);
    });
  });

  describe('all lessons completion', () => {
    it('should detect incomplete courses', () => {
      const completedLessons = new Set(['cat1-lesson1', 'cat1-lesson2']);
      const isComplete = lessonUnlocker.isAllLessonsComplete(mockCategories, completedLessons);
      expect(isComplete).toBe(false);
    });

    it('should detect all lessons complete', () => {
      const completedLessons = new Set([
        'cat1-lesson1', 'cat1-lesson2', 'cat1-lesson3',
        'cat2-lesson1', 'cat2-lesson2'
      ]);
      const isComplete = lessonUnlocker.isAllLessonsComplete(mockCategories, completedLessons);
      expect(isComplete).toBe(true);
    });

    it('should return true for empty categories array', () => {
      const completedLessons = new Set();
      const isComplete = lessonUnlocker.isAllLessonsComplete([], completedLessons);
      expect(isComplete).toBe(true);
    });
  });
});
