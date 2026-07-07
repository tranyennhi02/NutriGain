/**
 * Unit Tests for HealthEducationView - Task 2.2 Responsive Layout
 * 
 * Tests responsive layout breakpoints:
 * - Mobile (<768px): Vertical stack with hidden sidebar
 * - Tablet (768px-1024px): Side-by-side with smaller sidebar
 * - Desktop (>1024px): Full side-by-side with collapse option
 * - Auto-hide sidebar on mobile when lesson selected
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HealthEducationView from './HealthEducationView';

// Mock the utilities
vi.mock('../utils/learning/ProgressTracker.js', () => ({
  default: {
    getCompletedLessons: () => new Set(),
    loadAllProgress: () => ({}),
    getTotalXP: () => 0,
    loadSidebarState: () => false,
    initializeLessonProgress: vi.fn(),
    updateScrollPosition: vi.fn(),
    markLessonComplete: vi.fn(),
    saveSidebarState: vi.fn(),
  }
}));

vi.mock('../utils/learning/LessonUnlocker.js', () => ({
  default: {
    isLessonUnlocked: () => true,
    getUnlockRequirements: () => '',
    unlockNextLesson: () => null,
  }
}));

vi.mock('../utils/learning/QuizValidator.js', () => ({
  default: {
    getAttemptCount: () => 0,
    getLockTimestamp: () => null,
    isPassingScore: (score) => score >= 70,
    incrementAttempt: vi.fn(() => 1),
    resetAttempts: vi.fn(),
  }
}));

vi.mock('../data/lessonData.js', () => ({
  categories: [
    {
      id: 'nutrition',
      name: 'Nutrition Basics',
      icon: 'Apple',
      color: 'emerald',
      lessons: [
        {
          id: 'intro-nutrition',
          title: 'Introduction to Nutrition',
          category: 'nutrition',
          difficulty: 'Beginner',
          duration: 15,
          xp: 50,
          heroImage: '/images/nutrition.jpg',
          summary: 'Learn the basics',
          objectives: ['Understand nutrients'],
          content: [{ type: 'text', content: 'Content here' }],
          takeaways: ['Key point 1'],
          quiz: [
            {
              id: 'q1',
              questionText: 'What is a nutrient?',
              options: ['A', 'B', 'C', 'D'],
              correctAnswerIndex: 0,
              explanation: 'Explanation here'
            }
          ],
          metadata: { views: 100, likes: 50 },
          locked: false,
          completed: false,
          progress: 0
        }
      ]
    }
  ]
}));

// Helper to wrap component
const renderComponent = (component) => {
  return render(component);
};

describe('HealthEducationView - Responsive Layout (Task 2.2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Desktop Layout (>1024px)', () => {
    beforeEach(() => {
      // Mock window width for desktop
      global.innerWidth = 1280;
      global.dispatchEvent(new Event('resize'));
    });

    it('should render two-panel layout with 30% sidebar and 70% content', () => {
      const { container } = renderComponent(<HealthEducationView />);
      
      // Check grid layout class for desktop
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeTruthy();
      expect(gridContainer.className).toContain('lg:grid-cols-[30%_70%]');
    });

    it('should display collapse button on desktop', () => {
      renderComponent(<HealthEducationView />);
      
      // Find collapse button (should have aria-label "Collapse sidebar")
      const collapseButton = screen.getByLabelText('Collapse sidebar');
      expect(collapseButton).toBeTruthy();
      expect(collapseButton.className).toContain('lg:block');
    });

    it('should collapse sidebar when collapse button is clicked', async () => {
      const { container } = renderComponent(<HealthEducationView />);
      
      const collapseButton = screen.getByLabelText('Collapse sidebar');
      fireEvent.click(collapseButton);
      
      await waitFor(() => {
        const gridContainer = container.querySelector('.grid');
        expect(gridContainer.className).toContain('lg:grid-cols-[0px_1fr]');
      });
    });

    it('should show expand button when sidebar is collapsed', async () => {
      renderComponent(<HealthEducationView />);
      
      const collapseButton = screen.getByLabelText('Collapse sidebar');
      fireEvent.click(collapseButton);
      
      await waitFor(() => {
        const expandButton = screen.getByLabelText('Expand sidebar');
        expect(expandButton).toBeTruthy();
      });
    });

    it('should expand sidebar when expand button is clicked', async () => {
      const { container } = renderComponent(<HealthEducationView />);
      
      // Collapse first
      const collapseButton = screen.getByLabelText('Collapse sidebar');
      fireEvent.click(collapseButton);
      
      await waitFor(() => {
        const expandButton = screen.getByLabelText('Expand sidebar');
        fireEvent.click(expandButton);
      });
      
      await waitFor(() => {
        const gridContainer = container.querySelector('.grid');
        expect(gridContainer.className).toContain('lg:grid-cols-[30%_70%]');
      });
    });
  });

  describe('Tablet Layout (768px-1024px)', () => {
    beforeEach(() => {
      // Mock window width for tablet
      global.innerWidth = 800;
      global.dispatchEvent(new Event('resize'));
    });

    it('should render side-by-side layout with 25% sidebar and 75% content', () => {
      const { container } = renderComponent(<HealthEducationView />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeTruthy();
      expect(gridContainer.className).toContain('md:grid-cols-[25%_75%]');
    });

    it('should show sidebar and content panel side by side', () => {
      renderComponent(<HealthEducationView />);
      
      // Both panels should be visible
      expect(screen.getByText('Bài học')).toBeTruthy();
      expect(screen.getByText('Nội dung bài học')).toBeTruthy();
    });
  });

  describe('Mobile Layout (<768px)', () => {
    beforeEach(() => {
      // Mock window width for mobile
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));
    });

    it('should render vertical stack layout', () => {
      const { container } = renderComponent(<HealthEducationView />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer.className).toContain('grid-cols-1');
    });

    it('should show sidebar by default on mobile', () => {
      renderComponent(<HealthEducationView />);
      
      expect(screen.getByText('Bài học')).toBeTruthy();
      expect(screen.getByText('Tiến độ của bạn')).toBeTruthy();
    });

    it('should auto-hide sidebar when lesson is selected on mobile', async () => {
      renderComponent(<HealthEducationView />);
      
      // Select a lesson
      const selectButton = screen.getByText('📚 Chọn bài học đầu tiên');
      fireEvent.click(selectButton);
      
      await waitFor(() => {
        // Sidebar container should have hidden class on mobile
        const sidebarContainer = screen.queryByText('Bài học')?.closest('.rounded-2xl')?.parentElement;
        expect(sidebarContainer?.className).toContain('hidden md:block');
      });
    });

    it('should show back button when lesson is selected on mobile', async () => {
      renderComponent(<HealthEducationView />);
      
      // Select a lesson
      const selectButton = screen.getByText('📚 Chọn bài học đầu tiên');
      fireEvent.click(selectButton);
      
      await waitFor(() => {
        const backButton = screen.getByText('Quay lại danh sách');
        expect(backButton).toBeTruthy();
        expect(backButton.className).toContain('md:hidden');
      });
    });

    it('should show sidebar again when back button is clicked', async () => {
      renderComponent(<HealthEducationView />);
      
      // Select a lesson
      const selectButton = screen.getByText('📚 Chọn bài học đầu tiên');
      fireEvent.click(selectButton);
      
      await waitFor(() => {
        const backButton = screen.getByText('Quay lại danh sách');
        fireEvent.click(backButton);
      });
      
      await waitFor(() => {
        // Sidebar should be visible again
        const sidebar = screen.queryByText('Bài học');
        const sidebarParent = sidebar?.closest('div');
        expect(sidebarParent?.className).not.toContain('hidden');
      });
    });

    it('should not show collapse button on mobile', () => {
      renderComponent(<HealthEducationView />);
      
      const collapseButton = screen.queryByLabelText('Collapse sidebar');
      // Button exists but should have lg:block class (hidden on mobile)
      expect(collapseButton?.className).toContain('lg:block');
      expect(collapseButton?.className).toContain('hidden');
    });
  });

  describe('Touch-Friendly Targets (Mobile)', () => {
    beforeEach(() => {
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));
    });

    it('should render buttons with adequate size for touch', () => {
      renderComponent(<HealthEducationView />);
      
      const selectButton = screen.getByText('📚 Chọn bài học đầu tiên');
      
      // Check that button has proper padding for touch targets (min 44x44px)
      const styles = window.getComputedStyle(selectButton);
      expect(selectButton.className).toContain('px-4');
      expect(selectButton.className).toContain('py-2');
    });
  });

  describe('State Persistence', () => {
    it('should persist sidebar collapsed state', async () => {
      const mockSaveSidebarState = vi.fn();
      const progressTracker = await import('../utils/learning/ProgressTracker.js');
      progressTracker.default.saveSidebarState = mockSaveSidebarState;
      
      renderComponent(<HealthEducationView />);
      
      const collapseButton = screen.getByLabelText('Collapse sidebar');
      fireEvent.click(collapseButton);
      
      await waitFor(() => {
        expect(mockSaveSidebarState).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('Responsive Breakpoint Classes', () => {
    it('should have correct responsive classes for all breakpoints', () => {
      const { container } = renderComponent(<HealthEducationView />);
      
      const gridContainer = container.querySelector('.grid');
      const classes = gridContainer.className;
      
      // Mobile: grid-cols-1
      expect(classes).toContain('grid-cols-1');
      
      // Tablet: md:grid-cols-[25%_75%]
      expect(classes).toContain('md:grid-cols-[25%_75%]');
      
      // Desktop: lg:grid-cols-[30%_70%]
      expect(classes).toContain('lg:grid-cols-[30%_70%]');
    });
  });
});

