import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Activity, Brain, Zap, Star } from "lucide-react";
import AnimatedBackground, { FloatingIcons } from "./AnimatedBackground";

export default function HeroSection({ onShowAuth }) {
  const badges = [
    { icon: <Activity className="h-4 w-4" />, text: "Tự động tính BMI, BMR, TDEE" },
    { icon: <TrendingUp className="h-4 w-4" />, text: "Thực đơn 3 bữa cá nhân hóa" },
    { icon: <Brain className="h-4 w-4" />, text: "AI nhận diện 26 nguyên liệu" },
  ];
  
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,#f0fdf4,transparent_50%),radial-gradient(ellipse_at_bottom_right,#dbeafe,transparent_50%),linear-gradient(to_bottom,#ffffff,#fefce8)] py-20 sm:py-32">
      {/* Animated Background */}
      <AnimatedBackground variant="hero" />
      <FloatingIcons />
      
      {/* Animated Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)] pointer-events-none" />
      
      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-primary-400/20 via-emerald-400/20 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-40 left-10 w-96 h-96 bg-gradient-to-tr from-blue-400/20 via-cyan-400/20 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        {/* Left Content */}
        <div className="max-w-xl">
          {/* Badge with glow effect */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-gradient-to-r from-white/90 to-emerald-50/90 backdrop-blur-md px-5 py-2.5 text-sm font-bold text-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.2),0_8px_16px_rgba(0,0,0,0.1)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16,185,129,0.3), 0 12px 24px rgba(0,0,0,0.15)" }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className="h-4 w-4 text-emerald-500" />
            </motion.div>
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Hệ thống dinh dưỡng AI thông minh
            </span>
            <motion.div
              className="h-2 w-2 rounded-full bg-emerald-500"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1
            className="mt-8 text-5xl font-black leading-[1.1] tracking-tight text-brand-navy sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Tăng cân{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 bg-clip-text text-transparent">
                khoa học
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 h-3 w-full bg-gradient-to-r from-primary-500/30 to-secondary-500/30 blur-sm"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </span>
            {" "}cùng AI
          </motion.h1>
          
          {/* Description */}
          <motion.p
            className="mt-6 text-lg leading-relaxed text-brand-text-sub sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            NutriGain tự động tính BMI, BMR, TDEE và tạo thực đơn 3 bữa (sáng, trưa, tối) cá nhân hóa cho người gầy. 
            AI nhận diện 26 nguyên liệu từ hình ảnh với độ chính xác 76%.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.button
              onClick={() => onShowAuth("register")}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Bắt đầu miễn phí
              <ArrowIcon />
            </motion.button>
            <motion.a
              href="#how-it-works"
              className="flex items-center gap-2 rounded-2xl border-2 border-brand-border bg-white px-8 py-4 text-base font-bold text-brand-text-main shadow-soft hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Xem cách hoạt động
            </motion.a>
          </motion.div>
          
          {/* Feature Badges */}
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {badges.map((badge, index) => (
              <motion.span
                key={badge.text}
                className="flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-brand-text-sub shadow-soft"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <span className="text-primary-500">{badge.icon}</span>
                {badge.text}
              </motion.span>
            ))}
          </motion.div>
        </div>
        
        {/* Right - Dashboard Preview */}
        <motion.div
          className="flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <DashboardMockup />
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="flex flex-col items-center gap-2 text-brand-text-sub">
          <span className="text-xs font-semibold uppercase tracking-wider">Cuộn xuống</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <motion.div
      className="relative w-full max-w-[520px]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      {/* Main Card */}
      <motion.div
        className="rounded-3xl border border-white/20 bg-white/90 backdrop-blur-xl p-6 shadow-2xl shadow-slate-900/20"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600">Hôm nay</p>
            <p className="text-4xl font-black text-brand-navy mt-1">
              1.840{" "}
              <span className="text-sm font-semibold text-brand-text-sub">/ 2.203 kcal</span>
            </p>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30">
            <span className="text-3xl">🎯</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-4 rounded-full bg-primary-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
            initial={{ width: 0 }}
            animate={{ width: "83%" }}
            transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
          />
        </div>
        
        {/* Macros Grid */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Protein", value: "87g", color: "from-blue-500 to-blue-600", pct: "75%" },
            { label: "Carbs", value: "241g", color: "from-primary-500 to-primary-600", pct: "80%" },
            { label: "Fat", value: "58g", color: "from-orange-500 to-orange-600", pct: "66%" },
          ].map((macro, i) => (
            <motion.div
              key={macro.label}
              className="rounded-2xl bg-gradient-to-br from-white to-primary-50/30 p-4 border border-primary-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
            >
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${macro.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: macro.pct }}
                  transition={{ duration: 1, delay: 1.5 + i * 0.1 }}
                />
              </div>
              <div className="mt-3 text-lg font-black text-brand-navy">{macro.value}</div>
              <div className="text-xs font-semibold text-brand-text-sub">{macro.label}</div>
            </motion.div>
          ))}
        </div>
        
        {/* Meals */}
        <div className="mt-6 space-y-2">
          {[
            { name: "Bữa sáng", items: "Yến mạch + Chuối + Sữa tươi", kcal: 520, icon: "🌅" },
            { name: "Bữa trưa", items: "Cơm trắng + Cá hồi + Rau cải", kcal: 710, icon: "☀️" },
          ].map((meal, i) => (
            <motion.div
              key={meal.name}
              className="flex items-center justify-between rounded-2xl border border-primary-100 bg-white/80 backdrop-blur-sm px-4 py-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.6 + i * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{meal.icon}</span>
                <div>
                  <p className="text-sm font-bold text-brand-navy">{meal.name}</p>
                  <p className="text-xs font-medium text-brand-text-sub mt-0.5">{meal.items}</p>
                </div>
              </div>
              <span className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-primary-500/30">
                {meal.kcal} kcal
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Floating Badge - BMI */}
      <motion.div
        className="absolute -top-6 -right-6 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/90 backdrop-blur-xl px-5 py-4 shadow-2xl"
        initial={{ opacity: 0, scale: 0, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 1.8 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <span className="text-3xl">📈</span>
        <div>
          <p className="text-xs font-bold text-brand-text-sub">BMI</p>
          <p className="text-2xl font-black text-primary-600">17.4</p>
        </div>
      </motion.div>
      
      {/* Floating Badge - AI */}
      <motion.div
        className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl border border-white/20 bg-gradient-to-br from-secondary-500 to-secondary-600 px-5 py-4 shadow-2xl text-white"
        initial={{ opacity: 0, scale: 0, rotate: 10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 2 }}
        whileHover={{ scale: 1.1, rotate: -5 }}
      >
        <span className="text-2xl">✨</span>
        <p className="text-sm font-bold">AI Cá nhân hóa</p>
      </motion.div>
    </motion.div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
