/**
 * ContentPanel - Main content display
 * Tasks 5.1, 5.2, 5.3, 5.4
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BarChart3, Eye, Heart, BookOpen, Lock } from 'lucide-react';
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
  const [showQuizView, setShowQuizView] = useState(false);

  // Reset view when lesson changes
  useEffect(() => {
    setShowQuizView(false);
  }, [lesson?.id]);

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
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-32 h-32 bg-gradient-to-tr from-emerald-100 to-teal-50 rounded-[32px] flex items-center justify-center mb-6 shadow-sm border border-emerald-50/50"
        >
          <span className="text-6xl drop-shadow-sm">📚</span>
        </motion.div>
        <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
          Chọn một bài học để bắt đầu
        </h3>
        <p className="text-base text-slate-500 max-w-md font-medium">
          Mỗi bài học được thiết kế khoa học, giúp bạn dễ dàng làm chủ kiến thức dinh dưỡng chỉ trong vài phút.
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
      <div className="relative rounded-[24px] overflow-hidden bg-slate-900 min-h-[280px] shadow-lg group">
        {lesson.heroImage && (
          <img 
            src={lesson.heroImage} 
            alt={lesson.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent flex flex-col justify-end p-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Chương trình học
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight">{lesson.title}</h1>
            <div className="flex flex-wrap items-center gap-3 md:gap-5 text-white/90 text-sm font-semibold">
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                {lesson.difficulty}
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Clock className="w-4 h-4 text-emerald-400" />
                {lesson.duration} phút
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm text-amber-300">
                ⭐ +{lesson.xp} XP
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-2 md:px-8 space-y-10 py-6">
        {/* Progress Bar - Only in theory view */}
        {!showQuizView && (
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md pt-2 pb-4 -mx-2 px-2">
            <ProgressBar progress={scrollProgress} unlocked={scrollProgress >= 80} />
          </div>
        )}

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {!showQuizView ? (
            <motion.div
              key="theory-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {/* Summary */}
              {lesson.summary && (
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 rounded-[20px]">
                  <p className="text-sm font-bold text-blue-900 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-lg">💡</span> Tóm tắt
                  </p>
                  <p className="text-[15px] font-medium text-blue-800/90 leading-relaxed">{lesson.summary}</p>
                </div>
              )}

              {/* Learning Objectives */}
              {lesson.objectives && lesson.objectives.length > 0 && (
                <div className="bg-slate-50 p-6 rounded-[24px]">
                  <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight">🎯 Mục tiêu học tập</h2>
                  <ul className="space-y-3">
                    {lesson.objectives.map((objective, index) => (
                      <li 
                        key={index} className="flex items-start gap-3 text-slate-700 bg-white p-3 rounded-xl shadow-sm border border-slate-100"
                      >
                        <span className="flex-shrink-0 w-7 h-7 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="flex-1 font-medium mt-0.5">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Content */}
              <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-emerald-600">
                {lesson.content.map((section, index) => {
                  switch (section.type) {
                    case 'heading':
                      return (
                        <h2 key={index} className="text-2xl font-black text-slate-900 mt-10 mb-4 border-b border-slate-100 pb-2">
                          {section.content}
                        </h2>
                      );
                    case 'text':
                      return (
                        <p key={index} className="text-slate-600 font-medium leading-relaxed mb-5 text-[17px]">
                          {section.content}
                        </p>
                      );
                    case 'list':
                      return (
                        <ul key={index} className="space-y-3 mb-6 bg-slate-50 p-6 rounded-2xl">
                          {section.content.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="text-emerald-500 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span className="text-slate-700 font-medium" dangerouslySetInnerHTML={{ __html: item }} />
                            </li>
                          ))}
                        </ul>
                      );
                    default:
                      return null;
                  }
                })}
              </div>

              {/* Scroll Progress Info (Read-only) */}
              <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-[20px] shadow-sm mt-10">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Tiến độ đọc
                  </p>
                  <span className="text-2xl font-black text-emerald-600">{scrollProgress}%</span>
                </div>
                <div className="mt-3 relative h-2 bg-white rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                  />
                </div>
                {scrollProgress >= 80 && (
                  <p className="text-xs font-semibold text-emerald-700 mt-3 flex items-center gap-2">
                    <span>✅</span> Bạn đã đọc đủ để làm bài kiểm tra!
                  </p>
                )}
              </div>

              {/* Key Takeaways */}
              {lesson.takeaways && lesson.takeaways.length > 0 && (
                <div className="p-8 bg-[#FFFBF0] border border-amber-200/60 rounded-[24px] shadow-sm relative overflow-hidden mt-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <h2 className="text-xl font-black text-amber-900 mb-5 tracking-tight relative z-10 flex items-center gap-2">
                    <span className="text-2xl">⚡</span> Điểm nhấn quan trọng
                  </h2>
                  <ul className="space-y-3 relative z-10">
                    {lesson.takeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start gap-3 text-amber-900/90 font-medium bg-white/40 p-3 rounded-xl">
                        <span className="text-amber-500 mt-0.5">✨</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quiz Entry Button */}
              {lesson.quiz && lesson.quiz.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center justify-center text-center">
                  <h3 className="text-2xl font-black text-slate-800 mb-4">Kiểm tra kiến thức</h3>
                  <p className="text-slate-500 mb-6 font-medium max-w-md">Hoàn thành bài kiểm tra để củng cố kiến thức và nhận ngay phần thưởng XP!</p>
                  
                  {quizState.unlocked ? (
                    <button 
                      onClick={() => {
                        setShowQuizView(true);
                        // Scroll to top of content panel when entering quiz
                        const contentElement = document.querySelector('[data-content-scroll]');
                        if (contentElement) contentElement.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-10 py-4 bg-emerald-600 text-white rounded-full font-black text-lg shadow-xl shadow-emerald-500/30 hover:bg-emerald-500 hover:-translate-y-1 hover:shadow-emerald-500/40 transition-all duration-300 flex items-center gap-3"
                    >
                      <span className="text-2xl">📝</span>
                      {quizState.submitted ? 'Làm lại bài kiểm tra' : 'Bắt đầu làm bài kiểm tra'}
                    </button>
                  ) : (
                    <div className="px-8 py-4 bg-slate-100 text-slate-500 rounded-full font-bold text-base flex items-center gap-3 border border-slate-200">
                      <Lock className="w-5 h-5" />
                      Đọc đến 80% để mở khóa bài kiểm tra
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="quiz-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <div className="mb-8 flex items-center justify-between">
                <button 
                  onClick={() => setShowQuizView(false)}
                  className="group flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold transition"
                >
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Xem lại lý thuyết
                </button>
                <span className="text-sm font-bold text-amber-500 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                  Phần thưởng: {lesson.xp} XP
                </span>
              </div>
              
              <div className="bg-white rounded-[24px]">
                <QuizSection
                  quiz={lesson.quiz}
                  quizState={quizState}
                  onSubmit={onQuizSubmit}
                  lessonId={lesson.id}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Lesson Recommendation */}
        {quizState.submitted && quizState.score >= 70 && !showCompletionAnimation && (
          <div className="mt-8">
            <NextLessonRecommendation
              lesson={nextLesson}
              onSelect={handleSelectNextLesson}
            />
          </div>
        )}

        {/* Completion Animation */}
        {showCompletionAnimation && lesson && (
          <CompletionAnimation
            xpEarned={lesson.xp}
            onContinue={handleContinue}
          />
        )}
      </div>
    </motion.div>
  );
}
