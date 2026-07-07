/**
 * ProgressBar - Sticky scroll progress indicator
 * Task 5.2
 */

import { motion } from 'framer-motion';

export default function ProgressBar({ progress, unlocked }) {
  return (
    <div className="sticky top-0 z-10 -mx-6 -mt-6 mb-6 px-6 py-3 bg-white border-b border-slate-100">
      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
        <span className="font-semibold">Tiến độ đọc</span>
        <span>{progress.toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            unlocked
              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
              : 'bg-gradient-to-r from-emerald-500 to-blue-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>
      {unlocked && (
        <p className="text-xs text-green-600 font-semibold mt-1 animate-pulse">
          ✓ Quiz đã mở khóa!
        </p>
      )}
    </div>
  );
}
