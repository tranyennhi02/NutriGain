/**
 * NextLessonRecommendation - Suggest next lesson after completion
 * Tasks 9.1, 9.2
 */

import { motion } from 'framer-motion';
import { ArrowRight, Clock, BarChart3 } from 'lucide-react';

export default function NextLessonRecommendation({ lesson, onSelect }) {
  if (!lesson) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 text-center"
      >
        <div className="text-6xl mb-4">🎊</div>
        <h3 className="text-2xl font-bold text-amber-900 mb-2">
          Hoàn thành tất cả!
        </h3>
        <p className="text-amber-700">
          Bạn đã hoàn thành toàn bộ khóa học. Xuất sắc!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
    >
      <p className="text-sm font-semibold text-blue-900 mb-3">
        📚 Bài học tiếp theo
      </p>
      
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {lesson.title}
          </h3>
          
          <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
            <span className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              {lesson.difficulty}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {lesson.duration} phút
            </span>
          </div>
          
          {lesson.summary && (
            <p className="text-sm text-slate-600 mb-4">
              {lesson.summary}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => onSelect(lesson.id)}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
      >
        Bắt đầu học
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
