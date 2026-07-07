import { Trophy } from 'lucide-react';

export default function FloatingXPCounter({ totalXP }) {
  return (
    <div className="fixed top-24 right-6 z-20">
      <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-lg border-2 border-emerald-200 hover:shadow-xl transition">
        <Trophy className="w-5 h-5 text-amber-500" />
        <span className="font-bold text-emerald-900">{totalXP} XP</span>
      </div>
    </div>
  );
}
