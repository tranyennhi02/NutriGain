/**
 * LessonPanel - Sidebar component for lesson navigation
 * Tasks 3.1, 3.2, 3.3
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Lock, Unlock, Check, BookOpen, Apple, Scale } from 'lucide-react';
import lessonUnlocker from '../../utils/learning/LessonUnlocker.js';
import progressTracker from '../../utils/learning/ProgressTracker.js';

const iconMap = {
  BookOpen,
  Apple,
  Scale
};

export default function LessonPanel({
  categories,
  selectedLesson,
  completedLessons,
  onLessonSelect,
  collapsed,
  onToggleCollapse
}) {
  const [expandedCategories, setExpandedCategories] = useState(
    new Set(categories.filter(cat => cat.expanded).map(cat => cat.id))
  );

  // Debug
  console.log('LessonPanel render:', { 
    categoriesCount: categories?.length, 
    selectedLesson,
    completedCount: completedLessons?.size 
  });

  if (!categories || categories.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
        ⚠️ Không có dữ liệu bài học
      </div>
    );
  }

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleLessonClick = (lessonId) => {
    const isUnlocked = lessonUnlocker.isLessonUnlocked(lessonId, categories, completedLessons);
    
    if (!isUnlocked) {
      const message = lessonUnlocker.getUnlockRequirements(lessonId, categories);
      alert(message);
      return;
    }
    
    onLessonSelect(lessonId);
  };

  if (collapsed) return null;

  return (
    <div className="h-full">
      {categories.map((category, catIndex) => {
        const Icon = iconMap[category.icon] || BookOpen;
        const isExpanded = expandedCategories.has(category.id);
        const completion = progressTracker.getCategoryCompletion(category.lessons);

        return (
          <div key={category.id} className={catIndex > 0 ? 'mt-4' : ''}>
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition group"
            >
              <div className="flex items-center gap-2 flex-1">
                <Icon className={`w-5 h-5 ${
                  category.color === 'emerald' ? 'text-emerald-600' :
                  category.color === 'blue' ? 'text-blue-600' :
                  category.color === 'purple' ? 'text-purple-600' :
                  'text-slate-600'
                }`} />
                <span className="font-semibold text-slate-800 text-sm">
                  {category.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">
                  {completion}%
                </span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {/* Lessons List */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="ml-2 mt-1 space-y-1">
                    {category.lessons.map((lesson) => {
                      const isUnlocked = lessonUnlocker.isLessonUnlocked(
                        lesson.id,
                        categories,
                        completedLessons
                      );
                      const isCompleted = completedLessons.has(lesson.id);
                      const isSelected = selectedLesson === lesson.id;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson.id)}
                          disabled={!isUnlocked}
                          className={`
                            w-full flex items-center gap-2 p-2.5 rounded-lg text-sm transition
                            ${isSelected 
                              ? category.color === 'emerald' ? 'bg-emerald-50 border border-emerald-200' :
                                category.color === 'blue' ? 'bg-blue-50 border border-blue-200' :
                                category.color === 'purple' ? 'bg-purple-50 border border-purple-200' :
                                'bg-slate-50 border border-slate-200'
                              : 'hover:bg-slate-50'
                            }
                            ${!isUnlocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          `}
                        >
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            ) : isUnlocked ? (
                              <Unlock className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Lock className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          
                          <div className="flex-1 text-left">
                            <p className={`font-medium ${
                              isSelected 
                                ? category.color === 'emerald' ? 'text-emerald-900' :
                                  category.color === 'blue' ? 'text-blue-900' :
                                  category.color === 'purple' ? 'text-purple-900' :
                                  'text-slate-900'
                                : 'text-slate-700'
                            }`}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                lesson.difficulty === 'Beginner' 
                                  ? 'bg-green-100 text-green-700'
                                  : lesson.difficulty === 'Intermediate'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {lesson.difficulty}
                              </span>
                              <span className="text-xs text-slate-500">
                                {lesson.duration} phút
                              </span>
                              {lesson.xp && (
                                <span className="text-xs text-amber-600 font-semibold">
                                  +{lesson.xp} XP
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
