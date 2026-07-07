/**
 * HealthEducationView - Interactive Learning Experience
 */

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../components/PageHeader";
import progressTracker from "../utils/learning/ProgressTracker.js";
import lessonUnlocker from "../utils/learning/LessonUnlocker.js";
import quizValidator from "../utils/learning/QuizValidator.js";
import { categories as initialCategories, getLessonById } from "../data/lessonData.js";
import LessonPanel from "../components/learning/LessonPanel.jsx";
import ContentPanel from "../components/learning/ContentPanel.jsx";

export default function HealthEducationView() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const categories = initialCategories;
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [totalXP, setTotalXP] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const [quizState, setQuizState] = useState({
    lessonId: null,
    unlocked: false,
    attempts: 0,
    lockedUntil: null,
    selectedAnswers: new Map(),
    submitted: false,
    score: 0
  });

  useEffect(() => {
    const savedCompletedLessons = progressTracker.getCompletedLessons();
    setCompletedLessons(savedCompletedLessons);
    const savedXP = progressTracker.getTotalXP();
    setTotalXP(savedXP);
    const savedSidebarState = progressTracker.loadSidebarState();
    setSidebarCollapsed(savedSidebarState);
  }, []);

  const handleLessonSelect = useCallback((lessonId) => {
    const isUnlocked = lessonUnlocker.isLessonUnlocked(lessonId, categories, completedLessons, totalXP);
    if (!isUnlocked) {
      const requirements = lessonUnlocker.getUnlockRequirements(lessonId, categories);
      alert(requirements);
      return;
    }
    progressTracker.initializeLessonProgress(lessonId);
    
    // Load saved progress
    const savedProgress = progressTracker.loadProgress(lessonId);
    const savedScroll = savedProgress?.scrollPosition || 0;
    
    setSelectedLesson(lessonId);
    setShowMobileSidebar(false);
    setScrollProgress(savedScroll);
    setQuizState({
      lessonId,
      unlocked: savedScroll >= 80 || completedLessons.has(lessonId),
      attempts: quizValidator.getAttemptCount(lessonId),
      lockedUntil: quizValidator.getLockTimestamp(lessonId),
      selectedAnswers: new Map(),
      submitted: completedLessons.has(lessonId),
      score: savedProgress?.score || 0
    });
  }, [categories, completedLessons]);

  // No longer needed - scroll tracking is automatic
  const handleScrollUpdate = useCallback(() => {
    // This function is kept for compatibility but does nothing
    // Scroll tracking is now handled automatically by useEffect
  }, []);

  useEffect(() => {
    if (!selectedLesson) return;
    const timer = setTimeout(() => {
      progressTracker.updateScrollPosition(selectedLesson, scrollProgress);
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedLesson, scrollProgress]);

  // Auto-track scroll position using window scroll
  useEffect(() => {
    if (!selectedLesson) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const scrollableHeight = documentHeight - windowHeight;
      if (scrollableHeight <= 0) {
        setScrollProgress(100);
        return;
      }
      
      const progress = Math.min(100, Math.round((scrollTop / scrollableHeight) * 100));
      
      // Only increase progress, never decrease (keep max value)
      setScrollProgress(prev => Math.max(prev, progress));
      
      // Auto-unlock quiz when scrolled to 80%
      if (progress >= 80 && !quizState.unlocked) {
        setQuizState(prev => ({ ...prev, unlocked: true }));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check (delay slightly to ensure DOM is fully rendered)
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [selectedLesson, quizState.unlocked]);

  const handleQuizComplete = useCallback((score) => {
    if (!selectedLesson) return;
    const isPassing = quizValidator.isPassingScore(score);
    if (isPassing) {
      const lesson = getLessonById(selectedLesson);
      if (!lesson) return;
      
      // Only award XP if not already completed
      let xpEarned = 0;
      if (!completedLessons.has(selectedLesson)) {
        xpEarned = lesson.xp;
        progressTracker.markLessonComplete(selectedLesson, score, xpEarned);
        setCompletedLessons(prev => new Set([...prev, selectedLesson]));
        setTotalXP(prev => prev + xpEarned);
        lessonUnlocker.unlockNextLesson(selectedLesson, categories);
      }
      
      quizValidator.resetAttempts(selectedLesson);
      setQuizState(prev => ({ ...prev, submitted: true, score }));
    } else {
      const attempts = quizValidator.incrementAttempt(selectedLesson);
      const lockedUntil = quizValidator.getLockTimestamp(selectedLesson);
      setQuizState(prev => ({ ...prev, submitted: true, score, attempts, lockedUntil }));
    }
  }, [selectedLesson, categories, completedLessons]);

  const handleToggleSidebar = useCallback(() => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    progressTracker.saveSidebarState(newState);
  }, [sidebarCollapsed]);

  const currentLesson = selectedLesson ? getLessonById(selectedLesson) : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 pt-6 pb-4">
        <PageHeader
          eyebrow="HỌC TẬP TƯƠNG TÁC"
          title="Giáo dục sức khỏe"
          subtitle="Khám phá kiến thức dinh dưỡng qua các bài học tương tác, hoàn thành quiz để nhận XP và mở khóa nội dung mới"
          compact={true}
        />
      </div>
      
      <main className="container mx-auto px-4 py-8">
        {!selectedLesson ? (
          <div className="max-w-6xl mx-auto animate-fade-in">
            {/* Total XP Banner */}
            <div className="mb-10 p-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[32px] shadow-lg shadow-emerald-500/20 text-white flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[20px] flex items-center justify-center border border-white/20 shadow-inner">
                  <span className="text-3xl drop-shadow-md">🏆</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-50 uppercase tracking-widest mb-1">Thành tích học tập</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tight">{totalXP}</span>
                    <span className="text-xl font-bold text-emerald-100">XP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum Grid */}
            <div className="space-y-12">
              {categories.map((category) => {
                const completion = progressTracker.getCategoryCompletion(category.lessons);
                return (
                  <div key={category.id} className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm
                          ${category.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                            category.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                            category.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                            'bg-orange-100 text-orange-600'
                          }
                        `}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{category.name}</h2>
                          <p className="text-sm font-semibold text-slate-500 mt-1">Hoàn thành {completion}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.lessons.map((lesson) => {
                        const isUnlocked = lessonUnlocker.isLessonUnlocked(lesson.id, categories, completedLessons);
                        const isCompleted = completedLessons.has(lesson.id);
                        
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonSelect(lesson.id)}
                            disabled={!isUnlocked}
                            className={`
                              group relative flex flex-col items-start p-6 rounded-[24px] text-left transition-all duration-300
                              ${isUnlocked 
                                ? 'bg-white border-2 border-slate-100 shadow-sm hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-emerald-200' 
                                : 'bg-slate-50 border-2 border-slate-100 opacity-75 cursor-not-allowed'
                              }
                            `}
                          >
                            <div className="w-full flex items-center justify-between mb-4">
                              <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                                lesson.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700' :
                                lesson.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                                'bg-rose-100 text-rose-700'
                              }`}>
                                {lesson.difficulty}
                              </span>
                              
                              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 transition-colors group-hover:bg-white group-hover:shadow-sm">
                                {isCompleted ? (
                                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                ) : isUnlocked ? (
                                  <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                ) : (
                                  <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                )}
                              </div>
                            </div>

                            <h3 className={`text-xl font-bold mb-3 line-clamp-2 ${isUnlocked ? 'text-slate-900 group-hover:text-emerald-600' : 'text-slate-500'} transition-colors`}>
                              {lesson.title}
                            </h3>
                            
                            <div className="mt-auto pt-4 border-t border-slate-100 w-full flex items-center justify-between text-sm font-semibold">
                              <span className="text-slate-500 flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {lesson.duration} phút
                              </span>
                              <span className="text-amber-500 flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-md">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                +{lesson.xp} XP
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto transition-all duration-300 animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
              <button 
                onClick={() => setSelectedLesson(null)}
                className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm text-slate-700 font-bold hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Quay lại Giáo trình
              </button>
              
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                <span className="text-xl">🏆</span>
                <span className="font-black text-slate-900">{totalXP} XP</span>
              </div>
            </div>
            
            <div 
              data-content-scroll
              className="rounded-[32px] border border-slate-100 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] min-h-[700px] pb-12"
            >
              <ContentPanel
                lesson={currentLesson}
                scrollProgress={scrollProgress}
                quizState={quizState}
                onScrollUpdate={handleScrollUpdate}
                onQuizSubmit={handleQuizComplete}
                onBackToList={() => setSelectedLesson(null)}
              />
            </div>
          </div>
        )}
      </main>
      <style jsx global>{`
        /* Removed custom scrollbar for inner container since we now use window scroll */
      `}</style>
    </div>
  );
}
