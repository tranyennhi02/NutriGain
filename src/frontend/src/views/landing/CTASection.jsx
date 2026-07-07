import { motion } from "framer-motion";
import { Sparkles, Check, ArrowRight, Mail, Leaf } from "lucide-react";

export default function CTASection({ onShowAuth }) {
  return (
    <section id="cta" className="relative py-20 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Main CTA Card */}
        <motion.div
          className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 px-8 py-20 text-center shadow-2xl sm:px-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-secondary-400/20 blur-3xl"
              animate={{
                scale: [1, 1.15, 1],
                x: [0, -30, 0],
                y: [0, -40, 0],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-5 py-2.5 text-sm font-bold text-white"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              Hoàn toàn miễn phí để bắt đầu
            </motion.div>

            {/* Heading */}
            <motion.h2
              className="mt-8 text-4xl font-black text-white sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Sẵn sàng bắt đầu
              <br />
              hành trình tăng cân?
            </motion.h2>

            {/* Description */}
            <motion.p
              className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-white/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Tham gia cùng hàng nghìn người đang sử dụng NutriGain để xây dựng lộ trình dinh dưỡng cá nhân hóa và đạt mục tiêu cân nặng lý tưởng.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.button
                onClick={() => onShowAuth("register")}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-primary-600 shadow-2xl hover:shadow-3xl transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Bắt đầu miễn phí
                <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
              </motion.button>
              <motion.a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-base font-bold text-white hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Cách hoạt động
              </motion.a>
            </motion.div>

            {/* Features */}
            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-white/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <span className="flex items-center gap-2">
                <Check className="h-5 w-5" strokeWidth={2.5} />
                Không cần thẻ ngân hàng
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-5 w-5" strokeWidth={2.5} />
                Bảo mật dữ liệu
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-5 w-5" strokeWidth={2.5} />
                Cập nhật liên tục
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
              <Leaf className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black">
              <span className="text-primary-600">Nutri</span>
              <span className="text-brand-navy">Gain</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-brand-text-sub mb-6">
            <a href="#features" className="hover:text-primary-600 transition-colors">
              Tính năng
            </a>
            <a href="#how-it-works" className="hover:text-primary-600 transition-colors">
              Cách hoạt động
            </a>
            <a href="#faq" className="hover:text-primary-600 transition-colors">
              FAQ
            </a>
            <a href="#cta" className="hover:text-primary-600 transition-colors">
              Liên hệ
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-xl border border-brand-border bg-white text-brand-text-sub hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="mailto:contact@nutrigain.com"
              className="grid h-10 w-10 place-items-center rounded-xl border border-brand-border bg-white text-brand-text-sub hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm font-semibold text-brand-text-sub">
            © 2025 NutriGain. Build Healthy Calories. 🌱
          </p>
        </motion.div>
      </div>
    </section>
  );
}
