/**
 * QuizSection - Interactive quiz component
 * Tasks 6.1, 6.2, 6.3
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import quizValidator from '../../utils/learning/QuizValidator';

export default function QuizSection({ quiz, quizState, onSubmit, lessonId }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // When lesson changes or when quizState indicates it hasn't been submitted, we should reset local state
  useEffect(() => {
    if (!quizState.submitted) {
      setSelectedAnswers({});
      setShowResults(false);
    }
  }, [lessonId, quizState.submitted]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = () => {
    const answers = quiz.map(q => ({
      questionId: q.id,
      selectedIndex: selectedAnswers[q.id]
    }));

    const validation = quizValidator.validateSubmission(quiz, answers);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    const score = quizValidator.calculateScore(quiz, answers);
    setShowResults(true);
    onSubmit(score, answers);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const canRetry = quizValidator.canRetry(lessonId);
  const remainingTime = quizValidator.getRemainingLockTime(lessonId);

  if (!quizState.unlocked) {
    return (
      <div className="p-6 bg-slate-100 rounded-xl text-center">
        <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-3 flex items-center justify-center">
          <span className="text-3xl">🔒</span>
        </div>
        <p className="text-slate-600 font-semibold">
          Đọc ít nhất 80% bài học để mở khóa quiz
        </p>
      </div>
    );
  }

  if (!canRetry && remainingTime > 0) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <p className="text-red-900 font-bold mb-2">Quiz tạm thời bị khóa</p>
        <p className="text-red-700 text-sm">
          Bạn đã thử {quizValidator.MAX_ATTEMPTS} lần. Vui lòng đợi{' '}
          <strong>{quizValidator.formatRemainingTime(remainingTime)}</strong>
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-[32px] border border-indigo-100 shadow-sm"
    >
      <h2 className="text-2xl font-black text-indigo-900 mb-6 flex items-center gap-3 tracking-tight">
        <span className="p-2 bg-indigo-100 rounded-xl text-2xl">🎯</span> 
        Kiểm tra kiến thức
      </h2>

      <div className="space-y-8">
        {quiz.map((question, qIndex) => (
          <div key={question.id} className="bg-white p-6 rounded-[24px] border border-indigo-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <p className="font-bold text-slate-900 mb-4 text-[17px]">
              <span className="text-indigo-500 mr-2">Câu {qIndex + 1}:</span>
              {question.questionText}
            </p>
            
            <div className="space-y-3">
              {question.options.map((option, optIndex) => {
                const isSelected = selectedAnswers[question.id] === optIndex;
                const isCorrect = optIndex === question.correctAnswerIndex;
                const showCorrect = showResults && isCorrect;
                const showWrong = showResults && isSelected && !isCorrect;

                return (
                  <button
                    key={optIndex}
                    onClick={() => handleAnswerSelect(question.id, optIndex)}
                    disabled={showResults}
                    className={`
                      w-full p-4 rounded-xl text-left transition-all border-2 flex items-start gap-3
                      ${isSelected && !showResults 
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-inner' 
                        : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                      }
                      ${showCorrect ? 'border-emerald-500 bg-emerald-50/50 shadow-inner' : ''}
                      ${showWrong ? 'border-rose-500 bg-rose-50/50 shadow-inner' : ''}
                      ${showResults ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'}
                    `}
                  >
                    <div className={`
                      flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors
                      ${isSelected && !showResults ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}
                      ${showCorrect ? 'border-emerald-500 bg-emerald-500' : ''}
                      ${showWrong ? 'border-rose-500 bg-rose-500' : ''}
                    `}>
                      {(isSelected || showCorrect) && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`font-medium ${showCorrect ? 'text-emerald-900' : showWrong ? 'text-rose-900' : 'text-slate-700'}`}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {showResults && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 bg-indigo-50/50 rounded-xl text-[15px] text-indigo-900 border border-indigo-100/50">
                <strong className="flex items-center gap-2 mb-1 text-indigo-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Giải thích:
                </strong> 
                {question.explanation}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {!showResults && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selectedAnswers).length !== quiz.length}
          className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none transition-all"
        >
          Hoàn thành nộp bài ({Object.keys(selectedAnswers).length}/{quiz.length})
        </button>
      )}

      {showResults && quizState.score >= 70 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-8 p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-[24px] text-center shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-200/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="text-7xl mb-4 relative z-10 drop-shadow-md animate-bounce">🎉</div>
          <h3 className="text-3xl font-black text-emerald-900 mb-2 relative z-10">
            Xuất sắc!
          </h3>
          <p className="text-emerald-700 text-lg font-medium relative z-10">
            Bạn đã đạt điểm số: <span className="font-black text-2xl text-emerald-600 ml-1">{quizState.score}%</span>
          </p>
        </motion.div>
      )}

      {showResults && quizState.score < 70 && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-8 p-8 bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200 rounded-[24px] text-center shadow-sm"
        >
          <div className="text-6xl mb-4 drop-shadow-sm">😔</div>
          <h3 className="text-2xl font-black text-rose-900 mb-2">
            Chưa đạt yêu cầu
          </h3>
          <p className="text-rose-700 mb-1 font-medium text-lg">
            Điểm số: <strong className="text-rose-600 text-xl">{quizState.score}%</strong> (Cần ≥70%)
          </p>
          <p className="text-sm text-rose-500 font-medium mb-6">
            Số lần thử nghiệm: {quizState.attempts}/{quizValidator.MAX_ATTEMPTS}
          </p>
          
          <button
            onClick={handleRetry}
            className="px-8 py-3 bg-white border-2 border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-all shadow-sm"
          >
            Làm lại bài kiểm tra
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
