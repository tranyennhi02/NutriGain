/**
 * Tests for ProgressTracker utility
 * Requirements: 6.1, 6.2, 12.1, 12.2, 12.3, 12.4
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import progressTracker from './ProgressTracker.js';
import storageManager from './StorageManager.js';

describe('ProgressTracker', () => {
  beforeEach(() => {
    // Clear all progress before each test
    progressTracker.clearAllProgress();
    storageManager.clear();
  });

  afterEach(() => {
    // Clean up after each test
    progressTracker.clearAllProgress();
  });

  describe('save and restore functionality', () => {
    it('should save lesson progress', () => {
      const lessonId = 'lesson-1';
      const progress = {
        scrollPosition: 50,
        timeSpent: 120,
        completed: false
      };

      progressTracker.saveProgress(lessonId, progress);
      const loaded = progressTracker.loadProgress(lessonId);

      expect(loaded).toMatchObject(progress);
      expect(loaded.lastUpdated).toBeDefined();
    });

    it('should load all progress', () => {
      progressTracker.saveProgress('lesson-1', { scrollPosition: 25 });
      progressTracker.saveProgress('lesson-2', { scrollPosition: 75 });

      const allProgress = progressTracker.loadAllProgress();

      expect(allProgress['lesson-1']).toBeDefined();
      expect(allProgress['lesson-2']).toBeDefined();
      expect(allProgress['lesson-1'].scrollPosition).toBe(25);
      expect(allProgress['lesson-2'].scrollPosition).toBe(75);
    });

    it('should return null for non-existent lesson', () => {
      const progress = progressTracker.loadProgress('non-existent');
      expect(progress).toBeNull();
    });

    it('should update existing progress', () => {
      progressTracker.saveProgress('lesson-1', { scrollPosition: 25 });
      progressTracker.saveProgress('lesson-1', { scrollPosition: 50 });

      const loaded = progressTracker.loadProgress('lesson-1');
      expect(loaded.scrollPosition).toBe(50);
    });
  });

  describe('lesson completion', () => {
    it('should mark lesson as complete', () => {
      const lessonId = 'lesson-complete';
      const score = 85;
      const xp = 100;

      progressTracker.markLessonComplete(lessonId, score, xp);

      const progress = progressTracker.loadProgress(lessonId);
      expect(progress.completed).toBe(true);
      expect(progress.score).toBe(score);
      expect(progress.xpEarned).toBe(xp);
      expect(progress.completedAt).toBeDefined();
    });

    it('should add lesson to completed set', () => {
      progressTracker.markLessonComplete('lesson-1', 80, 50);

      const completedLessons = progressTracker.getCompletedLessons();
      expect(completedLessons.has('lesson-1')).toBe(true);
    });

    it('should update total XP', () => {
      const initialXP = progressTracker.getTotalXP();

      progressTracker.markLessonComplete('lesson-1', 80, 50);
      expect(progressTracker.getTotalXP()).toBe(initialXP + 50);

      progressTracker.markLessonComplete('lesson-2', 90, 75);
      expect(progressTracker.getTotalXP()).toBe(initialXP + 125);
    });

    it('should handle multiple completions', () => {
      progressTracker.markLessonComplete('lesson-1', 80, 50);
      progressTracker.markLessonComplete('lesson-2', 90, 75);
      progressTracker.markLessonComplete('lesson-3', 70, 60);

      const completedLessons = progressTracker.getCompletedLessons();
      expect(completedLessons.size).toBe(3);
      expect(progressTracker.getTotalXP()).toBe(185);
    });
  });

  describe('scroll position tracking', () => {
    it('should update scroll position', () => {
      progressTracker.updateScrollPosition('lesson-1', 45);

      const progress = progressTracker.loadProgress('lesson-1');
      expect(progress.scrollPosition).toBe(45);
    });

    it('should clamp scroll position to 0-100 range', () => {
      progressTracker.updateScrollPosition('lesson-1', 150);
      expect(progressTracker.loadProgress('lesson-1').scrollPosition).toBe(100);

      progressTracker.updateScrollPosition('lesson-1', -10);
      expect(progressTracker.loadProgress('lesson-1').scrollPosition).toBe(0);
    });

    it('should initialize lesson progress on first scroll', () => {
      progressTracker.updateScrollPosition('new-lesson', 10);

      const progress = progressTracker.loadProgress('new-lesson');
      expect(progress).toBeDefined();
      expect(progress.scrollPosition).toBe(10);
    });
  });

  describe('time tracking', () => {
    it('should update time spent', () => {
      progressTracker.updateTimeSpent('lesson-1', 300);

      const progress = progressTracker.loadProgress('lesson-1');
      expect(progress.timeSpent).toBe(300);
    });

    it('should allow cumulative time updates', () => {
      progressTracker.updateTimeSpent('lesson-1', 100);
      progressTracker.updateTimeSpent('lesson-1', 200);

      const progress = progressTracker.loadProgress('lesson-1');
      expect(progress.timeSpent).toBe(200);
    });
  });

  describe('lesson initialization', () => {
    it('should initialize new lesson progress', () => {
      progressTracker.initializeLessonProgress('new-lesson');

      const progress = progressTracker.loadProgress('new-lesson');
      expect(progress).toBeDefined();
      expect(progress.lessonId).toBe('new-lesson');
      expect(progress.completed).toBe(false);
      expect(progress.score).toBe(0);
      expect(progress.xpEarned).toBe(0);
      expect(progress.scrollPosition).toBe(0);
      expect(progress.timeSpent).toBe(0);
      expect(progress.startedAt).toBeDefined();
      expect(progress.completedAt).toBeNull();
    });

    it('should not overwrite existing progress on re-initialization', () => {
      progressTracker.saveProgress('existing-lesson', {
        scrollPosition: 50,
        timeSpent: 100,
        startedAt: Date.now() - 10000
      });

      progressTracker.initializeLessonProgress('existing-lesson');

      const progress = progressTracker.loadProgress('existing-lesson');
      expect(progress.scrollPosition).toBe(50);
      expect(progress.timeSpent).toBe(100);
    });
  });

  describe('category completion', () => {
    it('should calculate category completion percentage', () => {
      const lessons = [
        { id: 'lesson-1' },
        { id: 'lesson-2' },
        { id: 'lesson-3' },
        { id: 'lesson-4' }
      ];

      // Complete 2 out of 4 lessons
      progressTracker.markLessonComplete('lesson-1', 80, 50);
      progressTracker.markLessonComplete('lesson-3', 90, 75);

      const completion = progressTracker.getCategoryCompletion(lessons);
      expect(completion).toBe(50);
    });

    it('should return 0 for empty category', () => {
      const lessons = [];
      const completion = progressTracker.getCategoryCompletion(lessons);
      expect(completion).toBe(0);
    });

    it('should return 100 for fully completed category', () => {
      const lessons = [
        { id: 'lesson-1' },
        { id: 'lesson-2' }
      ];

      progressTracker.markLessonComplete('lesson-1', 80, 50);
      progressTracker.markLessonComplete('lesson-2', 90, 75);

      const completion = progressTracker.getCategoryCompletion(lessons);
      expect(completion).toBe(100);
    });

    it('should round completion percentage', () => {
      const lessons = [
        { id: 'lesson-1' },
        { id: 'lesson-2' },
        { id: 'lesson-3' }
      ];

      progressTracker.markLessonComplete('lesson-1', 80, 50);

      const completion = progressTracker.getCategoryCompletion(lessons);
      expect(completion).toBe(33); // 1/3 = 33.33 rounded to 33
    });
  });

  describe('sidebar state', () => {
    it('should save and load sidebar collapsed state', () => {
      progressTracker.saveSidebarState(true);
      expect(progressTracker.loadSidebarState()).toBe(true);

      progressTracker.saveSidebarState(false);
      expect(progressTracker.loadSidebarState()).toBe(false);
    });

    it('should return false by default for sidebar state', () => {
      const state = progressTracker.loadSidebarState();
      expect(state).toBe(false);
    });
  });

  describe('completed lessons', () => {
    it('should track completed lessons as a set', () => {
      progressTracker.markLessonComplete('lesson-1', 80, 50);
      progressTracker.markLessonComplete('lesson-2', 90, 75);

      const completedLessons = progressTracker.getCompletedLessons();
      expect(completedLessons).toBeInstanceOf(Set);
      expect(completedLessons.size).toBe(2);
      expect(completedLessons.has('lesson-1')).toBe(true);
      expect(completedLessons.has('lesson-2')).toBe(true);
    });

    it('should not duplicate completed lessons', () => {
      progressTracker.markLessonComplete('lesson-1', 80, 50);
      progressTracker.markLessonComplete('lesson-1', 85, 50); // Complete again

      const completedLessons = progressTracker.getCompletedLessons();
      expect(completedLessons.size).toBe(1);
    });
  });

  describe('total XP', () => {
    it('should start with 0 XP', () => {
      expect(progressTracker.getTotalXP()).toBe(0);
    });

    it('should accumulate XP across lessons', () => {
      progressTracker.markLessonComplete('lesson-1', 80, 50);
      expect(progressTracker.getTotalXP()).toBe(50);

      progressTracker.markLessonComplete('lesson-2', 90, 75);
      expect(progressTracker.getTotalXP()).toBe(125);

      progressTracker.markLessonComplete('lesson-3', 70, 100);
      expect(progressTracker.getTotalXP()).toBe(225);
    });
  });

  describe('clear all progress', () => {
    it('should clear all progress data', () => {
      progressTracker.saveProgress('lesson-1', { scrollPosition: 50 });
      progressTracker.markLessonComplete('lesson-2', 80, 100);

      progressTracker.clearAllProgress();

      expect(progressTracker.loadProgress('lesson-1')).toBeNull();
      expect(progressTracker.getCompletedLessons().size).toBe(0);
      expect(progressTracker.getTotalXP()).toBe(0);
    });
  });
});
