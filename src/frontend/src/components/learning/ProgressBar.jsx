/**
 * ProgressBar - Sticky scroll progress indicator
 * Task 5.2
 */

import { motion } from 'framer-motion';

export default function ProgressBar({ progress, unlocked }) {
  return (
    <div className="sticky top-0 z-10 py-3 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] -mx-2 px-4 sm:-mx-8 sm:px-8 rounded-t-[20px]">
      <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
        <span className="font-bold flex items-center gap-2">
          {unlocked ? '✨' : '📖'} Tiến độ bài học
        </span>
        <span className="font-black text-emerald-600">{progress.toFixed(0)}%</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className={`h-full rounded-full ${
            unlocked
              ? 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
              : 'bg-gradient-to-r from-blue-400 to-indigo-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      {unlocked && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          Phần trắc nghiệm đã được mở khóa!
        </motion.p>
      )}
    </div>
  );
}
