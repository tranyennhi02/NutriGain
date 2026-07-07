/**
 * CompletionAnimation - Celebration animation for lesson completion
 * Task 8.3
 */

import { motion } from 'framer-motion';
import { Trophy, Award, Star } from 'lucide-react';

export default function CompletionAnimation({ xpEarned, onContinue }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onContinue}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', bounce: 0.5 }}
      >
        {/* Trophy Animation */}
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            duration: 0.6, 
            bounce: 0.5,
            delay: 0.2 
          }}
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            >
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Chúc mừng!
        </h2>
        <p className="text-slate-600 mb-6">
          Bạn đã hoàn thành bài học thành công
        </p>

        {/* XP Earned */}
        <motion.div
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full font-bold text-lg mb-6"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3, times: [0, 0.5, 1], delay: 0.6 }}
        >
          <Award className="w-6 h-6" />
          +{xpEarned} XP
        </motion.div>

        <button
          onClick={onContinue}
          className="w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
        >
          Tiếp tục học tập
        </button>
      </motion.div>
    </motion.div>
  );
}
