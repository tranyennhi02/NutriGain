/**
 * ContentPanel - Main content display
 * Tasks 5.1, 5.2, 5.3, 5.4
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, BarChart3, Eye, Heart } from 'lucide-react';
import ProgressBar from './ProgressBar';
import QuizSection from './QuizSection';
import CompletionAnimation from './CompletionAnimation';
import NextLessonRecommendation from './NextLessonRecommendation';
import lessonUnlocker from '../../utils/learning/LessonUnlocker';
import { categories, getLessonById } from '../../data/lessonData';

export default function ContentPanel({
  lesson,
  scrollProgress,
  quizState,
  onScrollUpdate,
  onQuizSubmit,
  onBackToList
}) {
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [nextLesson, setNextLesson] = useState(null);

  // Show completion animation when lesson is completed
  useEffect(() => {
    if (quizState.submitted && quizState.score >= 70 && lesson) {
      setShowCompletionAnimation(true);
      
      // Get next recommendation
      const next = lessonUnlocker.getNextRecommendation(lesson.id, categories);
      setNextLesson(next);
    }
  }, [quizState.submitted, quizState.score, lesson]);

  const handleContinue = () => {
    setShowCompletionAnimation(false);
  };

  const handleSelectNextLesson = (lessonId) => {
    // This will be handled by parent component
    if (onBackToList) {
      onBackToList(); // Trigger lesson selection through parent
    }
  };
  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">📚</span>
        </div>
        <p className="text-lg font-semibold text-slate-700 mb-2">
          Chưa chọn bài học
        </p>
        <p className="text-sm text-slate-500 max-w-md">
          Chọn một bài học từ thanh bên để bắt đầu hành trình học tập
        </p>
      </div>
    );
  }

  return (
    <motion.div
      key={lesson.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Back button for mobile */}
      {onBackToList && (
        <button
          onClick={onBackToList}
          className="md:hidden flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition text-slate-700 font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại
        </button>
      )}

      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500 to-blue-600 h-48">
        {lesson.heroImage && (
          <img 
            src={lesson.heroImage} 
            alt={lesson.title}
            className="w-full h-full object-cover"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
          <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
          <div className="flex items-center gap-4 text-white/90 text-sm">
            <span className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              {lesson.difficulty}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {lesson.duration} phút
            </span>
            {lesson.metadata?.views > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {lesson.metadata.views}
              </span>
            )}
            {lesson.metadata?.likes > 0 && (
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {lesson.metadata.likes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar progress={scrollProgress} unlocked={scrollProgress >= 80} />

      {/* Summary */}
      {lesson.summary && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-1">📝 Tóm tắt</p>
          <p className="text-sm text-blue-800">{lesson.summary}</p>
        </div>
      )}

      {/* Learning Objectives */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">🎯 Mục tiêu học tập</h2>
          <ul className="space-y-2">
            {lesson.objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-2 text-slate-700">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span className="flex-1">{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Content */}
      <div className="prose prose-slate max-w-none">
        {lesson.content.map((section, index) => {
          switch (section.type) {
            case 'heading':
              return (
                <h2 key={index} className="text-2xl font-bold text-slate-900 mt-6 mb-3">
                  {section.content}
                </h2>
              );
            case 'text':
              return (
                <p key={index} className="text-slate-700 leading-relaxed mb-4">
                  {section.content}
                </p>
              );
            case 'list':
              return (
                <ul key={index} className="space-y-2 mb-4">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              );
            default:
              return null;
          }
        })}
      </div>

      {/* Scroll Simulator (for testing) */}
      <div className="p-4 bg-slate-50 rounded-lg">
        <p className="text-sm font-semibold text-slate-700 mb-2">
          📊 Tiến độ đọc: {scrollProgress}%
        </p>
        <input
          type="range"
          min="0"
          max="100"
          value={scrollProgress}
          onChange={(e) => onScrollUpdate(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Key Takeaways */}
      {lesson.takeaways && lesson.takeaways.length > 0 && (
        <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <h2 className="text-xl font-bold text-amber-900 mb-3">💡 Điểm chính</h2>
          <ul className="space-y-2">
            {lesson.takeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start gap-2 text-amber-900">
                <span className="text-amber-500 mt-1">✓</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quiz Section */}
      {lesson.quiz && lesson.quiz.length > 0 && (
        <QuizSection
          quiz={lesson.quiz}
          quizState={quizState}
          onSubmit={onQuizSubmit}
          lessonId={lesson.id}
        />
      )}

      {/* Next Lesson Recommendation */}
      {quizState.submitted && quizState.score >= 70 && !showCompletionAnimation && (
        <NextLessonRecommendation
          lesson={nextLesson}
          onSelect={handleSelectNextLesson}
        />
      )}

      {/* Completion Animation */}
      {showCompletionAnimation && lesson && (
        <CompletionAnimation
          xpEarned={lesson.xp}
          onContinue={handleContinue}
        />
      )}
    </motion.div>
  );
}
