/**
 * HealthEducationView - Interactive Learning Experience
 */

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import progressTracker from "../utils/learning/ProgressTracker.js";
import lessonUnlocker from "../utils/learning/LessonUnlocker.js";
import quizValidator from "../utils/learning/QuizValidator.js";
import { categories as initialCategories, getLessonById } from "../data/lessonData.js";
import LessonPanel from "../components/learning/LessonPanel.jsx";
import ContentPanel from "../components/learning/ContentPanel.jsx";
import FloatingXPCounter from "../components/learning/FloatingXPCounter.jsx";

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
    const isUnlocked = lessonUnlocker.isLessonUnlocked(lessonId, categories, completedLessons);
    if (!isUnlocked) {
      const requirements = lessonUnlocker.getUnlockRequirements(lessonId, categories);
      alert(requirements);
      return;
    }
    progressTracker.initializeLessonProgress(lessonId);
    setSelectedLesson(lessonId);
    setShowMobileSidebar(false);
    setScrollProgress(0);
    setQuizState({
      lessonId,
      unlocked: false,
      attempts: quizValidator.getAttemptCount(lessonId),
      lockedUntil: quizValidator.getLockTimestamp(lessonId),
      selectedAnswers: new Map(),
      submitted: false,
      score: 0
    });
  }, [categories, completedLessons]);

  const handleScrollUpdate = useCallback((progress) => {
    setScrollProgress(progress);
    if (progress >= 80 && selectedLesson && !quizState.unlocked) {
      setQuizState(prev => ({ ...prev, unlocked: true }));
    }
  }, [selectedLesson, quizState.unlocked]);

  useEffect(() => {
    if (!selectedLesson) return;
    const timer = setTimeout(() => {
      progressTracker.updateScrollPosition(selectedLesson, scrollProgress);
    }, 5000);
    return () => clearTimeout(timer);
  }, [selectedLesson, scrollProgress]);

  const handleQuizComplete = useCallback((score) => {
    if (!selectedLesson) return;
    const isPassing = quizValidator.isPassingScore(score);
    if (isPassing) {
      const lesson = getLessonById(selectedLesson);
      if (!lesson) return;
      const xpEarned = lesson.xp;
      progressTracker.markLessonComplete(selectedLesson, score, xpEarned);
      setCompletedLessons(prev => new Set([...prev, selectedLesson]));
      setTotalXP(prev => prev + xpEarned);
      lessonUnlocker.unlockNextLesson(selectedLesson, categories);
      quizValidator.resetAttempts(selectedLesson);
      setQuizState(prev => ({ ...prev, submitted: true, score }));
    } else {
      const attempts = quizValidator.incrementAttempt(selectedLesson);
      const lockedUntil = quizValidator.getLockTimestamp(selectedLesson);
      setQuizState(prev => ({ ...prev, submitted: true, score, attempts, lockedUntil }));
    }
  }, [selectedLesson, categories]);

  const handleToggleSidebar = useCallback(() => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    progressTracker.saveSidebarState(newState);
  }, [sidebarCollapsed]);

  const currentLesson = selectedLesson ? getLessonById(selectedLesson) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/20">
      <PageHeader />
      <FloatingXPCounter totalXP={totalXP} />
      
      <main className="container mx-auto px-4 py-8">
        <div className={`grid gap-6 transition-all duration-250 grid-cols-1 ${sidebarCollapsed ? 'md:grid-cols-[0px_1fr]' : 'md:grid-cols-[25%_75%]'} ${sidebarCollapsed ? 'lg:grid-cols-[0px_1fr]' : 'lg:grid-cols-[30%_70%]'}`}>
          
          <motion.div
            className={`${sidebarCollapsed ? 'hidden' : ''} ${!showMobileSidebar && selectedLesson ? 'hidden md:block' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: sidebarCollapsed ? 0 : 1, x: sidebarCollapsed ? -20 : 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sticky top-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Bài học</h2>
                <button onClick={handleToggleSidebar} className="hidden lg:block p-2 hover:bg-slate-100 rounded-lg transition">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-emerald-50 rounded-lg">
                <p className="text-xs font-semibold text-emerald-900 mb-2">Tiến độ của bạn</p>
                <div className="space-y-1 text-xs text-emerald-700">
                  <p>Đã hoàn thành: {completedLessons.size} bài</p>
                  <p>Tổng XP: {totalXP}</p>
                </div>
              </div>

              <LessonPanel
                categories={categories}
                selectedLesson={selectedLesson}
                completedLessons={completedLessons}
                onLessonSelect={handleLessonSelect}
                collapsed={false}
                onToggleCollapse={handleToggleSidebar}
              />
            </div>
          </motion.div>

          {sidebarCollapsed && (
            <motion.button
              onClick={handleToggleSidebar}
              className="hidden lg:block fixed left-4 top-24 p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition z-20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
            >
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm min-h-[600px]">
              <ContentPanel
                lesson={currentLesson}
                scrollProgress={scrollProgress}
                quizState={quizState}
                onScrollUpdate={handleScrollUpdate}
                onQuizSubmit={handleQuizComplete}
                onBackToList={() => setShowMobileSidebar(true)}
              />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
