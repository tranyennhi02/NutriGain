import { motion } from "framer-motion";
import { FileText, Calculator, Utensils, TrendingUp, ArrowRight } from "lucide-react";
import { SectionLabel } from "./FeatureSection";

const steps = [
  {
    num: "01",
    icon: FileText,
    title: "Nhập hồ sơ",
    desc: "Điền chiều cao, cân nặng, tuổi, giới tính và mức độ vận động hàng ngày.",
    color: "from-blue-500 to-blue-600",
  },
  {
    num: "02",
    icon: Calculator,
    title: "Tính BMI / BMR / TDEE",
    desc: "Hệ thống tự động tính chỉ số cơ thể và nhu cầu calo cá nhân hóa.",
    color: "from-primary-500 to-primary-600",
  },
  {
    num: "03",
    icon: Utensils,
    title: "Tạo thực đơn 3 bữa",
    desc: "Nhận thực đơn sáng, trưa, tối được cá nhân hóa dựa trên BMI < 23 và mục tiêu tăng cân.",
    color: "from-accent-500 to-accent-600",
  },
  {
    num: "04",
    icon: TrendingUp,
    title: "Theo dõi mỗi ngày",
    desc: "Đánh dấu đã ăn, xem biểu đồ macro và cập nhật cân nặng định kỳ.",
    color: "from-orange-500 to-orange-600",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-20 bg-gradient-to-b from-white to-primary-50/50 sm:py-32 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-300/10 rounded-full blur-3xl" />
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
          <SectionLabel>Cách hoạt động</SectionLabel>
          <h2 className="mt-6 text-4xl font-black text-brand-navy sm:text-5xl lg:text-6xl">
            Chỉ{" "}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              4 bước
            </span>
            {" "}để bắt đầu
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-lg text-brand-text-sub">
            Không cần kiến thức dinh dưỡng chuyên sâu. NutriGain làm hết phần khó, bạn chỉ cần làm theo.
          </p>
        </motion.div>
        
        {/* Steps Grid */}
        <div className="mt-16 relative">
          {/* Connection Lines - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-primary-500 via-accent-500 to-orange-500"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
              style={{ transformOrigin: "left" }}
            />
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <StepCard key={step.num} step={step} index={index} />
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <a
            href="#cta"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-1 transition-all"
          >
            Bắt đầu ngay hôm nay
            <ArrowRight className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function StepCard({ step, index }) {
  const Icon = step.icon;
  
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <motion.div
        className="relative rounded-3xl border border-white/50 bg-white/80 backdrop-blur-sm p-7 shadow-soft hover:shadow-soft-xl transition-all duration-300"
        whileHover={{ y: -8, scale: 1.02 }}
      >
        {/* Step Number */}
        <div className="absolute -top-4 -left-4">
          <motion.div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg font-black text-lg`}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            {step.num}
          </motion.div>
        </div>
        
        {/* Icon */}
        <div className="mt-4 mb-6">
          <motion.div
            className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg`}
            whileHover={{ rotate: -10, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="h-8 w-8" strokeWidth={2.5} />
          </motion.div>
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-bold text-brand-navy">
          {step.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-brand-text-sub">
          {step.desc}
        </p>
        
        {/* Arrow Indicator */}
        {index < steps.length - 1 && (
          <motion.div
            className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
          >
            <ArrowRight className={`h-8 w-8 bg-gradient-to-r ${step.color} bg-clip-text text-transparent`} />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
