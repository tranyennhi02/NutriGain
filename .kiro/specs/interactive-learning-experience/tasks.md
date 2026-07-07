# Implementation Plan: Interactive Learning Experience

## Overview

This implementation plan transforms the NutriGain Health Education module into a fully interactive, gamified learning platform using React 18, Framer Motion animations, and localStorage for progress persistence. The system provides a two-panel interface with lesson browsing, markdown content rendering, interactive quizzes, XP rewards, and sequential lesson unlocking.

## Tasks

- [x] 1. Set up project infrastructure and core utilities
  - Install dependencies: framer-motion, lucide-react, clsx
  - Create StorageManager utility class for localStorage operations
  - Create ProgressTracker utility class for progress persistence
  - Create LessonUnlocker utility class for sequential unlocking logic
  - Create QuizValidator utility class for scoring and retry logic
  - Set up lesson data structure with categories, lessons, and quizzes
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [x]* 1.1 Write unit tests for utility classes
  - Test StorageManager save/load/remove operations
  - Test ProgressTracker save/restore functionality
  - Test LessonUnlocker sequential unlocking rules
  - Test QuizValidator score calculation and retry logic
  - _Requirements: 6.1, 6.2, 12.1, 12.2, 12.3, 12.4_

- [ ] 2. Create core layout and container component
  - [x] 2.1 Build HealthEducationView container component
    - Initialize state: selectedLesson, completedLessons, userProgress, totalXP, scrollProgress, quizState, sidebarCollapsed, categories
    - Implement handleLessonSelect with unlock validation
    - Implement handleQuizComplete with XP award and next lesson unlock
    - Implement handleScrollUpdate for progress bar
    - Implement restoreProgress to load saved state on mount
    - Create responsive two-panel layout (30% sidebar, 70% content on desktop)
    - _Requirements: 1.1, 1.3, 4.5, 8.1, 8.2_

  - [-] 2.2 Implement responsive layout breakpoints
    - Add mobile layout (< 768px): vertical stack with hidden sidebar
    - Add tablet layout (768px - 1024px): side-by-side with smaller sidebar
    - Add desktop layout (> 1024px): full side-by-side with collapse option
    - Implement auto-hide sidebar on mobile when lesson selected
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ] 3. Build LessonPanel sidebar component
  - [-] 3.1 Create LessonPanel component structure
    - Create CategoryList sub-component with expand/collapse functionality
    - Create LessonList sub-component with lesson items
    - Display lock icons for locked lessons, unlock icons for unlocked lessons
    - Display progress indicators (checkmarks, percentages) for each lesson
    - Highlight currently selected lesson with distinct visual indicator
    - Implement category expand/collapse animation (250ms height transition)
    - Add collapse button for desktop viewports
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 1.7, 6.3, 6.4, 7.6_

  - [ ] 3.2 Implement lesson unlock status display
    - Apply reduced opacity to locked lessons
    - Show tooltip on locked lesson click with unlock requirements message
    - Prevent navigation to locked lessons
    - Display first lesson in each category as unlocked by default
    - _Requirements: 1.6, 6.1, 6.3, 6.5_

  - [ ] 3.3 Implement sidebar collapse functionality
    - Add collapse button that hides sidebar with 250ms animation
    - Expand content panel to 100% width when sidebar collapsed
    - Display expand button when collapsed
    - Persist collapsed state to localStorage
    - Restore collapsed state on page reload
    - _Requirements: 8.3, 8.4, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [ ] 4. Checkpoint - Ensure sidebar navigation works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Build ContentPanel main display component
  - [-] 5.1 Create HeroSection component
    - Display lesson hero image at top
    - Display lesson title with large heading
    - Display metadata: difficulty level, duration estimate, view count, like count
    - Use lucide-react icons for metadata fields
    - Hide metadata fields when values are not available
    - _Requirements: 2.1, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

  - [ ] 5.2 Create ProgressBar component
    - Display as horizontal indicator at top of content panel
    - Implement sticky positioning to remain visible while scrolling
    - Calculate scroll percentage: (scrolled distance) / (total scrollable height) × 100
    - Update width in real-time as user scrolls
    - Animate width changes smoothly with 300ms easeInOut transition
    - Change color when scroll progress reaches 80% (quiz unlock threshold)
    - _Requirements: 2.8, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

  - [ ] 5.3 Create MarkdownRenderer component
    - Display AI-generated summary at top
    - Render list of learning objectives with proper formatting
    - Convert lesson markdown content to HTML with proper styling
    - Display embedded images and infographics within content
    - Render key takeaways section after main content
    - Enable vertical scrolling when content exceeds viewport height
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ] 5.4 Implement lesson transition animations
    - Add fade-out animation for old content (200ms)
    - Add slide-in animation for new content (400ms with easeOut)
    - Use Framer Motion initial/animate/exit states
    - Target 60fps animation performance
    - _Requirements: 7.1, 7.5_

- [ ] 6. Build QuizSection component
  - [ ] 6.1 Create quiz UI and question display
    - Display quiz button that unlocks when scroll progress reaches 80%
    - Implement scale-up animation (0.95 to 1 over 300ms) when quiz unlocks
    - Display all quiz questions with 4 multiple-choice options each
    - Ensure minimum 2 questions per lesson
    - Add visual styling for question and answer options
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 7.2_

  - [ ] 6.2 Implement quiz interaction and feedback
    - Capture user answer selection for each question
    - Provide immediate visual feedback on answer selection
    - Calculate score as percentage of correct answers
    - Display explanations for each answer after submission
    - Show quiz results with score percentage
    - _Requirements: 3.5, 3.6, 3.10_

  - [ ] 6.3 Implement quiz validation and retry logic
    - Mark lesson as completed when score ≥ 70%
    - Award designated XP amount on passing score
    - Allow up to 3 total attempts for failed quizzes
    - Lock quiz for 1 hour after 3 failed attempts
    - Display remaining time until retry available when locked
    - Persist attempt count and lock timestamp to localStorage
    - Reset attempt counter after 1 hour or successful pass
    - _Requirements: 3.7, 3.8, 3.9, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ]* 6.4 Write unit tests for quiz functionality
  - Test score calculation with various answer combinations
  - Test passing score threshold (70%)
  - Test attempt counter increment
  - Test quiz lock after 3 failed attempts
  - Test unlock after 1 hour cooldown
  - _Requirements: 3.6, 3.7, 3.8, 12.1, 12.2, 12.3, 12.4_

- [ ] 7. Implement progress tracking and persistence
  - [ ] 7.1 Integrate ProgressTracker with lesson reading
    - Save current reading position every 5 seconds (debounced)
    - Save time spent on each lesson
    - Track startedAt timestamp when lesson first opened
    - Update scroll position continuously as user scrolls
    - _Requirements: 4.1, 4.2, 4.8_

  - [ ] 7.2 Implement completion tracking
    - Mark lesson as completed when quiz passed
    - Save completedAt timestamp on lesson completion
    - Unlock next lesson in category sequence
    - Calculate and update category completion percentages
    - Persist all completion data to localStorage
    - _Requirements: 4.3, 4.4, 4.6, 4.7, 6.2_

  - [ ] 7.3 Implement progress restoration on page load
    - Load saved progress data from localStorage on mount
    - Restore completed lessons set
    - Restore user progress map with reading positions
    - Restore total XP earned
    - Restore sidebar collapsed state
    - _Requirements: 4.5, 14.6_

- [ ]* 7.4 Write integration tests for progress tracking
  - Test progress save every 5 seconds
  - Test lesson completion persistence
  - Test progress restoration on page reload
  - Test category completion percentage calculation
  - _Requirements: 4.1, 4.3, 4.5, 4.6_

- [ ] 8. Build XP reward and gamification system
  - [ ] 8.1 Create FloatingXPCounter component
    - Display fixed position counter in top-right corner
    - Show current XP total with animated progress bar
    - Calculate and display user level based on XP
    - Show XP required to reach next level
    - Implement minimizable/expandable functionality
    - Animate XP updates smoothly over 200ms
    - _Requirements: 5.4, 5.5_

  - [ ] 8.2 Implement XP award on lesson completion
    - Award lesson's designated XP amount when quiz passed
    - Display XP award immediately after quiz completion
    - Update total XP display within 200ms
    - Save earned XP to localStorage via ProgressTracker
    - Maintain cumulative XP total across all completed lessons
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 8.3 Create CompletionAnimation component
    - Display confetti particle animation (1000ms, 100 particles, 70° spread)
    - Display trophy icon with scale-up animation (0 to 1 over 600ms with spring bounce)
    - Display XP award with scale pulse animation (1 → 1.2 → 1 over 200ms)
    - Trigger celebration animation on lesson completion
    - _Requirements: 7.4_

- [ ] 9. Implement next lesson recommendation
  - [ ] 9.1 Create NextLessonRecommendation component
    - Display recommendation card below completion animation
    - Show next lesson title, difficulty, and duration estimate
    - Implement click handler to navigate to recommended lesson
    - Use standard transition animation when navigating
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ] 9.2 Implement recommendation logic
    - Recommend next lesson in current category sequence
    - Recommend first lesson of next category when current category complete
    - Display congratulatory message when all lessons completed
    - _Requirements: 10.4, 10.5_

- [ ] 10. Checkpoint - Ensure core learning flow works end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement accessibility features
  - [ ] 11.1 Add keyboard navigation support
    - Enable Tab/Shift+Tab navigation through all interactive elements
    - Enable Enter key to activate buttons and select lessons
    - Enable Space key to select quiz answers
    - Enable Arrow Up/Down to navigate between lessons in list
    - Enable Arrow Left/Right to navigate between quiz options
    - Enable Escape key to close modals and collapse sidebar
    - Maintain logical tab order: lesson panel → content panel → quiz → recommendation
    - _Requirements: 9.1, 9.5_

  - [ ] 11.2 Add screen reader support
    - Add ARIA labels to all interactive components (buttons, lessons, quiz options)
    - Add role="progressbar" with aria-valuenow/min/max to progress bar
    - Add aria-live="polite" regions for quiz feedback and XP updates
    - Add aria-live="assertive" region for lesson completion announcements
    - Ensure focus moves to content panel when lesson selected
    - Implement visible focus indicators with 2px outline and high contrast
    - _Requirements: 9.2, 9.3, 9.6_

  - [ ] 11.3 Ensure color contrast and visual accessibility
    - Verify normal text contrast ratio ≥ 4.5:1 (WCAG AA)
    - Verify large text (18pt+) contrast ratio ≥ 3:1 (WCAG AA)
    - Verify interactive elements contrast ≥ 3:1 against background
    - Implement visible focus indicators (2px outline with 2px offset)
    - Ensure touch targets minimum 44x44 pixels on mobile
    - _Requirements: 8.5, 9.4_

  - [ ] 11.4 Add reduced motion support
    - Detect prefers-reduced-motion media query
    - Disable animations when user prefers reduced motion
    - Use instant transitions instead of animated transitions
    - Keep functionality intact without animations
    - _Requirements: 7.5_

- [ ]* 11.5 Write integration tests for accessibility
  - Test keyboard navigation through all interactive elements
  - Test ARIA labels present on all components
  - Test focus management when navigating between lessons
  - Test reduced motion preference disables animations
  - _Requirements: 9.1, 9.2, 9.3, 9.5_

- [ ] 12. Implement animation polish
  - [ ] 12.1 Add Framer Motion to all transitions
    - Apply fade-slide animation to lesson content changes
    - Apply scale-up animation to quiz unlock
    - Apply smooth width animation to progress bar updates
    - Apply height animation to category expand/collapse
    - Apply XP counter pulse animation on updates
    - Ensure all animations use appropriate easing curves
    - _Requirements: 7.1, 7.2, 7.3, 7.6_

  - [ ] 12.2 Optimize animation performance
    - Use GPU-accelerated properties (transform, opacity)
    - Implement debouncing for scroll events (100ms)
    - Use will-change CSS property for animated elements
    - Target 60fps on modern browsers, 30fps minimum on older devices
    - _Requirements: 7.5_

- [ ] 13. Add error handling and validation
  - [ ] 13.1 Implement data validation
    - Validate lesson data structure before rendering
    - Validate required properties exist (id, title, content, quiz)
    - Skip invalid lessons and log warnings
    - Show placeholder for invalid lessons
    - _Requirements: 11.6_

  - [ ] 13.2 Implement error boundaries
    - Create ErrorBoundary component for lesson content
    - Display error fallback UI with retry button
    - Log errors to console for debugging
    - Show user-friendly error messages in Vietnamese
    - _Requirements: N/A (error handling best practice)_

  - [ ] 13.3 Handle storage errors
    - Detect localStorage unavailable or full
    - Fall back to in-memory storage when localStorage fails
    - Warn user about lost progress when storage unavailable
    - Continue functionality without persistence as fallback
    - _Requirements: 4.7_

  - [ ] 13.4 Add quiz validation
    - Disable submit button when not all questions answered
    - Show validation message when submission incomplete
    - Validate quiz data structure before rendering
    - _Requirements: 3.6_

- [ ] 14. Performance optimization
  - [ ] 14.1 Implement React performance optimizations
    - Use React.memo() for MarkdownRenderer component
    - Use useMemo() for category completion percentages
    - Use useCallback() for event handlers passed to children
    - Lazy load lesson content when selected (not all upfront)
    - _Requirements: N/A (performance best practice)_

  - [ ] 14.2 Optimize storage and rendering
    - Debounce progress saves to 5 seconds
    - Batch related state updates to minimize re-renders
    - Implement lazy loading for images with loading="lazy"
    - Use CSS containment for isolated components
    - _Requirements: 4.1_

- [ ]* 14.3 Write performance tests
  - Test animation maintains 60fps
  - Test scroll event debouncing reduces re-renders
  - Test localStorage write frequency with debouncing
  - Measure Time to Interactive (TTI) < 3 seconds
  - _Requirements: N/A (performance monitoring)_

- [ ] 15. Final integration and polish
  - [ ] 15.1 Wire all components together
    - Connect LessonPanel to HealthEducationView state
    - Connect ContentPanel to lesson data and quiz state
    - Connect FloatingXPCounter to total XP state
    - Connect CompletionAnimation to lesson completion events
    - Connect NextLessonRecommendation to navigation handler
    - Verify data flows correctly through entire component tree
    - _Requirements: All requirements_

  - [ ] 15.2 Final testing and validation
    - Test complete lesson flow: browse → select → read → scroll → quiz → complete → next
    - Test progress persistence across page reloads
    - Test quiz retry mechanism with multiple attempts
    - Test responsive layout on desktop, tablet, and mobile viewports
    - Test keyboard navigation and screen reader support
    - Test all animations and transitions
    - _Requirements: All requirements_

- [ ] 16. Final checkpoint - Ensure all features work correctly
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Unit tests validate core business logic (validators, trackers, storage)
- Integration tests validate complete user flows and persistence
- The implementation uses React 18 with functional components and hooks
- Framer Motion handles all animations with GPU acceleration
- localStorage provides progress persistence without backend integration
- Tailwind CSS provides utility-first styling with custom design system

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "2.2"] },
    { "id": 2, "tasks": ["3.1", "5.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "5.2", "5.3"] },
    { "id": 4, "tasks": ["5.4", "6.1"] },
    { "id": 5, "tasks": ["6.2", "7.1"] },
    { "id": 6, "tasks": ["6.3", "6.4", "7.2"] },
    { "id": 7, "tasks": ["7.3", "7.4", "8.1"] },
    { "id": 8, "tasks": ["8.2", "9.1"] },
    { "id": 9, "tasks": ["8.3", "9.2", "11.1"] },
    { "id": 10, "tasks": ["11.2", "11.3", "11.4"] },
    { "id": 11, "tasks": ["11.5", "12.1"] },
    { "id": 12, "tasks": ["12.2", "13.1"] },
    { "id": 13, "tasks": ["13.2", "13.3", "13.4"] },
    { "id": 14, "tasks": ["14.1", "14.2"] },
    { "id": 15, "tasks": ["14.3", "15.1"] },
    { "id": 16, "tasks": ["15.2"] }
  ]
}
```
