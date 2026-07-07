import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, ChevronRight, Clock, Target, Brain, CheckCircle2,
  Play, Award, TrendingUp, Lock, Unlock, Star, ArrowRight,
  ArrowLeft, X, Check, AlertCircle, Lightbulb, Trophy,
  Sparkles, Activity, Eye, ThumbsUp, MessageCircle, Share2,
  Bookmark, Menu, ChevronDown, ChevronUp, BarChart3, Zap,
  FileText, Image, Video, Headphones, Download, RefreshCw
} from "lucide-react";

// ============================================================================
// MOCK DATA - Lessons Database
// ============================================================================

const LESSONS_DATA = {
  categories: [
    {
      id: "nutrition",
      title: "Ăn Uống Lành Mạnh",
      icon: "🥗",
      color: "emerald",
      lessons: [
        {
          id: "lesson-1",
          title: "7 Nguyên Tắc Vàng Để Tăng Cân Lành Mạnh",
          difficulty: "Cơ bản",
          duration: "8 phút",
          xp: 50,
          completed: true,
          locked: false,
          progress: 100,
        },
        {
          id: "lesson-2",
          title: "Protein: Chìa Khóa Cho Cơ Bắp Săn Chắc",
          difficulty: "Trung cấp",
          duration: "12 phút",
          xp: 75,
          completed: false,
          locked: false,
          progress: 65,
        },
        {
          id: "lesson-3",
          title: "Carbohydrates: Năng Lượng Cho Cơ Thể",
          difficulty: "Cơ bản",
          duration: "10 phút",
          xp: 50,
          completed: false,
          locked: true,
          progress: 0,
        },
      ],
    },
    {
      id: "exercise",
      title: "Vận Động & Tập Luyện",
      icon: "💪",
      color: "blue",
      lessons: [
        {
          id: "lesson-4",
          title: "Bài Tập Tăng Cơ Cho Người Gầy",
          difficulty: "Trung cấp",
          duration: "15 phút",
          xp: 75,
          completed: false,
          locked: false,
          progress: 0,
        },
      ],
    },
  ],
};

const LESSON_CONTENT = {
  "lesson-1": {
    title: "7 Nguyên Tắc Vàng Để Tăng Cân Lành Mạnh",
    heroImage: "gradient-emerald",
    difficulty: "Cơ bản",
    duration: "8 phút",
    views: "2.3K",
    likes: 245,
    aiSummary: "Bài học này cung cấp 7 nguyên tắc cốt lõi giúp bạn tăng cân một cách khoa học và bền vững. Từ việc ăn đủ năng lượng, tăng protein, đến việc ngủ đủ giấc và tập luyện hợp lý.",
    objectives: [
      "Hiểu rõ cách tăng cân khỏe mạnh không phải là ăn bừa",
      "Nắm vững 7 nguyên tắc vàng để áp dụng hàng ngày",
      "Xây dựng thói quen ăn uống lành mạnh và bền vững",
    ],
    content: [
      {
        type: "heading",
        text: "Giới Thiệu",
      },
      {
        type: "paragraph",
        text: "Tăng cân lành mạnh không phải là việc ăn càng nhiều càng tốt hay chỉ tập trung vào đồ ngọt, đồ chiên. Đó là một quá trình khoa học, cần sự kiên trì và hiểu biết đúng đắn về cơ thể.",
      },
      {
        type: "heading",
        text: "1. Ăn Đủ Năng Lượng (Surplus Calories)",
      },
      {
        type: "paragraph",
        text: "Để tăng cân, bạn cần ăn nhiều hơn số calories cơ thể đốt cháy mỗi ngày. Mức thừa lý tưởng là 300-500 calories/ngày.",
      },
      {
        type: "highlight",
        text: "💡 Mẹo: Thêm 1-2 bữa phụ nhỏ giữa các bữa chính thay vì ăn quá no trong 1 bữa.",
      },
      {
        type: "heading",
        text: "2. Protein Là Chìa Khóa",
      },
      {
        type: "paragraph",
        text: "Protein giúp xây dựng và phục hồi cơ bắp. Mục tiêu: 1.6-2g protein/kg cân nặng mỗi ngày.",
      },
      {
        type: "list",
        items: [
          "Trứng: 6-7g protein/quả",
          "Thịt gà: 25-30g protein/100g",
          "Cá: 20-25g protein/100g",
          "Sữa: 8g protein/ly 250ml",
        ],
      },
    ],
    keyTakeaways: [
      "Ăn đủ calories thừa 300-500 cal/ngày",
      "Đảm bảo 1.6-2g protein/kg cân nặng",
      "Ăn 4-6 bữa nhỏ thay vì 2-3 bữa lớn",
      "Ngủ đủ 7-9 giờ mỗi đêm",
      "Vận động nhẹ 3-4 lần/tuần",
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          question: "Mức thừa calories lý tưởng để tăng cân lành mạnh là bao nhiêu?",
          options: [
            { id: "a", text: "100-200 cal/ngày", correct: false },
            { id: "b", text: "300-500 cal/ngày", correct: true },
            { id: "c", text: "800-1000 cal/ngày", correct: false },
            { id: "d", text: "Càng nhiều càng tốt", correct: false },
          ],
        },
        {
          id: "q2",
          question: "Lượng protein khuyến nghị mỗi ngày là bao nhiêu?",
          options: [
            { id: "a", text: "0.5-1g/kg cân nặng", correct: false },
            { id: "b", text: "1.6-2g/kg cân nặng", correct: true },
            { id: "c", text: "3-4g/kg cân nặng", correct: false },
            { id: "d", text: "Không cần quan tâm", correct: false },
          ],
        },
      ],
    },
    nextLesson: "lesson-2",
  },
};

// ============================================================================
// MAIN LEARNING VIEW COMPONENT
// ============================================================================

export default function LessonLearningView() {
  const [selectedLesson, setSelectedLesson] = useState("lesson-1");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const contentRef = useRef(null);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener("scroll", handleScroll);
      return () => content.removeEventListener("scroll", handleScroll);
    }
  }, [selectedLesson]);

  const handleLessonClick = (lessonId) => {
    setSelectedLesson(lessonId);
    setShowQuiz(false);
    setQuizSubmitted(false);
    setQuizAnswers({});
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  const lesson = LESSON_CONTENT[selectedLesson];
  const lessonMeta = LESSONS_DATA.categories
    .flatMap(c => c.lessons)
    .find(l => l.id === selectedLesson);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Lesson Panel - Sidebar (30% on desktop, hidden on mobile when lesson selected) */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`
              fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 shadow-lg
              w-full
              md:w-[280px] md:relative md:shadow-none
              lg:w-[30%] lg:max-w-[400px]
              ${sidebarOpen ? '' : 'hidden md:block'}
            `}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-4 md:p-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-black text-slate-900">Bài Học</h2>
              </div>
              {/* Mobile close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden rounded-lg p-2 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
              {/* Desktop collapse button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="hidden lg:block rounded-lg p-2 hover:bg-slate-100 transition"
              >
                <ChevronLeft className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* Lesson List */}
            <div className="h-[calc(100vh-80px)] overflow-y-auto p-4 md:p-6">
              {LESSONS_DATA.categories.map((category) => (
                <div key={category.id} className="mb-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-sm font-bold text-slate-700">{category.title}</h3>
                  </div>
                  <div className="space-y-2">
                    {category.lessons.map((lessonItem) => (
                      <button
                        key={lessonItem.id}
                        onClick={() => {
                          handleLessonClick(lessonItem.id);
                          // Auto-hide sidebar on mobile when lesson selected
                          if (window.innerWidth < 768) {
                            setSidebarOpen(false);
                          }
                        }}
                        disabled={lessonItem.locked}
                        className={`
                          w-full rounded-xl border p-4 text-left transition-all
                          ${selectedLesson === lessonItem.id
                            ? 'border-emerald-500 bg-emerald-50 shadow-md'
                            : lessonItem.locked
                            ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`
                            flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg
                            ${selectedLesson === lessonItem.id
                              ? 'bg-emerald-600'
                              : lessonItem.completed
                              ? 'bg-emerald-500'
                              : lessonItem.locked
                              ? 'bg-slate-300'
                              : 'bg-slate-200'
                            }
                          `}>
                            {lessonItem.locked ? (
                              <Lock className="h-5 w-5 text-white" />
                            ) : lessonItem.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-white" />
                            ) : (
                              <BookOpen className="h-5 w-5 text-slate-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 line-clamp-2">
                              {lessonItem.title}
                            </h4>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {lessonItem.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                {lessonItem.xp} XP
                              </span>
                            </div>
                            {lessonItem.progress > 0 && !lessonItem.completed && (
                              <div className="mt-2">
                                <div className="h-1 overflow-hidden rounded-full bg-slate-200">
                                  <div
                                    className="h-full bg-emerald-500 transition-all"
                                    style={{ width: `${lessonItem.progress}%` }}
                                  />
                                </div>
                                <p className="mt-1 text-xs text-slate-500">{lessonItem.progress}% hoàn thành</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Content Panel (70% on desktop, 100% on mobile) */}
      <main className={`
        flex-1 flex flex-col h-screen overflow-hidden
        ${sidebarOpen ? 'hidden md:flex' : 'flex'}
        ${!sidebarOpen && window.innerWidth >= 1024 ? 'w-full' : ''}
      `}>
        {/* Top Bar with Mobile Menu Button */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className={`
              rounded-lg p-2 hover:bg-slate-100 transition
              ${sidebarOpen ? 'hidden' : 'block'}
            `}
          >
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">{lesson?.views} lượt xem</span>
            <span className="sm:hidden">{lesson?.views}</span>
          </div>
        </div>

        {/* Progress Bar (Sticky) */}
        <div className="sticky top-0 z-20 h-1 bg-slate-200">
          <motion.div
            className={`h-full transition-colors ${
              scrollProgress >= 80 ? 'bg-emerald-500' : 'bg-blue-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${scrollProgress}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>

        {/* Scrollable Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8"
        >
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 md:p-10 text-white shadow-lg"
          >
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">
                {lesson?.difficulty}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {lesson?.duration}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {lesson?.likes}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black leading-tight">{lesson?.title}</h1>
          </motion.div>

          {/* AI Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-6"
          >
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h2 className="text-sm font-bold text-blue-900">Tóm Tắt AI</h2>
            </div>
            <p className="text-sm leading-relaxed text-blue-800">{lesson?.aiSummary}</p>
          </motion.div>

          {/* Learning Objectives */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8 rounded-xl border border-slate-200 bg-white p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Mục Tiêu Học Tập</h2>
            </div>
            <ul className="space-y-2">
              {lesson?.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                  <span className="text-sm text-slate-700">{obj}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Main Content - Markdown Rendered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-8 rounded-xl border border-slate-200 bg-white p-6 md:p-8 prose prose-slate max-w-none"
          >
            {lesson?.content.map((section, idx) => {
              if (section.type === "heading") {
                return (
                  <h2 key={idx} className="text-xl md:text-2xl font-black text-slate-900 mt-6 mb-3">
                    {section.text}
                  </h2>
                );
              }
              if (section.type === "paragraph") {
                return (
                  <p key={idx} className="text-sm md:text-base text-slate-700 leading-relaxed mb-4">
                    {section.text}
                  </p>
                );
              }
              if (section.type === "highlight") {
                return (
                  <div key={idx} className="my-4 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-4">
                    <p className="text-sm text-emerald-800">{section.text}</p>
                  </div>
                );
              }
              if (section.type === "list") {
                return (
                  <ul key={idx} className="my-4 space-y-2 pl-6">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-sm md:text-base text-slate-700 list-disc">{item}</li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </motion.div>

          {/* Key Takeaways */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-8 rounded-xl border border-orange-200 bg-orange-50 p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-bold text-orange-900">Điểm Chính Cần Nhớ</h2>
            </div>
            <ul className="space-y-2">
              {lesson?.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-orange-600 mt-0.5" />
                  <span className="text-sm text-orange-800">{takeaway}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quiz Button (Unlocked at 80% scroll) */}
          <AnimatePresence>
            {scrollProgress >= 80 && !showQuiz && (
              <motion.button
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setShowQuiz(true)}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 text-center shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="flex items-center justify-center gap-3">
                  <Trophy className="h-6 w-6 text-white" />
                  <span className="text-lg font-black text-white">Bắt Đầu Bài Kiểm Tra</span>
                  <ArrowRight className="h-6 w-6 text-white" />
                </div>
                <p className="mt-2 text-sm text-white/80">Hoàn thành để nhận {lessonMeta?.xp} XP</p>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Quiz Section */}
          <AnimatePresence>
            {showQuiz && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Brain className="h-6 w-6 text-emerald-600" />
                    <h2 className="text-xl font-black text-emerald-900">Bài Kiểm Tra</h2>
                  </div>
                  <p className="text-sm text-emerald-700">
                    Trả lời đúng ít nhất 70% để hoàn thành bài học và nhận XP
                  </p>
                </div>

                {lesson?.quiz.questions.map((q, qIdx) => (
                  <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-base md:text-lg font-bold text-slate-900">
                      {qIdx + 1}. {q.question}
                    </h3>
                    <div className="space-y-3">
                      {q.options.map((option) => {
                        const isSelected = quizAnswers[q.id] === option.id;
                        const isCorrect = option.correct;
                        const showFeedback = quizSubmitted;

                        return (
                          <button
                            key={option.id}
                            onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [q.id]: option.id })}
                            disabled={quizSubmitted}
                            className={`
                              w-full rounded-lg border p-4 text-left transition-all
                              ${isSelected && !showFeedback
                                ? 'border-blue-500 bg-blue-50'
                                : showFeedback && isCorrect
                                ? 'border-emerald-500 bg-emerald-50'
                                : showFeedback && isSelected && !isCorrect
                                ? 'border-red-500 bg-red-50'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                              }
                              ${quizSubmitted ? 'cursor-default' : 'cursor-pointer'}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`
                                flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2
                                ${isSelected && !showFeedback
                                  ? 'border-blue-500 bg-blue-500'
                                  : showFeedback && isCorrect
                                  ? 'border-emerald-500 bg-emerald-500'
                                  : showFeedback && isSelected && !isCorrect
                                  ? 'border-red-500 bg-red-500'
                                  : 'border-slate-300'
                                }
                              `}>
                                {isSelected && !showFeedback && (
                                  <div className="h-2 w-2 rounded-full bg-white" />
                                )}
                                {showFeedback && isCorrect && (
                                  <Check className="h-4 w-4 text-white" />
                                )}
                                {showFeedback && isSelected && !isCorrect && (
                                  <X className="h-4 w-4 text-white" />
                                )}
                              </div>
                              <span className={`
                                text-sm md:text-base font-medium
                                ${showFeedback && isCorrect ? 'text-emerald-900' : 
                                  showFeedback && isSelected && !isCorrect ? 'text-red-900' : 
                                  'text-slate-900'}
                              `}>
                                {option.text}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(quizAnswers).length < lesson?.quiz.questions.length}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-4 text-center font-bold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Nộp Bài
                  </button>
                ) : (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                    <Trophy className="mx-auto h-12 w-12 text-emerald-600 mb-3" />
                    <h3 className="text-xl font-black text-emerald-900 mb-2">Chúc mừng!</h3>
                    <p className="text-sm text-emerald-700 mb-4">
                      Bạn đã hoàn thành bài học và nhận được {lessonMeta?.xp} XP
                    </p>
                    {lesson?.nextLesson && (
                      <button
                        onClick={() => handleLessonClick(lesson.nextLesson)}
                        className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 transition"
                      >
                        Bài học tiếp theo
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
