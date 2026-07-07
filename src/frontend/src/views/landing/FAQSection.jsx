import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { SectionLabel } from "./FeatureSection";

const faqs = [
  {
    q: "NutriGain phù hợp với ai?",
    a: "NutriGain tập trung cho người gầy có BMI dưới 23 theo chuẩn Châu Á. Hệ thống không tạo thực đơn tăng cân cho người BMI từ 23 trở lên.",
  },
  {
    q: "Hệ thống tính calories thế nào?",
    a: "Chúng tôi dùng công thức Mifflin-St Jeor để tính BMR, nhân hệ số vận động ra TDEE, sau đó cộng thặng dư calo phù hợp với mục tiêu tăng cân của bạn.",
  },
  {
    q: "AI nhận diện nguyên liệu hoạt động như thế nào?",
    a: "Chúng tôi sử dụng mô hình CLIP ViT-B/32 của OpenAI để nhận diện 26 nguyên liệu phổ biến từ hình ảnh với độ chính xác 76.26%. Chỉ cần chụp ảnh món ăn là hệ thống tự động nhận diện nguyên liệu.",
  },
  {
    q: "Dữ liệu của tôi có được bảo mật không?",
    a: "Dữ liệu cá nhân được lưu trữ bảo mật trên server. Chúng tôi không chia sẻ thông tin của bạn với bên thứ ba.",
  },
  {
    q: "Tôi cần cập nhật cân nặng bao lâu một lần?",
    a: "Chúng tôi khuyến khích cập nhật cân nặng hàng tuần để hệ thống điều chỉnh calories chính xác và phù hợp với tiến trình của bạn.",
  },
  {
    q: "Ứng dụng có miễn phí không?",
    a: "NutriGain hiện đang miễn phí. Bạn chỉ cần tạo tài khoản để sử dụng đầy đủ tính năng.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(null);
  
  return (
    <section id="faq" className="relative py-20 bg-gradient-to-b from-primary-50/30 to-white sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary-300/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-6 text-4xl font-black text-brand-navy sm:text-5xl lg:text-6xl">
            Câu hỏi{" "}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              thường gặp
            </span>
          </h2>
          <p className="mt-6 text-lg text-brand-text-sub">
            Giải đáp những thắc mắc phổ biến về NutriGain. Không tìm thấy câu trả lời? Liên hệ với chúng tôi.
          </p>
        </motion.div>
        
        {/* FAQ List */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={open === index}
              onToggle={() => setOpen(open === index ? null : index)}
            />
          ))}
        </div>
        
        {/* Help CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-3 rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 to-secondary-50 px-6 py-4">
            <HelpCircle className="h-6 w-6 text-primary-600" strokeWidth={2} />
            <div className="text-left">
              <p className="text-sm font-bold text-brand-navy">Vẫn còn thắc mắc?</p>
              <p className="text-xs text-brand-text-sub mt-0.5">Liên hệ với chúng tôi để được hỗ trợ</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FAQItem({ faq, index, isOpen, onToggle }) {
  return (
    <motion.div
      className={`rounded-2xl border transition-all overflow-hidden ${
        isOpen
          ? "border-primary-300 bg-gradient-to-r from-primary-50 to-secondary-50/50 shadow-soft-lg"
          : "border-brand-border bg-white hover:border-primary-200 hover:bg-primary-50/30 shadow-soft"
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
    >
      <button
        className="flex w-full items-center justify-between px-6 py-5 text-left"
        onClick={onToggle}
      >
        <span className="text-base font-bold text-brand-navy pr-4">{faq.q}</span>
        <motion.div
          className={`flex-shrink-0 text-primary-600`}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-5">
              <p className="text-sm leading-relaxed text-brand-text-sub">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
