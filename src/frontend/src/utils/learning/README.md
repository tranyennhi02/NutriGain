# Interactive Learning Experience - Utility Classes

This directory contains the core utility classes for the Interactive Learning Experience feature, providing storage management, progress tracking, lesson unlocking logic, and quiz validation.

## Overview

These utilities support:
- **Persistent storage** of user progress using localStorage
- **Progress tracking** for lesson completion, XP, and scroll positions
- **Sequential lesson unlocking** based on completion status
- **Quiz validation** with retry limits and cooldown periods

## Utility Classes

### StorageManager

**Purpose:** Abstraction layer for localStorage operations with error handling and fallback support.

**Key Features:**
- Namespaced keys to avoid conflicts
- JSON serialization/deserialization
- In-memory fallback when localStorage unavailable
- Quota exceeded error handling

**Usage:**
```javascript
import { storageManager } from './utils/learning';

// Save data
storageManager.save('my_key', { value: 'data' });

// Load data
const data = storageManager.load('my_key');

// Remove data
storageManager.remove('my_key');

// Clear all namespaced data
storageManager.clear();
```

**Requirements:** 11.1, 11.2

---

### ProgressTracker

**Purpose:** Manages and persists user learning progress including completion status, XP, scroll positions, and time spent.

**Key Features:**
- Track lesson completion with scores and timestamps
- Monitor scroll position and time spent per lesson
- Calculate category completion percentages
- Manage total XP accumulation
- Persist sidebar collapsed state

**Usage:**
```javascript
import { progressTracker } from './utils/learning';

// Initialize lesson progress
progressTracker.initializeLessonProgress('lesson-1');

// Update scroll position
progressTracker.updateScrollPosition('lesson-1', 45);

// Mark lesson complete
progressTracker.markLessonComplete('lesson-1', 85, 100);

// Get completed lessons
const completed = progressTracker.getCompletedLessons(); // Returns Set

// Get total XP
const xp = progressTracker.getTotalXP();

// Calculate category completion
const completion = progressTracker.getCategoryCompletion(lessons);
```

**Requirements:** 11.3, 6.1, 6.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8

---

### LessonUnlocker

**Purpose:** Manages sequential lesson unlocking logic based on completion status.

**Key Features:**
- First lesson in each category unlocked by default
- Sequential unlocking within categories
- Unlock requirement messages
- Next lesson recommendations
- Category and course completion detection

**Usage:**
```javascript
import { lessonUnlocker } from './utils/learning';

// Check if lesson is unlocked
const isUnlocked = lessonUnlocker.isLessonUnlocked(
  'lesson-2', 
  categories, 
  completedLessons
);

// Get unlock requirements message
const message = lessonUnlocker.getUnlockRequirements('lesson-2', categories);

// Get next lesson to unlock
const nextLessonId = lessonUnlocker.unlockNextLesson('lesson-1', categories);

// Get next recommendation
const nextLesson = lessonUnlocker.getNextRecommendation('lesson-1', categories);

// Check if category is complete
const categoryComplete = lessonUnlocker.isCategoryComplete(category, completedLessons);

// Check if all lessons complete
const allComplete = lessonUnlocker.isAllLessonsComplete(categories, completedLessons);
```

**Requirements:** 11.4, 6.1, 6.2, 6.3, 6.4, 6.5

---

### QuizValidator

**Purpose:** Validates quiz answers and manages retry logic with attempt limits and cooldown periods.

**Key Features:**
- Calculate quiz scores as percentages
- 70% passing threshold
- Track attempt counters per lesson
- Lock quiz after 3 failed attempts
- 1-hour cooldown period
- Automatic unlock after cooldown expires

**Usage:**
```javascript
import { quizValidator } from './utils/learning';

// Calculate score
const score = quizValidator.calculateScore(questions, answers);

// Check if passing
const passed = quizValidator.isPassingScore(score); // true if >= 70%

// Check if can retry
const canRetry = quizValidator.canRetry('lesson-1');

// Increment attempt
quizValidator.incrementAttempt('lesson-1');

// Get remaining lock time
const remaining = quizValidator.getRemainingLockTime('lesson-1');
const formatted = quizValidator.formatRemainingTime(remaining);

// Validate submission
const validation = quizValidator.validateSubmission(questions, answers);
if (!validation.isValid) {
  console.log(validation.message);
}

// Reset attempts (after passing)
quizValidator.resetAttempts('lesson-1');

// Check and unlock if expired
quizValidator.checkAndUnlockIfExpired('lesson-1');
```

**Requirements:** 11.5, 3.6, 3.7, 3.8, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6

---

## Data Structure

### Lesson Data (`/src/data/lessonData.js`)

Contains all lesson content organized by categories with the following structure:

**Category:**
```javascript
{
  id: 'category-id',
  name: 'Category Name',
  icon: 'IconName', // lucide-react icon
  color: 'tailwind-color',
  expanded: false,
  lessons: [/* lesson objects */]
}
```

**Lesson:**
```javascript
{
  id: 'lesson-id',
  title: 'Lesson Title',
  category: 'category-id',
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
  duration: 20, // minutes
  xp: 100,
  heroImage: '/path/to/image.jpg',
  summary: 'AI-generated summary',
  objectives: ['Objective 1', 'Objective 2'],
  content: [
    { type: 'heading', content: 'Section Title' },
    { type: 'text', content: 'Paragraph text', markdown: true },
    { type: 'list', content: ['Item 1', 'Item 2'] }
  ],
  takeaways: ['Key point 1', 'Key point 2'],
  quiz: [
    {
      id: 'q1',
      questionText: 'Question?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswerIndex: 0,
      explanation: 'Why this is correct'
    }
  ],
  metadata: { views: 0, likes: 0 }
}
```

**Helper Functions:**
- `getAllLessons()` - Get flattened array of all lessons
- `getLessonById(id)` - Get lesson by ID
- `getCategoryById(id)` - Get category by ID
- `getLessonsByCategory(id)` - Get all lessons in a category
- `isValidLesson(lesson)` - Validate lesson structure

**Requirements:** 11.6

---

## Testing

All utility classes have comprehensive unit tests with 100% coverage of core functionality.

**Run tests:**
```bash
npm run test:run -- src/utils/learning
```

**Test files:**
- `StorageManager.test.js` - 17 tests
- `ProgressTracker.test.js` - 26 tests
- `LessonUnlocker.test.js` - 27 tests
- `QuizValidator.test.js` - 35 tests

**Total:** 105 tests passing ✓

**Requirements tested:** 6.1, 6.2, 11.1, 11.2, 11.3, 11.4, 11.5, 12.1, 12.2, 12.3, 12.4

---

## Dependencies

All required dependencies are already installed:
- `framer-motion@12.42.2` - For animations
- `lucide-react@1.17.0` - For icons
- `clsx@1.2.1` - For conditional className handling

---

## Storage Keys

The following localStorage keys are used (all namespaced with `nutrigain_`):

- `nutrigain_lesson_progress` - Map of lesson progress objects
- `nutrigain_completed_lessons` - Array of completed lesson IDs
- `nutrigain_total_xp` - User's total XP
- `nutrigain_sidebar_collapsed` - Sidebar collapsed state
- `nutrigain_quiz_attempts` - Map of quiz attempt counters
- `nutrigain_quiz_locks` - Map of quiz lock timestamps

---

## Error Handling

All utilities include comprehensive error handling:

- **StorageManager:** Graceful fallback to in-memory storage if localStorage unavailable
- **ProgressTracker:** Validates data structures and handles missing values
- **LessonUnlocker:** Returns safe defaults for non-existent lessons
- **QuizValidator:** Validates submissions and handles edge cases

---

## Next Steps

With the infrastructure in place, the next tasks involve:

1. Building UI components (LessonPanel, ContentPanel, QuizSection)
2. Implementing animations with Framer Motion
3. Creating responsive layouts
4. Adding accessibility features
5. Integrating utilities with React components

Refer to `tasks.md` for the complete implementation plan.
