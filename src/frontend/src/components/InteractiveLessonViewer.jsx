import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronLeft, ChevronRight, BookOpen, Clock, Award,
  CheckCircle2, Lock, Play, Sparkles, Target, Brain,
  TrendingUp, AlertCircle, ThumbsUp, Star, Trophy,
  Zap, Eye, Check, ArrowRight, Menu, BarChart3
} from "lucide-react";

// ============================================================================
// MOCK LESSON DATA
// ============================================================================

const MOCK_LESSONS = {
  "protein-basics": {
    id: "protein-basics",
    title: "Protein: Chìa Khóa Cho Cơ Bắp Săn Chắc",
    category: "Ăn Uống Lành Mạnh",
    difficulty: "Trung cấp",
    duration: "12 phút",
    xp: 75,
    heroGradient: "from-orange-500 to-orange-600",
    aiSummary: "Protein là yếu tố quan trọng giúp xây dựng và phục hồi cơ bắp. Bài học này hướng dẫn cách tính lượng protein cần thiết và nguồn protein tốt nhất.",
    objectives: [
      "Hiểu vai trò của protein trong tăng cơ",
      "Tính toán lượng protein cần thiết mỗi ngày",
      "Lựa chọn nguồn protein chất lượng cao",
    ],
    content: `
# Protein Là Gì?

Protein, hay còn gọi là chất đạm, là một trong ba chất dinh dưỡng chính cơ thể cần (bên cạnh carbs và fat). Protein được cấu thành từ các amino acid.

## Tại Sao Protein Quan Trọng?

1. **Xây dựng cơ bắp**: Protein cung cấp "nguyên liệu" để cơ thể tạo ra mô cơ mới
2. **Phục hồi**: Sau tập luyện, protein giúp sửa chữa các tổn thương nhỏ ở cơ
3. **Tăng cân có chất**: Đảm bảo cân nặng tăng lên là cơ, không chỉ mỡ

## Cần Bao Nhiêu Protein?

Công thức đơn giản: **1.6-2g protein / kg cân nặng / ngày**

Ví dụ: Nếu bạn nặng 55kg → Cần 88-110g protein/ngày

## Nguồn Protein Tốt

- 🥚 **Trứng**: 6-7g/quả
- 🐔 **Thịt gà**: 25-30g/100g  
- 🐟 **Cá**: 20-25g/100g
- 🥛 **Sữa**: 8g/ly 250ml
- 🥜 **Đậu nành**: 15-20g/100g

> 💡 **Mẹo**: Ăn protein đều trong các bữa thay vì tập trung vào 1 bữa!
    `,
    keyTakeaways: [
      "Protein giúp xây dựng và phục hồi cơ bắp",
      "Cần 1.6-2g protein/kg cân nặng mỗi ngày",
      "Nên ăn protein đều trong các bữa",
      "Kết hợp nhiều nguồn protein khác nhau",
    ],
    quiz: [
      {
        question: "Lượng protein khuyến nghị mỗi ngày là bao nhiêu?",
        options: [
          "0.5-1g/kg",
          "1.6-2g/kg",
          "3-4g/kg",
          "Không cần quan tâm"
        ],
        correct: 1
      },
      {
        question: "Nguồn protein nào sau đây có hàm lượng cao nhất?",
        options: [
          "Trứng (6-7g/quả)",
          "Thịt gà (25-30g/100g)",
          "Sữa (8g/ly)",
          "Cơm (2-3g/100g)"
        ],
        correct: 1
      }
    ],
    nextLesson: "carbs-energy"
  }
};

export default function InteractiveLessonViewer({ lessonId, onExit, onLessonComplete }) {
  const lesson = MOCK_LESSONS[lessonId] || MOCK_LESSONS["protein-basics"];
  
  const [readingProgress, setReadingProgress] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
