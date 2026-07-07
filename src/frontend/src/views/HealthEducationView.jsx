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

  console.log('HealthEducationView render:', {
    categoriesCount: categories?.length,
    selectedLesson,
    currentLesson: currentLesson?.title,
    completedCount: completedLessons.size,
    totalXP
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/20">
      <div className="container mx-auto px-4 pt-6 pb-4">
        <PageHeader
          eyebrow="HỌC TẬP TƯƠNG TÁC"
          title="Giáo dục sức khỏe"
          subtitle="Khám phá kiến thức dinh dưỡng qua các bài học tương tác, hoàn thành quiz để nhận XP và mở khóa nội dung mới"
          compact={true}
        />
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-[300px_1fr]">
          
          {/* Sidebar */}
          <div className={!showMobileSidebar && selectedLesson ? 'hidden md:block' : ''}>
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sticky top-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Bài học</h2>
              </div>
              
              <div className="mb-4 p-3 bg-emerald-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🏆</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-900">{completedLessons.size} bài hoàn thành</p>
                    <p className="text-xs text-emerald-600">{totalXP} XP</p>
                  </div>
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
          </div>

          {/* Content */}
          <div>
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
          </div>
        </div>
      </main>
    </div>
  );
}
