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
      className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200"
    >
      <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
        🎯 Kiểm tra kiến thức
      </h2>

      <div className="space-y-6">
        {quiz.map((question, qIndex) => (
          <div key={question.id} className="bg-white p-5 rounded-lg border border-blue-100">
            <p className="font-semibold text-slate-900 mb-3">
              {qIndex + 1}. {question.questionText}
            </p>
            
            <div className="space-y-2">
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
                      w-full p-3 rounded-lg text-left transition border-2
                      ${isSelected && !showResults 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200 hover:border-blue-300'
                      }
                      ${showCorrect ? 'border-green-500 bg-green-50' : ''}
                      ${showWrong ? 'border-red-500 bg-red-50' : ''}
                      ${showResults ? 'cursor-default' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${isSelected && !showResults ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}
                        ${showCorrect ? 'border-green-500 bg-green-500' : ''}
                        ${showWrong ? 'border-red-500 bg-red-500' : ''}
                      `}>
                        {(isSelected || showCorrect) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={showCorrect ? 'text-green-900 font-semibold' : showWrong ? 'text-red-900' : 'text-slate-700'}>
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {showResults && (
              <div className="mt-3 p-3 bg-blue-50 rounded text-sm text-blue-900">
                <strong>Giải thích:</strong> {question.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {!showResults && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selectedAnswers).length !== quiz.length}
          className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
        >
          Nộp bài ({Object.keys(selectedAnswers).length}/{quiz.length})
        </button>
      )}

      {showResults && quizState.score >= 70 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl text-center"
        >
          <div className="text-6xl mb-3">🎉</div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">
            Xuất sắc!
          </h3>
          <p className="text-green-700">
            Điểm số: <strong>{quizState.score}%</strong>
          </p>
        </motion.div>
      )}

      {showResults && quizState.score < 70 && (
        <div className="mt-6 p-6 bg-red-50 border-2 border-red-200 rounded-xl text-center">
          <div className="text-6xl mb-3">😔</div>
          <h3 className="text-2xl font-bold text-red-900 mb-2">
            Chưa đạt
          </h3>
          <p className="text-red-700 mb-2">
            Điểm số: <strong>{quizState.score}%</strong> (Cần ≥70%)
          </p>
          <p className="text-sm text-red-600">
            Lần thử: {quizState.attempts}/3
          </p>
        </div>
      )}
    </motion.div>
  );
}
