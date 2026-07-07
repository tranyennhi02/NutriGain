# Design Document: Interactive Learning Experience

## Overview

The Interactive Learning Experience transforms the NutriGain Health Education module into a fully interactive, gamified learning platform. The system provides a two-panel interface where users can browse lessons in a sidebar, read full content with markdown rendering, complete quizzes with immediate feedback, and track their progress with XP rewards and sequential unlocking.

### Key Design Goals

1. **Seamless Learning Experience**: Modern e-learning interface similar to Coursera, Udemy, and Duolingo
2. **Gamification**: XP rewards, progress tracking, and achievement animations to motivate learning
3. **Progressive Disclosure**: Sequential lesson unlocking ensures structured learning paths
4. **Responsive Design**: Optimized for desktop and mobile with adaptive layouts
5. **Accessibility**: Full keyboard navigation and screen reader support
6. **Performance**: Smooth 60fps animations and efficient state management

### Technology Stack

- **Frontend Framework**: React 18 with functional components and hooks
- **Animation**: Framer Motion for transitions, micro-interactions, and confetti effects
- **Styling**: Tailwind CSS for utility-first styling with custom design system
- **Storage**: Browser localStorage for progress persistence
- **Markdown**: Custom markdown renderer for lesson content
- **Testing**: Vitest with React Testing Library for unit tests

## Architecture

### High-Level Architecture

The system follows a component-based architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                   HealthEducationView (Container)               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  State Management (useState, useEffect)                    │  │
│  │  - selectedLesson, completedLessons, userProgress,        │  │
│  │    totalXP, scrollProgress, quizState                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────┐  ┌────────────────────────────────┐  │
│  │   LessonPanel        │  │      ContentPanel              │  │
│  │   (30% width)        │  │      (70% width)               │  │
│  │                      │  │                                │  │
│  │  ┌────────────────┐  │  │  ┌──────────────────────────┐  │  │
│  │  │ CategoryList   │  │  │  │  HeroSection             │  │  │
│  │  │  - Collapse    │  │  │  │   - Title, metadata      │  │  │
│  │  │  - Expand      │  │  │  └──────────────────────────┘  │  │
│  │  └────────────────┘  │  │  ┌──────────────────────────┐  │  │
│  │  ┌────────────────┐  │  │  │  ProgressBar (sticky)    │  │  │
│  │  │ LessonList     │  │  │  └──────────────────────────┘  │  │
│  │  │  - Lock icons  │  │  │  ┌──────────────────────────┐  │  │
│  │  │  - Progress    │  │  │  │  MarkdownContent         │  │  │
│  │  │  - Highlight   │  │  │  │   - Objectives           │  │  │
│  │  └────────────────┘  │  │  │   - Content sections     │  │  │
│  └──────────────────────┘  │  │   - Takeaways            │  │  │
│                             │  └──────────────────────────┘  │  │
│                             │  ┌──────────────────────────┐  │  │
│                             │  │  QuizSection             │  │  │
│                             │  │   - Questions            │  │  │
│                             │  │   - Immediate feedback   │  │  │
│                             │  │   - Score calculation    │  │  │
│                             │  └──────────────────────────┘  │  │
│                             └────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │            Supporting Components                           │  │
│  │  - FloatingXPCounter                                      │  │
│  │  - CompletionAnimation (confetti + trophy)                │  │
│  │  - NextLessonRecommendation                               │  │
│  │  - AnimationEngine (Framer Motion wrappers)               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │            Utility Layers                                  │  │
│  │  - ProgressTracker (save/restore progress)                │  │
│  │  - StorageManager (localStorage abstraction)              │  │
│  │  - LessonUnlocker (sequential unlocking logic)            │  │
│  │  - QuizValidator (scoring and retry logic)                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Initial Load**: StorageManager loads saved progress → ProgressTracker restores state → UI renders
2. **Lesson Selection**: User clicks lesson → LessonPanel validates unlock status → ContentPanel loads lesson data
3. **Scroll Tracking**: User scrolls content → ProgressBar updates → ProgressTracker saves position every 5s
4. **Quiz Flow**: User completes scroll → Quiz unlocks → User submits answers → QuizValidator scores → XP awarded → Next lesson unlocked → ProgressTracker saves
5. **Persistence**: All state changes trigger StorageManager saves to localStorage

## Components and Interfaces

### Core Components

#### 1. HealthEducationView (Container)
**Purpose**: Top-level container managing global state and layout

**State**:
```typescript
interface HealthEducationState {
  selectedLesson: string | null;
  completedLessons: Set<string>;
  userProgress: Map<string, LessonProgress>;
  totalXP: number;
  scrollProgress: number;
  quizState: QuizState;
  sidebarCollapsed: boolean;
  categories: Category[];
}
```

**Key Methods**:
- `handleLessonSelect(lessonId: string)`: Validates unlock status and loads lesson
- `handleQuizComplete(score: number)`: Awards XP, unlocks next lesson, saves progress
- `handleScrollUpdate(progress: number)`: Updates progress bar and unlocks quiz
- `restoreProgress()`: Loads saved state from localStorage on mount

#### 2. LessonPanel
**Purpose**: Left sidebar displaying categories and lessons

**Props**:
```typescript
interface LessonPanelProps {
  categories: Category[];
  selectedLesson: string | null;
  completedLessons: Set<string>;
  onLessonSelect: (lessonId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}
```

**Features**:
- Expandable/collapsible categories
- Lock/unlock icons based on lesson state
- Progress indicators (checkmarks, percentages)
- Highlighted current lesson
- Tooltip on locked lessons
- Smooth expand/collapse animations (250ms)

#### 3. ContentPanel
**Purpose**: Right panel displaying lesson content and quiz

**Props**:
```typescript
interface ContentPanelProps {
  lesson: Lesson | null;
  scrollProgress: number;
  quizState: QuizState;
  onScrollUpdate: (progress: number) => void;
  onQuizSubmit: (answers: Answer[]) => void;
}
```

**Sub-components**:
- HeroSection: Title, metadata (difficulty, duration, views, likes)
- ProgressBar: Sticky scroll indicator
- MarkdownRenderer: Converts markdown to HTML
- QuizSection: Questions, answers, feedback

#### 4. QuizSection
**Purpose**: Interactive quiz with immediate feedback

**Props**:
```typescript
interface QuizSectionProps {
  questions: Question[];
  unlocked: boolean;
  attempts: number;
  lockedUntil: number | null;
  onSubmit: (answers: Answer[]) => void;
}
```

**Features**:
- Scale-up animation on unlock (0.95 → 1 over 300ms)
- Visual feedback on answer selection
- Explanations after submission
- Retry mechanism (max 3 attempts)
- 1-hour cooldown after 3 failed attempts
- Score calculation and passing threshold (70%)

#### 5. FloatingXPCounter
**Purpose**: Persistent XP display with level tracking

**Props**:
```typescript
interface FloatingXPCounterProps {
  totalXP: number;
  level: number;
  xpToNextLevel: number;
}
```

**Features**:
- Fixed position (top-right)
- Minimizable/expandable
- Animated progress bar
- Level-up celebration animation
- Smooth XP updates (200ms)

#### 6. CompletionAnimation
**Purpose**: Celebration animation on lesson completion

**Features**:
- Confetti particle animation (1000ms)
- Trophy icon scale-up
- XP award display
- Next lesson recommendation card

### Utility Components

#### ProgressTracker
**Purpose**: Manages and persists user learning progress

**Interface**:
```typescript
class ProgressTracker {
  saveProgress(lessonId: string, progress: LessonProgress): void;
  loadProgress(): Map<string, LessonProgress>;
  markLessonComplete(lessonId: string, score: number, xp: number): void;
  updateScrollPosition(lessonId: string, position: number): void;
  getCompletedLessons(): Set<string>;
  getTotalXP(): number;
}
```

**Behavior**:
- Saves scroll position every 5 seconds (debounced)
- Updates completion status immediately on quiz pass
- Tracks startedAt and completedAt timestamps
- Calculates category completion percentages

#### StorageManager
**Purpose**: Abstraction layer for localStorage operations

**Interface**:
```typescript
class StorageManager {
  save(key: string, value: any): void;
  load<T>(key: string): T | null;
  remove(key: string): void;
  clear(): void;
}
```

**Keys**:
- `nutrigain_lesson_progress`: Map of lesson progress
- `nutrigain_completed_lessons`: Set of completed lesson IDs
- `nutrigain_total_xp`: User's cumulative XP
- `nutrigain_sidebar_collapsed`: Sidebar state
- `nutrigain_quiz_attempts`: Map of quiz attempt counters
- `nutrigain_quiz_locks`: Map of quiz lock timestamps

#### LessonUnlocker
**Purpose**: Manages sequential lesson unlocking logic

**Interface**:
```typescript
class LessonUnlocker {
  isLessonUnlocked(lessonId: string, completedLessons: Set<string>): boolean;
  unlockNextLesson(currentLessonId: string, categories: Category[]): string | null;
  getUnlockRequirements(lessonId: string): string;
}
```

**Logic**:
- First lesson in each category is unlocked by default
- Lessons unlock sequentially within the same category
- Returns unlock requirements message for locked lessons

#### QuizValidator
**Purpose**: Validates quiz answers and manages retry logic

**Interface**:
```typescript
class QuizValidator {
  calculateScore(questions: Question[], answers: Answer[]): number;
  isPassingScore(score: number): boolean;
  canRetry(attempts: number, lockedUntil: number | null): boolean;
  getRemainingLockTime(lockedUntil: number): number;
  incrementAttempt(lessonId: string): number;
  lockQuiz(lessonId: string): number; // Returns unlock timestamp
}
```

**Rules**:
- Passing score: 70% or higher
- Max attempts: 3
- Lock duration: 1 hour (3600000ms)
- Attempt counter resets after successful pass or lock expiration

## Data Models

### Lesson
```typescript
interface Lesson {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // minutes
  xp: number;
  heroImage: string;
  summary: string;
  objectives: string[];
  content: ContentSection[];
  takeaways: string[];
  quiz: Question[];
  metadata: {
    views: number;
    likes: number;
  };
  locked: boolean;
  completed: boolean;
  progress: number; // 0-100
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  icon: string; // Icon component name from lucide-react
  color: string; // Tailwind color class
  lessons: Lesson[];
  expanded: boolean;
}
```

### ContentSection
```typescript
interface ContentSection {
  type: 'text' | 'heading' | 'list' | 'image' | 'infographic';
  content: string | string[];
  markdown?: boolean;
}
```

### Question
```typescript
interface Question {
  id: string;
  questionText: string;
  options: string[]; // Always 4 options
  correctAnswerIndex: number; // 0-3
  explanation: string;
}
```

### LessonProgress
```typescript
interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number; // 0-100
  xpEarned: number;
  scrollPosition: number; // 0-100
  timeSpent: number; // seconds
  startedAt: number; // timestamp
  completedAt: number | null; // timestamp
}
```

### QuizState
```typescript
interface QuizState {
  lessonId: string | null;
  unlocked: boolean;
  attempts: number;
  lockedUntil: number | null; // timestamp
  selectedAnswers: Map<string, number>; // questionId -> selectedIndex
  submitted: boolean;
  score: number;
}
```

### Answer
```typescript
interface Answer {
  questionId: string;
  selectedIndex: number;
}
```

## Error Handling

### Error Categories

1. **Data Loading Errors**
   - **Scenario**: Lesson data fails to load or is malformed
   - **Handling**: Display error boundary with retry button, log error to console
   - **User Message**: "Không thể tải bài học. Vui lòng thử lại."

2. **Storage Errors**
   - **Scenario**: localStorage is full or unavailable
   - **Handling**: Fall back to in-memory storage, warn user about lost progress
   - **User Message**: "Không thể lưu tiến độ. Dữ liệu có thể bị mất khi đóng trang."

3. **Validation Errors**
   - **Scenario**: Invalid lesson data structure
   - **Handling**: Skip invalid lessons, log warnings, show placeholder
   - **User Message**: None (silent degradation)

4. **Quiz Submission Errors**
   - **Scenario**: Quiz data is incomplete or corrupted
   - **Handling**: Disable submit button, show validation message
   - **User Message**: "Vui lòng trả lời tất cả câu hỏi."

5. **Animation Errors**
   - **Scenario**: Framer Motion animation fails on older browsers
   - **Handling**: Gracefully degrade to instant transitions, no animations
   - **User Message**: None (silent degradation)

### Error Handling Patterns

**Try-Catch Blocks**:
```javascript
try {
  const progress = storageManager.load('nutrigain_lesson_progress');
  // Process progress
} catch (error) {
  console.error('Failed to load progress:', error);
  // Use default empty state
}
```

**Error Boundaries**:
```jsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <LessonContent />
</ErrorBoundary>
```

**Validation Guards**:
```javascript
function isValidLesson(lesson) {
  return (
    lesson?.id &&
    lesson?.title &&
    Array.isArray(lesson?.content) &&
    Array.isArray(lesson?.quiz)
  );
}
```

**Graceful Degradation**:
- Missing metadata fields → Hide instead of showing null/zero
- Animation failures → Skip animation, show final state
- Storage unavailable → Use in-memory state only

## Testing Strategy

### Testing Approach

This feature is primarily UI-focused with interactive components, animations, and state management. The testing strategy emphasizes **example-based unit tests** and **integration tests** rather than property-based tests, as the requirements involve specific UI behaviors, user interactions, and visual feedback that don't benefit from randomized input generation.

**Why Property-Based Testing Is Not Applicable Here**:

1. **UI Rendering**: Requirements like hero section display, lesson panels, and progress bars test specific visual layouts, not universal properties across inputs
2. **User Interactions**: Click handlers, scroll tracking, and keyboard navigation test concrete user actions with expected outcomes
3. **Animations**: Framer Motion transitions, confetti effects, and scale animations are time-based visual effects with specific durations
4. **State Management**: React state updates, localStorage persistence, and component re-renders are deterministic given specific actions
5. **One-Time Setup**: Many requirements test initial render states or configuration that don't vary with input

### Unit Testing

**Testing Framework**: Vitest with React Testing Library

**Test Coverage Areas**:

1. **Component Rendering**
   - Verify components render with correct props
   - Test conditional rendering (locked vs unlocked lessons)
   - Verify correct icons and labels display
   - Test empty states and loading states

2. **User Interactions**
   - Click events trigger correct handlers
   - Form submissions work correctly
   - Keyboard navigation functions properly
   - Hover states and focus indicators appear

3. **State Management**
   - State updates correctly on actions
   - localStorage reads and writes work
   - Progress tracking saves at correct intervals
   - Quiz state transitions correctly

4. **Business Logic**
   - Score calculation produces correct percentages
   - Lesson unlocking follows sequential order
   - XP awards match lesson completion
   - Retry limits enforce correctly

5. **Edge Cases**
   - Empty quiz arrays handled gracefully
   - Missing metadata doesn't break UI
   - First lesson always unlocked
   - Last lesson shows completion message

**Example Unit Tests**:

```javascript
describe('QuizValidator', () => {
  it('calculates score correctly', () => {
    const questions = [
      { correctAnswerIndex: 0 },
      { correctAnswerIndex: 1 },
      { correctAnswerIndex: 2 },
      { correctAnswerIndex: 3 }
    ];
    const answers = [
      { selectedIndex: 0 }, // correct
      { selectedIndex: 1 }, // correct
      { selectedIndex: 0 }, // incorrect
      { selectedIndex: 3 }  // correct
    ];
    expect(calculateScore(questions, answers)).toBe(75);
  });

  it('identifies passing score', () => {
    expect(isPassingScore(70)).toBe(true);
    expect(isPassingScore(69)).toBe(false);
  });

  it('locks quiz after 3 failed attempts', () => {
    const validator = new QuizValidator();
    validator.incrementAttempt('lesson-1'); // 1
    validator.incrementAttempt('lesson-1'); // 2
    const lockTime = validator.incrementAttempt('lesson-1'); // 3
    expect(lockTime).toBeGreaterThan(Date.now());
  });
});

describe('LessonUnlocker', () => {
  it('unlocks first lesson in each category by default', () => {
    const categories = [
      { id: 'cat1', lessons: [{ id: 'lesson1' }, { id: 'lesson2' }] }
    ];
    const unlocker = new LessonUnlocker(categories);
    expect(unlocker.isLessonUnlocked('lesson1', new Set())).toBe(true);
    expect(unlocker.isLessonUnlocked('lesson2', new Set())).toBe(false);
  });

  it('unlocks next lesson after completing current', () => {
    const categories = [
      { id: 'cat1', lessons: [{ id: 'lesson1' }, { id: 'lesson2' }] }
    ];
    const unlocker = new LessonUnlocker(categories);
    const completed = new Set(['lesson1']);
    expect(unlocker.isLessonUnlocked('lesson2', completed)).toBe(true);
  });
});
```


### Integration Testing

**Test Scenarios**:

1. **End-to-End Lesson Flow**
   - User selects lesson → Content loads → User scrolls → Quiz unlocks → User completes quiz → XP awarded → Next lesson unlocks

2. **Progress Persistence**
   - Complete lesson → Reload page → Verify progress restored → Verify completed status persists

3. **Multi-Attempt Quiz Flow**
   - Fail quiz attempt 1 → Retry → Fail attempt 2 → Retry → Fail attempt 3 → Verify locked for 1 hour

4. **Responsive Layout**
   - Resize viewport → Verify layout adapts → Test mobile sidebar behavior → Test collapse/expand

5. **Keyboard Navigation**
   - Tab through lessons → Press Enter to select → Tab through quiz options → Press Space to select answer

### Testing Tools

- **Vitest**: Fast unit test runner with Jest-compatible API
- **React Testing Library**: User-centric component testing
- **@testing-library/user-event**: Realistic user interaction simulation
- **jsdom**: DOM environment for testing
- **@vitest/coverage-v8**: Code coverage reporting

### Coverage Goals

- **Unit Test Coverage**: 80% minimum for business logic (validators, trackers, storage)
- **Component Coverage**: 70% minimum for UI components
- **Integration Test Coverage**: Key user flows (lesson selection, quiz completion, progress persistence)

## Performance Considerations

### Optimization Strategies

1. **React Performance**
   - Use `React.memo()` for expensive components (MarkdownRenderer)
   - Implement `useMemo()` for derived state (category completion percentages)
   - Use `useCallback()` for stable event handlers passed to child components
   - Lazy load lesson content when selected (not all lessons upfront)

2. **Animation Performance**
   - Use Framer Motion's `layout` prop for smooth layout animations
   - Leverage GPU acceleration with `transform` and `opacity`
   - Debounce scroll events (100ms) to reduce re-renders
   - Use `will-change` CSS property for animated elements

3. **Storage Performance**
   - Debounce progress saves (5 seconds) to reduce localStorage writes
   - Batch related state updates to minimize re-renders
   - Compress large lesson data if needed
   - Clear old data periodically (retention policy)

4. **Rendering Performance**
   - Virtualize lesson list if categories exceed 50 lessons
   - Lazy render markdown content sections as they scroll into view
   - Optimize images with lazy loading and responsive sizes
   - Use CSS containment for isolated components

### Performance Metrics

- **Time to Interactive (TTI)**: < 3 seconds on 3G connection
- **Animation Frame Rate**: 60fps on modern browsers, 30fps minimum on older devices
- **Bundle Size**: < 500KB gzipped for main bundle
- **localStorage Usage**: < 5MB total (browser limit is typically 5-10MB)

## Accessibility Features

### Keyboard Navigation

**Tab Order**:
1. Lesson panel categories (top to bottom)
2. Lesson items within expanded categories
3. Content panel scroll area
4. Quiz questions and options
5. Submit button
6. Next lesson recommendation

**Keyboard Shortcuts**:
- `Tab`: Move focus forward
- `Shift + Tab`: Move focus backward
- `Enter`: Activate button or select lesson
- `Space`: Select quiz answer
- `Arrow Up/Down`: Navigate between lessons in list
- `Arrow Left/Right`: Navigate between quiz options
- `Escape`: Close modals or collapse sidebar

### Screen Reader Support

**ARIA Labels**:
```jsx
<button aria-label="Select lesson: Introduction to Nutrition">
  Introduction to Nutrition
</button>

<div role="progressbar" aria-valuenow={scrollProgress} aria-valuemin="0" aria-valuemax="100">
  Progress: {scrollProgress}%
</div>

<div role="status" aria-live="polite" aria-atomic="true">
  Lesson completed! You earned 50 XP.
</div>
```

**ARIA Live Regions**:
- Quiz feedback: `aria-live="polite"` announces correct/incorrect
- XP updates: `aria-live="polite"` announces earned XP
- Lesson completion: `aria-live="assertive"` announces completion

**Focus Management**:
- Focus moves to content panel when lesson selected
- Focus returns to lesson list after closing content
- Focus traps in modal dialogs (level-up animation)
- Visible focus indicators (2px outline, high contrast)

### Visual Accessibility

**Color Contrast**:
- Normal text: 4.5:1 minimum (WCAG AA)
- Large text (18pt+): 3:1 minimum (WCAG AA)
- Interactive elements: 3:1 minimum against background

**Focus Indicators**:
```css
.focusable:focus-visible {
  outline: 2px solid theme('colors.emerald.600');
  outline-offset: 2px;
}
```

**Touch Targets**:
- Minimum size: 44x44 pixels (mobile)
- Adequate spacing: 8px minimum between targets

**Motion Preferences**:
```jsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
>
```

## Responsive Design Strategy

### Breakpoints

- **Mobile**: < 768px (vertical stack)
- **Tablet**: 768px - 1024px (side-by-side with smaller sidebar)
- **Desktop**: > 1024px (full side-by-side layout)

### Layout Adaptations

**Desktop (> 768px)**:
```
┌──────────────┬─────────────────────────────────────┐
│   Sidebar    │          Content Panel              │
│   (30%)      │            (70%)                    │
│              │                                     │
│   Lessons    │   Hero + Progress + Content + Quiz  │
│   Progress   │                                     │
│   [Collapse] │                                     │
└──────────────┴─────────────────────────────────────┘
```

**Mobile (< 768px)**:
```
┌─────────────────────────────────────────────────┐
│           Content Panel (100%)                  │
│   [Back to Lessons]                             │
│   Hero + Progress + Content + Quiz              │
│                                                 │
│   (Sidebar hidden, shown as overlay)            │
└─────────────────────────────────────────────────┘
```

**Sidebar Collapsed (Desktop)**:
```
┌─┬───────────────────────────────────────────────┐
│<│          Content Panel (100%)                 │
│ │   Hero + Progress + Content + Quiz            │
│ │                                               │
└─┴───────────────────────────────────────────────┘
```

### Mobile Optimizations

1. **Auto-hide sidebar**: Automatically hide sidebar when lesson selected
2. **Sticky header**: Keep back button and progress bar visible
3. **Touch gestures**: Swipe to navigate between lessons
4. **Larger tap targets**: 44x44px minimum
5. **Simplified animations**: Reduce motion complexity on mobile

## Animation Specifications

### Lesson Transition
```javascript
const lessonTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.4, ease: 'easeOut' }
};
```

### Quiz Unlock Animation
```javascript
const quizUnlock = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.3, ease: 'easeOut' }
};
```

### Progress Bar Update
```javascript
const progressBarUpdate = {
  animate: { width: `${progress}%` },
  transition: { duration: 0.3, ease: 'easeInOut' }
};
```

### Completion Animation
```javascript
const completionAnimation = {
  confetti: {
    duration: 1000,
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  },
  trophy: {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    transition: { duration: 0.6, type: 'spring', bounce: 0.5 }
  },
  xpCounter: {
    animate: { scale: [1, 1.2, 1] },
    transition: { duration: 0.2, times: [0, 0.5, 1] }
  }
};
```

### Category Expand/Collapse
```javascript
const categoryAnimation = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.25, ease: 'easeInOut' }
};
```

### XP Update Animation
```javascript
const xpUpdate = {
  animate: { scale: [1, 1.1, 1] },
  transition: { duration: 0.2 }
};
```

## State Management Patterns

### Local State (useState)
Use for component-specific UI state that doesn't need to be shared:
- Sidebar collapsed state
- Category expanded states
- Selected quiz answers (temporary)
- Hover states

### Lifted State (Container Component)
Use for shared state managed in HealthEducationView:
- Selected lesson ID
- Completed lessons set
- Total XP counter
- Quiz state (unlocked, attempts, score)

### Persistent State (localStorage)
Use for data that must survive page reloads:
- Lesson progress map
- Completed lessons set
- Total XP
- Quiz attempt counters
- Quiz lock timestamps
- Sidebar collapsed preference

### Derived State (useMemo)
Use for computed values based on other state:
- Category completion percentages
- Next lesson recommendation
- Unlock status for each lesson
- Quiz retry availability

**Example**:
```javascript
const categoryCompletion = useMemo(() => {
  return categories.map(cat => ({
    id: cat.id,
    percentage: (
      cat.lessons.filter(l => completedLessons.has(l.id)).length /
      cat.lessons.length * 100
    )
  }));
}, [categories, completedLessons]);
```

## Security Considerations

### Data Validation

1. **User Input Sanitization**
   - Quiz answers: Validate index is 0-3
   - Lesson IDs: Validate format and existence
   - Progress values: Clamp between 0-100

2. **XSS Prevention**
   - Sanitize markdown content before rendering
   - Use React's built-in XSS protection (JSX escaping)
   - Avoid `dangerouslySetInnerHTML` unless absolutely necessary

3. **localStorage Tampering**
   - Validate data structure on load
   - Ignore malformed data and use defaults
   - Don't trust client-side XP calculations (would validate server-side in real app)

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:;">
```

## Future Enhancements

### Phase 2 Features

1. **Social Features**
   - Share lesson completion on social media
   - Compete with friends on leaderboards
   - Comment and discussion sections

2. **Advanced Analytics**
   - Time spent per section tracking
   - Heatmap of difficult quiz questions
   - Learning pace recommendations

3. **Content Expansion**
   - Video lessons with playback controls
   - Interactive simulations and demos
   - Downloadable resources (PDFs, cheat sheets)

4. **Gamification Enhancements**
   - Achievement badges for milestones
   - Daily streak bonuses
   - Challenge modes with time limits

5. **Personalization**
   - AI-recommended learning paths
   - Adaptive difficulty based on performance
   - Custom study schedules

6. **Offline Support**
   - Service worker for offline access
   - Download lessons for offline reading
   - Sync progress when back online

## Implementation Phases

### Phase 1: Core Infrastructure (Week 1)
- Set up component structure
- Implement data models
- Create StorageManager and ProgressTracker
- Build basic layout (sidebar + content panel)

### Phase 2: Lesson Navigation (Week 1-2)
- Implement LessonPanel with categories
- Add lesson selection logic
- Implement LessonUnlocker
- Add lock/unlock indicators

### Phase 3: Content Display (Week 2)
- Build ContentPanel with HeroSection
- Implement MarkdownRenderer
- Add ProgressBar with scroll tracking
- Style lesson content

### Phase 4: Quiz System (Week 3)
- Build QuizSection component
- Implement QuizValidator
- Add immediate feedback
- Implement retry mechanism

### Phase 5: Gamification (Week 3)
- Add FloatingXPCounter
- Implement CompletionAnimation
- Add next lesson recommendation
- Integrate XP awards

### Phase 6: Polish & Accessibility (Week 4)
- Add animations with Framer Motion
- Implement keyboard navigation
- Add ARIA labels and live regions
- Optimize performance
- Responsive design refinements

### Phase 7: Testing & QA (Week 4)
- Write unit tests
- Write integration tests
- Manual accessibility testing
- Cross-browser testing
- Performance profiling

## Technical Decisions & Rationales

### Why Framer Motion?
- **Declarative animations**: Easy to reason about and maintain
- **Layout animations**: Automatic smooth transitions on layout changes
- **Performance**: Hardware-accelerated, optimized for React
- **Ecosystem**: Large community, good documentation

### Why localStorage?
- **Simplicity**: No backend integration needed for MVP
- **Performance**: Instant read/write, no network latency
- **Availability**: Supported by all modern browsers
- **Privacy**: Data stays on user's device

### Why Component-Based Architecture?
- **Reusability**: Components can be reused across different views
- **Testability**: Isolated components are easier to unit test
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features without breaking existing code

### Why Tailwind CSS?
- **Consistency**: Design system enforced through utility classes
- **Performance**: PurgeCSS removes unused styles
- **Developer Experience**: Fast prototyping, no context switching
- **Customization**: Easy to theme and extend

## Dependencies

### Required Dependencies
- `react` ^18.3.1: Core framework
- `react-dom` ^18.3.1: DOM rendering
- `framer-motion` ^12.42.2: Animations
- `lucide-react` ^1.16.0: Icons
- `clsx` ^1.2.1: Conditional class names

### Development Dependencies
- `vite` ^5.4.14: Build tool
- `vitest` ^2.1.9: Test runner
- `@testing-library/react` ^16.3.0: Component testing
- `@testing-library/user-event` ^14.5.2: User interaction simulation
- `jsdom` ^25.0.1: DOM environment for tests
- `tailwindcss` ^3.4.8: Styling
- `autoprefixer` ^10.4.14: CSS vendor prefixes

## Conclusion

This design provides a comprehensive blueprint for transforming the NutriGain Health Education module into a fully interactive learning experience. The architecture balances simplicity with scalability, prioritizes user experience through smooth animations and gamification, and ensures accessibility for all users. The component-based structure allows for easy testing and future enhancements while maintaining clean separation of concerns.

The implementation will deliver a modern, engaging learning platform that motivates users to complete lessons through XP rewards, progress tracking, and celebratory animations, ultimately improving health education outcomes for NutriGain users.
