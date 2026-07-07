/**
 * Lesson Data Structure
 * 
 * Contains all lesson content, categories, quizzes, and metadata
 * for the Interactive Learning Experience.
 */

/**
 * Category data with lessons
 */
export const categories = [
  {
    id: 'nutrition-basics',
    name: 'Kiến thức dinh dưỡng cơ bản',
    icon: 'BookOpen',
    color: 'emerald',
    expanded: true,
    lessons: [
      {
        id: 'intro-nutrition',
        title: 'Giới thiệu về dinh dưỡng',
        category: 'nutrition-basics',
        difficulty: 'Beginner',
        duration: 15,
        xp: 50,
        heroImage: '/images/lessons/nutrition-intro.jpg',
        summary: 'Tìm hiểu các khái niệm cơ bản về dinh dưỡng và tầm quan trọng của việc ăn uống lành mạnh cho sức khỏe tổng thể.',
        objectives: [
          'Hiểu khái niệm dinh dưỡng và vai trò của nó',
          'Nhận biết các nhóm chất dinh dưỡng chính',
          'Hiểu tầm quan trọng của chế độ ăn cân bằng'
        ],
        content: [
          {
            type: 'heading',
            content: 'Dinh dưỡng là gì?'
          },
          {
            type: 'text',
            content: 'Dinh dưỡng là khoa học nghiên cứu về thức ăn và cách cơ thể sử dụng các chất dinh dưỡng để duy trì sức khỏe, phát triển và hoạt động. Một chế độ ăn uống lành mạnh cung cấp đầy đủ năng lượng và các chất dinh dưỡng cần thiết cho cơ thể.',
            markdown: true
          },
          {
            type: 'heading',
            content: 'Các nhóm chất dinh dưỡng chính'
          },
          {
            type: 'list',
            content: [
              '**Carbohydrate**: Nguồn năng lượng chính cho cơ thể',
              '**Protein**: Xây dựng và sửa chữa mô cơ thể',
              '**Lipid (Chất béo)**: Dự trữ năng lượng và hỗ trợ hấp thụ vitamin',
              '**Vitamin**: Điều hòa các quá trình sinh học',
              '**Khoáng chất**: Duy trì cấu trúc xương và chức năng cơ thể',
              '**Nước**: Duy trì cân bằng dịch và nhiệt độ cơ thể'
            ]
          },
          {
            type: 'heading',
            content: 'Tầm quan trọng của chế độ ăn cân bằng'
          },
          {
            type: 'text',
            content: 'Chế độ ăn cân bằng cung cấp đủ các chất dinh dưỡng theo tỷ lệ phù hợp, giúp duy trì sức khỏe tối ưu, phòng ngừa bệnh tật và cải thiện chất lượng cuộc sống.',
            markdown: true
          }
        ],
        takeaways: [
          'Dinh dưỡng đóng vai trò quan trọng trong sức khỏe',
          'Cơ thể cần 6 nhóm chất dinh dưỡng chính',
          'Chế độ ăn cân bằng là nền tảng của sức khỏe tốt'
        ],
        quiz: [
          {
            id: 'q1-nutrition-basics',
            questionText: 'Nhóm chất dinh dưỡng nào là nguồn năng lượng chính cho cơ thể?',
            options: [
              'Carbohydrate',
              'Protein',
              'Vitamin',
              'Khoáng chất'
            ],
            correctAnswerIndex: 0,
            explanation: 'Carbohydrate là nguồn năng lượng chính và dễ sử dụng nhất cho cơ thể, cung cấp 4 kcal mỗi gram.'
          },
          {
            id: 'q2-nutrition-basics',
            questionText: 'Vai trò chính của protein trong cơ thể là gì?',
            options: [
              'Cung cấp năng lượng nhanh',
              'Xây dựng và sửa chữa mô',
              'Dự trữ năng lượng dài hạn',
              'Điều hòa nhiệt độ cơ thể'
            ],
            correctAnswerIndex: 1,
            explanation: 'Protein là thành phần cấu tạo chính của các mô trong cơ thể và đóng vai trò quan trọng trong việc xây dựng và sửa chữa mô.'
          }
        ],
        metadata: {
          views: 0,
          likes: 0
        }
      },
      {
        id: 'macronutrients',
        title: 'Macronutrient: Carbs, Protein, Fat',
        category: 'nutrition-basics',
        difficulty: 'Beginner',
        duration: 20,
        xp: 75,
        heroImage: '/images/lessons/macronutrients.jpg',
        summary: 'Tìm hiểu chi tiết về ba nhóm chất dinh dưỡng đa lượng: carbohydrate, protein và chất béo, cùng vai trò của chúng trong cơ thể.',
        objectives: [
          'Phân biệt các loại macronutrient',
          'Hiểu chức năng của từng loại macronutrient',
          'Xác định nguồn thực phẩm giàu macronutrient'
        ],
        content: [
          {
            type: 'heading',
            content: 'Carbohydrate'
          },
          {
            type: 'text',
            content: 'Carbohydrate là nguồn năng lượng chính, cung cấp 4 kcal/gram. Có hai loại chính: carbohydrate đơn giản (đường) và phức tạp (tinh bột, chất xơ).',
            markdown: true
          },
          {
            type: 'heading',
            content: 'Protein'
          },
          {
            type: 'text',
            content: 'Protein cung cấp 4 kcal/gram và là thành phần cấu tạo của cơ bắp, da, tóc, enzyme và hormone. Cơ thể cần 20 amino acid, trong đó 9 là amino acid thiết yếu phải có từ thức ăn.',
            markdown: true
          },
          {
            type: 'heading',
            content: 'Chất béo (Lipid)'
          },
          {
            type: 'text',
            content: 'Chất béo cung cấp 9 kcal/gram, là nguồn năng lượng dồi dào. Chất béo cũng hỗ trợ hấp thụ vitamin tan trong dầu (A, D, E, K) và bảo vệ các cơ quan nội tạng.',
            markdown: true
          }
        ],
        takeaways: [
          'Carbohydrate là nguồn năng lượng chính',
          'Protein xây dựng và sửa chữa mô',
          'Chất béo dự trữ năng lượng và hỗ trợ hấp thụ vitamin'
        ],
        quiz: [
          {
            id: 'q1-macro',
            questionText: 'Macronutrient nào cung cấp nhiều năng lượng nhất mỗi gram?',
            options: [
              'Carbohydrate',
              'Protein',
              'Chất béo',
              'Chất xơ'
            ],
            correctAnswerIndex: 2,
            explanation: 'Chất béo cung cấp 9 kcal/gram, gấp đôi so với carbohydrate và protein (4 kcal/gram).'
          },
          {
            id: 'q2-macro',
            questionText: 'Bao nhiêu amino acid thiết yếu mà cơ thể không thể tự tổng hợp?',
            options: [
              '5',
              '7',
              '9',
              '11'
            ],
            correctAnswerIndex: 2,
            explanation: 'Có 9 amino acid thiết yếu mà cơ thể không thể tự tổng hợp, phải có từ thức ăn.'
          }
        ],
        metadata: {
          views: 0,
          likes: 0
        }
      }
    ]
  },
  {
    id: 'healthy-eating',
    name: 'Ăn uống lành mạnh',
    icon: 'Apple',
    color: 'blue',
    expanded: false,
    lessons: [
      {
        id: 'balanced-diet',
        title: 'Chế độ ăn cân bằng',
        category: 'healthy-eating',
        difficulty: 'Intermediate',
        duration: 25,
        xp: 100,
        heroImage: '/images/lessons/balanced-diet.jpg',
        summary: 'Học cách xây dựng một chế độ ăn cân bằng với tỷ lệ dinh dưỡng phù hợp và đa dạng thực phẩm.',
        objectives: [
          'Hiểu nguyên tắc của chế độ ăn cân bằng',
          'Xác định tỷ lệ macronutrient phù hợp',
          'Lập kế hoạch bữa ăn lành mạnh'
        ],
        content: [
          {
            type: 'heading',
            content: 'Nguyên tắc chế độ ăn cân bằng'
          },
          {
            type: 'text',
            content: 'Chế độ ăn cân bằng bao gồm nhiều loại thực phẩm từ các nhóm khác nhau theo tỷ lệ phù hợp, đảm bảo cung cấp đầy đủ năng lượng và chất dinh dưỡng.',
            markdown: true
          },
          {
            type: 'list',
            content: [
              'Ngũ cốc nguyên hạt: 45-65% năng lượng',
              'Protein nạc: 10-35% năng lượng',
              'Chất béo lành mạnh: 20-35% năng lượng',
              'Rau xanh và trái cây: Ít nhất 5 phần mỗi ngày',
              'Nước: 2-3 lít mỗi ngày'
            ]
          }
        ],
        takeaways: [
          'Đa dạng thực phẩm là chìa khóa',
          'Cân bằng tỷ lệ macronutrient',
          'Ăn đủ rau xanh và trái cây'
        ],
        quiz: [
          {
            id: 'q1-balanced',
            questionText: 'Tỷ lệ năng lượng từ carbohydrate trong chế độ ăn cân bằng là bao nhiêu?',
            options: [
              '20-35%',
              '35-45%',
              '45-65%',
              '65-80%'
            ],
            correctAnswerIndex: 2,
            explanation: 'Carbohydrate nên chiếm 45-65% tổng năng lượng trong chế độ ăn cân bằng.'
          },
          {
            id: 'q2-balanced',
            questionText: 'Nên ăn bao nhiêu phần rau xanh và trái cây mỗi ngày?',
            options: [
              '2-3 phần',
              '3-4 phần',
              '4-5 phần',
              'Ít nhất 5 phần'
            ],
            correctAnswerIndex: 3,
            explanation: 'Khuyến nghị ăn ít nhất 5 phần rau xanh và trái cây mỗi ngày để đảm bảo cung cấp đủ vitamin, khoáng chất và chất xơ.'
          }
        ],
        metadata: {
          views: 0,
          likes: 0
        }
      }
    ]
  },
  {
    id: 'weight-management',
    name: 'Quản lý cân nặng',
    icon: 'Scale',
    color: 'purple',
    expanded: false,
    lessons: [
      {
        id: 'weight-gain-basics',
        title: 'Cơ bản về tăng cân lành mạnh',
        category: 'weight-management',
        difficulty: 'Intermediate',
        duration: 20,
        xp: 100,
        heroImage: '/images/lessons/weight-gain.jpg',
        summary: 'Tìm hiểu cách tăng cân một cách lành mạnh thông qua chế độ ăn và tập luyện phù hợp.',
        objectives: [
          'Hiểu nguyên tắc tăng cân lành mạnh',
          'Xác định lượng calo thặng dư phù hợp',
          'Lựa chọn thực phẩm giàu dinh dưỡng'
        ],
        content: [
          {
            type: 'heading',
            content: 'Nguyên tắc tăng cân'
          },
          {
            type: 'text',
            content: 'Để tăng cân lành mạnh, bạn cần tạo thặng dư calo - tiêu thụ nhiều calo hơn cơ thể đốt cháy. Tuy nhiên, cần tăng cân từ cơ bắp và mô nạc, không phải mỡ thừa.',
            markdown: true
          },
          {
            type: 'heading',
            content: 'Lượng calo thặng dư'
          },
          {
            type: 'text',
            content: 'Tăng 300-500 kcal mỗi ngày so với mức duy trì để tăng cân từ từ và lành mạnh (khoảng 0.5 kg/tuần).',
            markdown: true
          }
        ],
        takeaways: [
          'Tạo thặng dư calo hợp lý',
          'Ăn nhiều bữa nhỏ trong ngày',
          'Kết hợp tập luyện sức mạnh'
        ],
        quiz: [
          {
            id: 'q1-weight-gain',
            questionText: 'Lượng calo thặng dư khuyến nghị để tăng cân lành mạnh là bao nhiêu?',
            options: [
              '100-200 kcal',
              '300-500 kcal',
              '700-900 kcal',
              '1000-1500 kcal'
            ],
            correctAnswerIndex: 1,
            explanation: 'Thặng dư 300-500 kcal mỗi ngày giúp tăng cân từ từ và lành mạnh, chủ yếu từ cơ bắp.'
          },
          {
            id: 'q2-weight-gain',
            questionText: 'Tốc độ tăng cân lành mạnh là bao nhiêu mỗi tuần?',
            options: [
              '0.25 kg',
              '0.5 kg',
              '1 kg',
              '1.5 kg'
            ],
            correctAnswerIndex: 1,
            explanation: 'Tăng khoảng 0.5 kg/tuần là tốc độ lý tưởng để đảm bảo tăng cơ bắp và hạn chế tích mỡ.'
          }
        ],
        metadata: {
          views: 0,
          likes: 0
        }
      }
    ]
  }
];

/**
 * Get all lessons across all categories
 * @returns {Array} Flattened array of all lessons
 */
export function getAllLessons() {
  return categories.flatMap(category => category.lessons);
}

/**
 * Get lesson by ID
 * @param {string} lessonId - The lesson ID
 * @returns {Object|null} Lesson object or null if not found
 */
export function getLessonById(lessonId) {
  const allLessons = getAllLessons();
  return allLessons.find(lesson => lesson.id === lessonId) || null;
}

/**
 * Get category by ID
 * @param {string} categoryId - The category ID
 * @returns {Object|null} Category object or null if not found
 */
export function getCategoryById(categoryId) {
  return categories.find(category => category.id === categoryId) || null;
}

/**
 * Get lessons by category
 * @param {string} categoryId - The category ID
 * @returns {Array} Array of lessons in the category
 */
export function getLessonsByCategory(categoryId) {
  const category = getCategoryById(categoryId);
  return category ? category.lessons : [];
}

/**
 * Validate lesson data structure
 * @param {Object} lesson - Lesson object to validate
 * @returns {boolean} True if valid
 */
export function isValidLesson(lesson) {
  return (
    lesson &&
    lesson.id &&
    lesson.title &&
    lesson.category &&
    lesson.difficulty &&
    typeof lesson.duration === 'number' &&
    typeof lesson.xp === 'number' &&
    Array.isArray(lesson.objectives) &&
    Array.isArray(lesson.content) &&
    Array.isArray(lesson.takeaways) &&
    Array.isArray(lesson.quiz) &&
    lesson.quiz.length >= 2
  );
}

export default categories;
