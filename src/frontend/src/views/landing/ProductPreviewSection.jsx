import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Utensils, TrendingUp, BookOpen, Check, Clock } from "lucide-react";
import { SectionLabel } from "./FeatureSection";

const screens = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    title: "Dashboard tổng quan",
    desc: "Xem calories, macro và tiến độ ngày hôm nay chỉ trong một màn hình. Theo dõi mọi thứ một cách trực quan và dễ hiểu.",
    preview: <DashboardPreview />,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "meal-plan",
    label: "Kế hoạch bữa ăn",
    icon: Utensils,
    title: "Kế hoạch 3 bữa cá nhân hóa",
    desc: "Thực đơn sáng, trưa, tối cá nhân hóa dựa trên BMI < 23 và mục tiêu tăng cân. AI content-based filtering tự động cân đối dinh dưỡng.",
    preview: <MealPlanPreview />,
    color: "from-primary-500 to-primary-600",
  },
  {
    id: "charts",
    label: "Theo dõi cân nặng",
    icon: TrendingUp,
    title: "Theo dõi tăng cân thông minh",
    desc: "Cập nhật cân nặng định kỳ và xem xu hướng tăng cân theo dữ liệu thật bạn nhập. Biểu đồ trực quan giúp đánh giá tiến độ.",
    preview: <ChartsPreview />,
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "journal",
    label: "Nhật ký",
    icon: BookOpen,
    title: "Nhật ký ăn uống hàng ngày",
    desc: "Ghi lại từng bữa ăn, đánh dấu đã ăn và xem tổng kết ngày. Xây dựng thói quen ăn uống lành mạnh.",
    preview: <JournalPreview />,
    color: "from-purple-500 to-purple-600",
  },
];

export default function ProductPreviewSection() {
  const [active, setActive] = useState("dashboard");
  const current = screens.find((s) => s.id === active);

  return (
    <section id="preview" className="relative py-20 bg-white sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl" />
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
          <SectionLabel>Giao diện sản phẩm</SectionLabel>
          <h2 className="mt-6 text-4xl font-black text-brand-navy sm:text-5xl lg:text-6xl">
            Xem trước{" "}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              các tính năng
            </span>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-lg text-brand-text-sub">
            Giao diện sạch, trực quan và dễ sử dụng ngay từ lần đầu. Được thiết kế để bạn tập trung vào mục tiêu.
          </p>
        </motion.div>

        {/* Tab bar */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {screens.map((screen, index) => {
            const Icon = screen.icon;
            const isActive = active === screen.id;
            
            return (
              <motion.button
                key={screen.id}
                onClick={() => setActive(screen.id)}
                className={`relative flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? `border-transparent bg-gradient-to-r ${screen.color} text-white shadow-lg`
                    : "border-brand-border bg-white text-brand-text-sub hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
              >
                <Icon className="h-4 w-4" strokeWidth={2.5} />
                {screen.label}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent"
                    layoutId="activeTab"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Preview area */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${active}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${current.color} text-white shadow-lg mb-6`}>
                <current.icon className="h-8 w-8" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-brand-navy">{current.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-brand-text-sub">{current.desc}</p>
            </motion.div>
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`preview-${active}`}
              className="rounded-3xl border border-white/50 bg-white/90 backdrop-blur-xl p-8 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {current.preview}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <motion.div
        className="flex items-center justify-between"
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600">Hôm nay</p>
          <p className="text-3xl font-black text-brand-navy mt-1">
            1.840 <span className="text-base font-semibold text-brand-text-sub">/ 2.203 kcal</span>
          </p>
        </div>
        <span className="rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2 text-sm font-bold text-white shadow-lg">
          83% hoàn thành
        </span>
      </motion.div>
      
      <motion.div
        className="h-4 rounded-full bg-primary-100 overflow-hidden"
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
          initial={{ width: 0 }}
          animate={{ width: "83%" }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </motion.div>
      
      <motion.div
        className="grid grid-cols-4 gap-3"
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
      >
        {[
          { l: "Protein", v: "87g", gradient: "from-blue-500 to-blue-600" },
          { l: "Carbs", v: "241g", gradient: "from-primary-500 to-primary-600" },
          { l: "Fat", v: "58g", gradient: "from-orange-500 to-orange-600" },
          { l: "BMI", v: "17.4", gradient: "from-purple-500 to-purple-600" },
        ].map((m, i) => (
          <motion.div
            key={m.l}
            className={`rounded-2xl bg-gradient-to-br ${m.gradient} p-4 text-center text-white shadow-lg`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <div className="text-2xl font-black">{m.v}</div>
            <div className="text-xs font-semibold mt-1 opacity-90">{m.l}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function MealPlanPreview() {
  const meals = [
    { name: "Bữa sáng", items: "Yến mạch + Chuối + Sữa tươi", kcal: 520, icon: "🌅" },
    { name: "Bữa trưa", items: "Cơm trắng + Cá hồi + Rau cải", kcal: 710, icon: "☀️" },
    { name: "Bữa tối", items: "Mì ý + Bò bằm + Salad", kcal: 680, icon: "🌙" },
  ];
  
  return (
    <div className="space-y-3">
      {meals.map((meal, i) => (
        <motion.div
          key={meal.name}
          className="flex items-center justify-between rounded-2xl border border-primary-100 bg-gradient-to-r from-white to-primary-50/30 px-5 py-4 shadow-soft hover:shadow-soft-lg transition-all"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          whileHover={{ scale: 1.02, x: 4 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{meal.icon}</span>
            <div>
              <p className="text-sm font-bold text-brand-navy">{meal.name}</p>
              <p className="text-xs font-medium text-brand-text-sub mt-0.5">{meal.items}</p>
            </div>
          </div>
          <span className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-xs font-bold text-white shadow-lg">
            {meal.kcal} kcal
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function ChartsPreview() {
  const bars = [65, 80, 72, 90, 85, 78, 95];
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  
  return (
    <div>
      <div className="flex items-end justify-between gap-2 h-40">
        {bars.map((height, i) => (
          <motion.div
            key={i}
            className="flex flex-1 flex-col items-center gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="w-full rounded-2xl bg-primary-100 overflow-hidden" style={{ height: "120px" }}>
              <motion.div
                className="w-full rounded-2xl bg-gradient-to-t from-primary-500 to-primary-600"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                style={{ marginTop: `${100 - height}%` }}
              />
            </div>
            <span className="text-xs font-bold text-brand-text-sub">{days[i]}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 flex gap-6 text-sm font-bold text-brand-text-sub justify-center">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600" />
          Calories
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600" />
          Protein
        </span>
      </div>
    </div>
  );
}

function JournalPreview() {
  const entries = [
    { meal: "Bữa sáng", time: "07:30", done: true, kcal: 520 },
    { meal: "Bữa trưa", time: "12:00", done: true, kcal: 710 },
    { meal: "Bữa tối", time: "18:30", done: false, kcal: 680 },
  ];
  
  return (
    <div className="space-y-3">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.meal}
          className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
            entry.done
              ? "border-primary-200 bg-gradient-to-r from-primary-50 to-primary-100/30"
              : "border-brand-border bg-white hover:border-primary-200 hover:bg-primary-50/30"
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          whileHover={{ scale: 1.02, x: 4 }}
        >
          <div className="flex items-center gap-3">
            <div
              className={`grid h-10 w-10 place-items-center rounded-xl ${
                entry.done
                  ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg"
                  : "bg-brand-border text-brand-text-sub"
              }`}
            >
              {entry.done ? <Check className="h-5 w-5" strokeWidth={2.5} /> : <Clock className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-bold text-brand-navy">{entry.meal}</p>
              <p className="text-xs font-medium text-brand-text-sub">{entry.time}</p>
            </div>
          </div>
          <span
            className={`text-xs font-bold ${
              entry.done ? "text-primary-600" : "text-brand-text-sub"
            }`}
          >
            {entry.kcal} kcal
          </span>
        </motion.div>
      ))}
    </div>
  );
}
