import { motion } from "framer-motion";
import { User, Utensils, TrendingUp, Heart, Brain, Sparkles, Target, BarChart3 } from "lucide-react";

const features = [
  {
    icon: User,
    title: "Cá nhân hóa hồ sơ",
    desc: "Nhập chiều cao, cân nặng, tuổi và mức vận động. Hệ thống tự tính BMI, BMR và TDEE chính xác.",
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-50 to-blue-100/50",
  },
  {
    icon: Utensils,
    title: "Tạo thực đơn 3 bữa",
    desc: "Thực đơn sáng, trưa, tối được cá nhân hóa dựa trên BMI, TDEE, mục tiêu và sở thích ăn uống của bạn.",
    gradient: "from-primary-500 to-primary-600",
    bgGradient: "from-primary-50 to-primary-100/50",
  },
  {
    icon: TrendingUp,
    title: "Theo dõi tiến độ tăng cân",
    desc: "Cập nhật cân nặng định kỳ và xem xu hướng tăng, giữ nguyên hoặc giảm theo từng lần ghi nhận.",
    gradient: "from-orange-500 to-orange-600",
    bgGradient: "from-orange-50 to-orange-100/50",
  },
  {
    icon: Heart,
    title: "Nhật ký & món yêu thích",
    desc: "Lưu món ăn yêu thích, đánh dấu đã ăn và xây dựng thói quen ăn uống lành mạnh mỗi ngày.",
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-50 to-purple-100/50",
  },
  {
    icon: Brain,
    title: "AI nhận diện nguyên liệu",
    desc: "Công nghệ CLIP nhận diện 26 nguyên liệu từ hình ảnh với độ chính xác 76.26%. Chỉ cần chụp ảnh món ăn.",
    gradient: "from-accent-500 to-accent-600",
    bgGradient: "from-accent-50 to-accent-100/50",
  },
  {
    icon: Target,
    title: "Mục tiêu thông minh",
    desc: "Thiết lập và theo dõi các mục tiêu cân nặng với lộ trình tăng cân khoa học và an toàn.",
    gradient: "from-pink-500 to-pink-600",
    bgGradient: "from-pink-50 to-pink-100/50",
  },
  {
    icon: BarChart3,
    title: "Báo cáo chi tiết",
    desc: "Xem báo cáo dinh dưỡng chi tiết với biểu đồ trực quan về calories, protein, carbs và fat.",
    gradient: "from-cyan-500 to-cyan-600",
    bgGradient: "from-cyan-50 to-cyan-100/50",
  },
  {
    icon: Sparkles,
    title: "Giao diện hiện đại",
    desc: "Trải nghiệm người dùng mượt mà với giao diện đẹp mắt, dễ sử dụng trên mọi thiết bị.",
    gradient: "from-emerald-500 to-emerald-600",
    bgGradient: "from-emerald-50 to-emerald-100/50",
  },
];

export default function FeatureSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };
  
  return (
    <section id="features" className="relative py-20 bg-gradient-to-b from-white via-primary-50/30 to-white sm:py-32 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-secondary-300/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel>Tính năng</SectionLabel>
          <h2 className="mt-6 text-4xl font-black text-brand-navy sm:text-5xl lg:text-6xl">
            Mọi thứ bạn cần để
            <br />
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              tăng cân lành mạnh
            </span>
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-brand-text-sub">
            NutriGain tích hợp công cụ dinh dưỡng thông minh giúp bạn đạt mục tiêu cân nặng một cách khoa học và bền vững.
          </p>
        </motion.div>
        
        {/* Features Grid */}
        <motion.div
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }) {
  const Icon = feature.icon;
  
  return (
    <motion.div
      className={`group relative rounded-3xl bg-gradient-to-br ${feature.bgGradient} border border-white/50 p-6 shadow-soft hover:shadow-soft-xl transition-all duration-300`}
      whileHover={{ y: -8, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      {/* Icon Container */}
      <motion.div
        className={`relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
        whileHover={{ rotate: 5, scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="h-8 w-8" strokeWidth={2.5} />
        
        {/* Glow Effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
      </motion.div>
      
      {/* Content */}
      <h3 className="mt-5 text-lg font-bold text-brand-navy">
        {feature.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-text-sub">
        {feature.desc}
      </p>
      
      {/* Hover Arrow */}
      <motion.div
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ x: -10 }}
        whileHover={{ x: 0 }}
      >
        Tìm hiểu thêm
        <svg className="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export function SectionLabel({ children }) {
  return (
    <motion.div
      className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 backdrop-blur-sm px-5 py-2.5 text-sm font-bold text-primary-600 shadow-soft"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
      {children}
    </motion.div>
  );
}
