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
            options: ['Carbohydrate', 'Protein', 'Vitamin', 'Khoáng chất'],
            correctAnswerIndex: 0,
            explanation: 'Carbohydrate là nguồn năng lượng chính và dễ sử dụng nhất cho cơ thể, cung cấp 4 kcal mỗi gram.'
          },
          {
            id: 'q2-nutrition-basics',
            questionText: 'Vai trò chính của protein trong cơ thể là gì?',
            options: ['Cung cấp năng lượng nhanh', 'Xây dựng và sửa chữa mô', 'Dự trữ năng lượng dài hạn', 'Điều hòa nhiệt độ cơ thể'],
            correctAnswerIndex: 1,
            explanation: 'Protein là thành phần cấu tạo chính của các mô trong cơ thể và đóng vai trò quan trọng trong việc xây dựng và sửa chữa mô.'
          },
          {
            id: 'q3-nutrition-basics',
            questionText: 'Chất béo cung cấp bao nhiêu kcal mỗi gram?',
            options: ['4 kcal', '7 kcal', '9 kcal', '11 kcal'],
            correctAnswerIndex: 2,
            explanation: 'Chất béo cung cấp 9 kcal/gram, gấp đôi so với carbohydrate và protein (4 kcal/gram).'
          },
          {
            id: 'q4-nutrition-basics',
            questionText: 'Vitamin nào tan trong nước?',
            options: ['Vitamin A, D, E, K', 'Vitamin B và C', 'Vitamin E và K', 'Tất cả vitamin'],
            correctAnswerIndex: 1,
            explanation: 'Vitamin B và C là vitamin tan trong nước, cần được bổ sung thường xuyên vì cơ thể không dự trữ được lâu.'
          },
          {
            id: 'q5-nutrition-basics',
            questionText: 'Khoáng chất nào quan trọng cho sức khỏe xương?',
            options: ['Sắt', 'Canxi', 'Kali', 'Natri'],
            correctAnswerIndex: 1,
            explanation: 'Canxi là khoáng chất chủ yếu cấu tạo nên xương và răng, đóng vai trò quan trọng trong việc duy trì cấu trúc xương chắc khỏe.'
          },
          {
            id: 'q6-nutrition-basics',
            questionText: 'Cơ thể người trưởng thành cần uống bao nhiêu lít nước mỗi ngày?',
            options: ['1-1.5 lít', '2-3 lít', '4-5 lít', '5-6 lít'],
            correctAnswerIndex: 1,
            explanation: 'Khuyến nghị uống 2-3 lít nước mỗi ngày để duy trì cân bằng dịch và các chức năng cơ thể.'
          },
          {
            id: 'q7-nutrition-basics',
            questionText: 'Vai trò của vitamin trong cơ thể là gì?',
            options: ['Cung cấp năng lượng', 'Xây dựng cơ bắp', 'Điều hòa các quá trình sinh học', 'Dự trữ năng lượng'],
            correctAnswerIndex: 2,
            explanation: 'Vitamin không cung cấp năng lượng nhưng đóng vai trò quan trọng trong việc điều hòa các quá trình trao đổi chất và sinh học trong cơ thể.'
          },
          {
            id: 'q8-nutrition-basics',
            questionText: 'Chất xơ thuộc nhóm chất dinh dưỡng nào?',
            options: ['Protein', 'Carbohydrate', 'Lipid', 'Vitamin'],
            correctAnswerIndex: 1,
            explanation: 'Chất xơ là một loại carbohydrate phức tạp mà cơ thể không tiêu hóa được, nhưng rất quan trọng cho sức khỏe đường ruột.'
          },
          {
            id: 'q9-nutrition-basics',
            questionText: 'Tỷ lệ nào dưới đây mô tả chế độ ăn cân bằng?',
            options: ['80% protein, 20% carb', '50% carb, 30% protein, 20% chất béo', '70% chất béo, 30% protein', '100% carbohydrate'],
            correctAnswerIndex: 1,
            explanation: 'Chế độ ăn cân bằng thường bao gồm khoảng 50% carb, 30% protein và 20% chất béo, tùy thuộc vào mục tiêu cá nhân.'
          },
          {
            id: 'q10-nutrition-basics',
            questionText: 'Thiếu chất dinh dưỡng nào có thể gây thiếu máu?',
            options: ['Vitamin C', 'Sắt', 'Canxi', 'Kali'],
            correctAnswerIndex: 1,
            explanation: 'Sắt là thành phần quan trọng của hemoglobin trong hồng cầu. Thiếu sắt có thể dẫn đến thiếu máu do thiếu sắt.'
          }
        ],
        metadata: { views: 0, likes: 0 }
      },
      {
        id: 'macronutrients',
        title: 'Macronutrient: Carbs, Protein, Fat',
        category: 'nutrition-basics',
        difficulty: 'Beginner',
        duration: 20,
        xp: 75,
        heroImage: '/images/lessons/macronutrients.jpg',
        summary: 'Tìm hiểu chi tiết về ba nhóm chất dinh dưỡng đa lượng: carbohydrate, protein và chất béo.',
        objectives: ['Phân biệt các loại macronutrient', 'Hiểu chức năng của từng loại', 'Xác định nguồn thực phẩm giàu macronutrient'],
        content: [
          { type: 'heading', content: 'Carbohydrate' },
          { type: 'text', content: 'Carbohydrate là nguồn năng lượng chính, cung cấp 4 kcal/gram. Cơ thể lưu trữ carb thừa dưới dạng glycogen trong gan và cơ bắp. Có hai loại: đơn giản (đường - hấp thụ nhanh) và phức tạp (tinh bột, chất xơ - tiêu hóa chậm, năng lượng bền vững).', markdown: true },
          { type: 'heading', content: 'Protein' },
          { type: 'text', content: 'Protein cung cấp 4 kcal/gram, là thành phần cấu tạo của cơ bắp, da, enzyme và hormone. Cần 20 amino acid, trong đó 9 là thiết yếu (phải lấy từ thức ăn, trứng gà là ví dụ điển hình cho protein hoàn chỉnh).', markdown: true },
          { type: 'heading', content: 'Chất béo (Lipid)' },
          { type: 'text', content: 'Chất béo cung cấp 9 kcal/gram. Giúp dự trữ năng lượng dài hạn, bảo vệ cơ quan nội tạng, và hấp thụ vitamin tan trong dầu. Chất béo không bão hòa (dầu ô liu, cá, hạt) là chất béo lành mạnh rất tốt cho tim mạch.', markdown: true }
        ],
        takeaways: ['Carb là nguồn năng lượng chính', 'Protein xây dựng và sửa chữa mô', 'Chất béo dự trữ năng lượng'],
        quiz: [
          { id: 'q1-macro', questionText: 'Macronutrient nào cung cấp nhiều năng lượng nhất mỗi gram?', options: ['Carbohydrate', 'Protein', 'Chất béo', 'Chất xơ'], correctAnswerIndex: 2, explanation: 'Chất béo cung cấp 9 kcal/gram, gấp đôi so với carb và protein.' },
          { id: 'q2-macro', questionText: 'Bao nhiêu amino acid thiết yếu cơ thể không tự tổng hợp?', options: ['5', '7', '9', '11'], correctAnswerIndex: 2, explanation: 'Có 9 amino acid thiết yếu phải có từ thức ăn.' },
          { id: 'q3-macro', questionText: 'Protein cung cấp bao nhiêu kcal mỗi gram?', options: ['2 kcal', '4 kcal', '7 kcal', '9 kcal'], correctAnswerIndex: 1, explanation: 'Protein cung cấp 4 kcal/gram, giống như carbohydrate.' },
          { id: 'q4-macro', questionText: 'Loại carbohydrate nào tiêu hóa chậm hơn?', options: ['Đường đơn', 'Đường đôi', 'Tinh bột phức tạp', 'Fructose'], correctAnswerIndex: 2, explanation: 'Tinh bột phức tạp tiêu hóa chậm, cung cấp năng lượng bền vững.' },
          { id: 'q5-macro', questionText: 'Vitamin nào tan trong chất béo?', options: ['Vitamin B', 'Vitamin C', 'Vitamin A, D, E, K', 'Tất cả vitamin'], correctAnswerIndex: 2, explanation: 'Vitamin A, D, E, K tan trong chất béo và cần chất béo để hấp thụ.' },
          { id: 'q6-macro', questionText: 'Vai trò chính của chất béo trong cơ thể là gì?', options: ['Xây dựng cơ bắp', 'Dự trữ năng lượng và hỗ trợ hấp thụ vitamin', 'Điều hòa thân nhiệt', 'Tổng hợp DNA'], correctAnswerIndex: 1, explanation: 'Chất béo dự trữ năng lượng dài hạn và giúp hấp thụ vitamin tan trong dầu.' },
          { id: 'q7-macro', questionText: 'Thực phẩm nào giàu protein hoàn chỉnh?', options: ['Rau xanh', 'Trứng gà', 'Khoai tây', 'Táo'], correctAnswerIndex: 1, explanation: 'Trứng gà chứa đầy đủ 9 amino acid thiết yếu, là nguồn protein hoàn chỉnh.' },
          { id: 'q8-macro', questionText: 'Carbohydrate được lưu trữ trong cơ và gan dưới dạng nào?', options: ['Glucose', 'Glycogen', 'Glucagon', 'Fructose'], correctAnswerIndex: 1, explanation: 'Glycogen là dạng dự trữ của carbohydrate trong cơ và gan.' },
          { id: 'q9-macro', questionText: 'Loại chất béo nào được coi là lành mạnh?', options: ['Chất béo bão hòa', 'Chất béo chuyển hóa (trans fat)', 'Chất béo không bão hòa đơn và đa', 'Cholesterol'], correctAnswerIndex: 2, explanation: 'Chất béo không bão hòa đơn và đa (có trong dầu ô liu, cá, hạt) rất tốt cho tim mạch.' },
          { id: 'q10-macro', questionText: 'Nhu cầu protein hàng ngày cho người trưởng thành là bao nhiêu?', options: ['0.4g/kg cân nặng', '0.8-1g/kg cân nặng', '2-3g/kg cân nặng', '5g/kg cân nặng'], correctAnswerIndex: 1, explanation: 'Khuyến nghị 0.8-1g protein/kg cân nặng cho người trưởng thành, cao hơn cho vận động viên.' }
        ],
        metadata: { views: 0, likes: 0 }
      },
      {
        id: 'micronutrients',
        title: 'Vitamin và Khoáng chất',
        category: 'nutrition-basics',
        difficulty: 'Intermediate',
        duration: 25,
        xp: 100,
        heroImage: '/images/lessons/vitamins.jpg',
        summary: 'Khám phá vai trò quan trọng của vitamin và khoáng chất trong việc duy trì sức khỏe và phòng ngừa bệnh tật.',
        objectives: ['Phân loại vitamin và khoáng chất', 'Hiểu vai trò của từng loại', 'Nhận biết dấu hiệu thiếu hụt'],
        content: [
          { type: 'heading', content: 'Vitamin tan trong nước' },
          { type: 'text', content: 'Vitamin B (B1, B2, B3, B6, B12, Folate) và Vitamin C (cam, chanh) không được cơ thể dự trữ. Vitamin B12 chủ yếu có trong thực phẩm động vật. Folate (B9) đặc biệt quan trọng cho phụ nữ mang thai để ngăn dị tật thai nhi.', markdown: true },
          { type: 'heading', content: 'Vitamin tan trong dầu' },
          { type: 'text', content: 'Được dự trữ trong mô mỡ. Gồm Vitamin A (thị lực), D (tổng hợp từ ánh nắng, giúp hấp thụ canxi), E (chất chống oxy hóa bảo vệ tế bào), và K (đông máu).', markdown: true },
          { type: 'heading', content: 'Khoáng chất chính' },
          { type: 'list', content: ['**Canxi**: Xương và răng chắc khỏe', '**Sắt**: Vận chuyển oxy trong máu, thiếu sắt gây thiếu máu', '**Kali**: Điều hòa huyết áp và nhịp tim', '**Kẽm**: Hỗ trợ hệ miễn dịch và lành vết thương'] }
        ],
        takeaways: ['Vitamin B và C cần bổ sung hàng ngày', 'Vitamin A, D, E, K được dự trữ trong mỡ', 'Khoáng chất quan trọng cho nhiều chức năng cơ thể'],
        quiz: [
          { id: 'q1-micro', questionText: 'Vitamin nào có thể được tổng hợp từ ánh nắng mặt trời?', options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin E'], correctAnswerIndex: 2, explanation: 'Vitamin D được tổng hợp khi da tiếp xúc với tia UV từ ánh nắng mặt trời.' },
          { id: 'q2-micro', questionText: 'Thiếu sắt có thể dẫn đến bệnh gì?', options: ['Tiểu đường', 'Thiếu máu', 'Loãng xương', 'Cường giáp'], correctAnswerIndex: 1, explanation: 'Thiếu sắt là nguyên nhân phổ biến nhất gây thiếu máu do thiếu sắt.' },
          { id: 'q3-micro', questionText: 'Vitamin C có trong thực phẩm nào?', options: ['Thịt đỏ', 'Cam, chanh, ớt chuông', 'Sữa', 'Trứng'], correctAnswerIndex: 1, explanation: 'Trái cây có múi và rau họ ớt giàu vitamin C.' },
          { id: 'q4-micro', questionText: 'Khoáng chất nào quan trọng cho sức khỏe xương?', options: ['Sắt', 'Canxi và Vitamin D', 'Kali', 'Vitamin C'], correctAnswerIndex: 1, explanation: 'Canxi và Vitamin D làm việc cùng nhau để xây dựng và duy trì xương chắc khỏe.' },
          { id: 'q5-micro', questionText: 'Vitamin B12 chủ yếu có trong thực phẩm nào?', options: ['Rau xanh', 'Trái cây', 'Thực phẩm động vật', 'Ngũ cốc'], correctAnswerIndex: 2, explanation: 'Vitamin B12 chủ yếu có trong thịt, cá, trứng, sữa và các sản phẩm động vật.' },
          { id: 'q6-micro', questionText: 'Vai trò của Vitamin A là gì?', options: ['Tăng cường miễn dịch và thị lực', 'Đông máu', 'Tạo năng lượng', 'Xây dựng cơ bắp'], correctAnswerIndex: 0, explanation: 'Vitamin A quan trọng cho thị lực, hệ miễn dịch và sức khỏe da.' },
          { id: 'q7-micro', questionText: 'Kẽm có vai trò gì trong cơ thể?', options: ['Vận chuyển oxy', 'Hỗ trợ hệ miễn dịch và lành vết thương', 'Điều hòa đường huyết', 'Tạo năng lượng'], correctAnswerIndex: 1, explanation: 'Kẽm rất quan trọng cho hệ miễn dịch, lành vết thương và tổng hợp protein.' },
          { id: 'q8-micro', questionText: 'Vitamin E có tác dụng gì?', options: ['Chống oxy hóa, bảo vệ tế bào', 'Đông máu', 'Tăng hấp thụ canxi', 'Tạo hồng cầu'], correctAnswerIndex: 0, explanation: 'Vitamin E là chất chống oxy hóa mạnh, bảo vệ tế bào khỏi tổn thương do gốc tự do.' },
          { id: 'q9-micro', questionText: 'Kali giúp điều hòa chức năng nào?', options: ['Thị lực', 'Huyết áp và nhịp tim', 'Tiêu hóa', 'Hô hấp'], correctAnswerIndex: 1, explanation: 'Kali giúp điều hòa huyết áp, nhịp tim và chức năng cơ bắp.' },
          { id: 'q10-micro', questionText: 'Folate (Vitamin B9) đặc biệt quan trọng cho ai?', options: ['Người cao tuổi', 'Phụ nữ mang thai', 'Vận động viên', 'Trẻ em'], correctAnswerIndex: 1, explanation: 'Folate rất quan trọng cho phụ nữ mang thai vì ngăn ngừa dị tật ống thần kinh ở thai nhi.' }
        ],
        metadata: { views: 0, likes: 0 }
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
        summary: 'Học cách xây dựng chế độ ăn cân bằng với tỷ lệ dinh dưỡng phù hợp và đa dạng thực phẩm.',
        objectives: ['Hiểu nguyên tắc chế độ ăn cân bằng', 'Xác định tỷ lệ macronutrient phù hợp', 'Lập kế hoạch bữa ăn lành mạnh'],
        content: [
          { type: 'heading', content: 'Nguyên tắc chế độ ăn cân bằng' },
          { type: 'text', content: 'Chế độ ăn cân bằng bao gồm nhiều loại thực phẩm từ các nhóm khác nhau, không nên bỏ bữa (đặc biệt là bữa sáng cung cấp năng lượng sau 1 đêm).', markdown: true },
          { type: 'list', content: ['Ngũ cốc nguyên hạt: 45-65% (giữ nguyên chất xơ, vitamin)', 'Protein nạc: 10-35%', 'Chất béo lành mạnh: 20-35%', 'Rau xanh & trái cây: 5 phần/ngày (Nên đa dạng màu sắc vì chúng chứa các chất chống oxy hóa khác nhau)', 'Nước: 2-3 lít/ngày'] }
        ],
        takeaways: ['Đa dạng thực phẩm', 'Cân bằng macronutrient', 'Ăn đủ rau xanh'],
        quiz: [
          { id: 'q1-balanced', questionText: 'Tỷ lệ carbohydrate trong chế độ ăn cân bằng?', options: ['20-35%', '35-45%', '45-65%', '65-80%'], correctAnswerIndex: 2, explanation: 'Carb nên chiếm 45-65% tổng năng lượng.' },
          { id: 'q2-balanced', questionText: 'Nên ăn bao nhiêu phần rau củ mỗi ngày?', options: ['2-3', '3-4', '4-5', 'Ít nhất 5'], correctAnswerIndex: 3, explanation: 'Ít nhất 5 phần rau củ mỗi ngày.' },
          { id: 'q3-balanced', questionText: 'Ngũ cốc nguyên hạt tốt hơn ngũ cốc tinh chế vì?', options: ['Ngon hơn', 'Giàu chất xơ và vitamin', 'Rẻ hơn', 'Nấu nhanh hơn'], correctAnswerIndex: 1, explanation: 'Ngũ cốc nguyên hạt giữ nguyên chất xơ, vitamin và khoáng chất.' },
          { id: 'q4-balanced', questionText: 'Protein nạc bao gồm?', options: ['Thịt ba chỉ', 'Ức gà, cá, đậu', 'Xúc xích', 'Thịt xông khói'], correctAnswerIndex: 1, explanation: 'Protein nạc ít chất béo bão hòa, tốt cho sức khỏe tim mạch.' },
          { id: 'q5-balanced', questionText: 'Chất béo lành mạnh có trong?', options: ['Bơ động vật', 'Dầu ô liu, cá hồi, hạt', 'Thịt mỡ', 'Đồ chiên rán'], correctAnswerIndex: 1, explanation: 'Chất béo không bão hòa từ dầu thực vật, cá, hạt rất tốt cho tim.' },
          { id: 'q6-balanced', questionText: 'Nên uống bao nhiêu nước mỗi ngày?', options: ['1 lít', '2-3 lít', '5 lít', '7 lít'], correctAnswerIndex: 1, explanation: 'Uống 2-3 lít nước/ngày để duy trì cân bằng dịch.' },
          { id: 'q7-balanced', questionText: 'Bữa sáng có vai trò gì?', options: ['Không quan trọng', 'Cung cấp năng lượng buổi sáng', 'Chỉ để no bụng', 'Có thể bỏ qua'], correctAnswerIndex: 1, explanation: 'Bữa sáng cung cấp năng lượng sau một đêm nhịn ăn, giúp tập trung và hoạt động hiệu quả.' },
          { id: 'q8-balanced', questionText: 'Nên ăn bao nhiêu bữa nhỏ trong ngày?', options: ['1-2 bữa', '3 bữa chính', '3 bữa chính + 2 bữa phụ', '10 bữa'], correctAnswerIndex: 2, explanation: 'Ăn 3 bữa chính + 2 bữa phụ giúp duy trì năng lượng ổn định.' },
          { id: 'q9-balanced', questionText: 'Thực phẩm chế biến sẵn có tốt không?', options: ['Rất tốt', 'Nên hạn chế vì nhiều muối, đường, chất béo', 'Ăn mỗi ngày', 'Thay thế hoàn toàn đồ tươi'], correctAnswerIndex: 1, explanation: 'Thực phẩm chế biến sẵn thường chứa nhiều muối, đường và chất béo không lành mạnh.' },
          { id: 'q10-balanced', questionText: 'Màu sắc thực phẩm cho biết điều gì?', options: ['Không có ý nghĩa', 'Chứa các chất dinh dưỡng và chống oxy hóa khác nhau', 'Chỉ để đẹp mắt', 'Độ ngọt'], correctAnswerIndex: 1, explanation: 'Thực phẩm nhiều màu sắc cung cấp đa dạng vitamin, khoáng chất và chất chống oxy hóa.' }
        ],
        metadata: { views: 0, likes: 0 }
      },
      {
        id: 'hydration',
        title: 'Tầm quan trọng của nước',
        category: 'healthy-eating',
        difficulty: 'Beginner',
        duration: 15,
        xp: 60,
        heroImage: '/images/lessons/hydration.jpg',
        summary: 'Hiểu vai trò quan trọng của nước trong cơ thể và cách duy trì đủ nước mỗi ngày.',
        objectives: ['Hiểu vai trò của nước', 'Nhận biết dấu hiệu mất nước', 'Biết cách uống đủ nước'],
        content: [
          { type: 'heading', content: 'Vai trò của nước' },
          { type: 'text', content: 'Nước chiếm 60% cơ thể, tham gia vào mọi quá trình sinh học: vận chuyển chất dinh dưỡng, điều hòa thân nhiệt, bôi trơn khớp, đào thải chất thải.', markdown: true },
          { type: 'heading', content: 'Dấu hiệu mất nước' },
          { type: 'list', content: ['Khát nước', 'Nước tiểu vàng đậm', 'Da khô', 'Mệt mỏi', 'Chóng mặt', 'Táo bón'] }
        ],
        takeaways: ['Uống 2-3 lít nước/ngày', 'Uống nhiều hơn khi vận động', 'Quan sát màu nước tiểu'],
        quiz: [
          { id: 'q1-hydration', questionText: 'Nước chiếm bao nhiêu % cơ thể?', options: ['30%', '40%', '60%', '80%'], correctAnswerIndex: 2, explanation: 'Nước chiếm khoảng 60% trọng lượng cơ thể.' },
          { id: 'q2-hydration', questionText: 'Dấu hiệu mất nước?', options: ['Nước tiểu trong', 'Nước tiểu vàng đậm và khát nước', 'Da mướt', 'Năng lượng dồi dào'], correctAnswerIndex: 1, explanation: 'Nước tiểu vàng đậm và cảm giác khát là dấu hiệu mất nước.' },
          { id: 'q3-hydration', questionText: 'Nên uống bao nhiêu nước mỗi ngày?', options: ['0.5 lít', '1 lít', '2-3 lít', '5 lít'], correctAnswerIndex: 2, explanation: 'Khuyến nghị uống 2-3 lít nước/ngày, tùy hoạt động và khí hậu.' },
          { id: 'q4-hydration', questionText: 'Khi nào cần uống nhiều nước hơn?', options: ['Khi ngồi làm việc', 'Khi vận động, trời nóng', 'Khi ngủ', 'Không cần thay đổi'], correctAnswerIndex: 1, explanation: 'Khi vận động hoặc trời nóng, cơ thể mất nhiều nước qua mồ hôi, cần bổ sung nhiều hơn.' },
          { id: 'q5-hydration', questionText: 'Nước có vai trò gì với khớp?', options: ['Không liên quan', 'Bôi trơn khớp', 'Làm cứng khớp', 'Gây đau khớp'], correctAnswerIndex: 1, explanation: 'Nước giúp bôi trơn khớp, giảm ma sát khi vận động.' },
          { id: 'q6-hydration', questionText: 'Uống nước giúp kiểm soát cân nặng như thế nào?', options: ['Không giúp gì', 'Tăng cảm giác no, tăng trao đổi chất', 'Làm tăng cân', 'Giảm trao đổi chất'], correctAnswerIndex: 1, explanation: 'Uống nước trước bữa ăn tăng cảm giác no, hỗ trợ kiểm soát khẩu phần ăn.' },
          { id: 'q7-hydration', questionText: 'Nước có vai trò gì với da?', options: ['Làm da khô', 'Duy trì độ ẩm và đàn hồi', 'Không ảnh hưởng', 'Gây mụn'], correctAnswerIndex: 1, explanation: 'Uống đủ nước giúp da mềm mại, đàn hồi và khỏe mạnh.' },
          { id: 'q8-hydration', questionText: 'Nước có trong thực phẩm nào?', options: ['Chỉ trong nước lọc', 'Rau củ, trái cây', 'Bánh mì khô', 'Thịt nướng'], correctAnswerIndex: 1, explanation: 'Rau củ, trái cây chứa nhiều nước, giúp bổ sung lượng nước cho cơ thể.' },
          { id: 'q9-hydration', questionText: 'Cà phê và trà có tính vào lượng nước không?', options: ['Hoàn toàn không', 'Có, nhưng caffeine có tác dụng lợi tiểu nhẹ', 'Làm mất nước hoàn toàn', 'Tốt hơn nước lọc'], correctAnswerIndex: 1, explanation: 'Cà phê và trà tính vào lượng nước nhưng caffeine có tác dụng lợi tiểu nhẹ.' },
          { id: 'q10-hydration', questionText: 'Uống quá nhiều nước có hại không?', options: ['Hoàn toàn vô hại', 'Có, có thể gây rối loạn điện giải (hyponatremia)', 'Càng nhiều càng tốt', 'Không thể uống quá nhiều'], correctAnswerIndex: 1, explanation: 'Uống quá nhiều nước trong thời gian ngắn có thể làm loãng điện giải trong máu, nguy hiểm cho sức khỏe.' }
        ],
        metadata: { views: 0, likes: 0 }
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
        title: 'Tăng cân lành mạnh',
        category: 'weight-management',
        difficulty: 'Intermediate',
        duration: 20,
        xp: 100,
        heroImage: '/images/lessons/weight-gain.jpg',
        summary: 'Cách tăng cân lành mạnh thông qua chế độ ăn và tập luyện phù hợp.',
        objectives: ['Hiểu nguyên tắc tăng cân', 'Xác định lượng calo thặng dư', 'Lựa chọn thực phẩm giàu dinh dưỡng'],
        content: [
          { type: 'heading', content: 'Nguyên tắc tăng cân' },
          { type: 'text', content: 'Tạo thặng dư calo - tiêu thụ nhiều hơn đốt cháy. Mục tiêu là tăng từ cơ bắp thông qua việc kết hợp ăn uống và tập luyện sức mạnh, thay vì chỉ tăng mỡ thừa.', markdown: true },
          { type: 'heading', content: 'Lượng calo thặng dư & Dinh dưỡng' },
          { type: 'text', content: 'Tăng khoảng 300-500 kcal/ngày để tăng cân từ từ (~0.5kg/tuần). Để tối ưu xây dựng cơ bắp, người tập luyện cần nạp 1.6-2.2g protein/kg cân nặng mỗi ngày. Sinh tố (smoothie) là lựa chọn tốt giúp nạp thêm calo dễ dàng.', markdown: true }
        ],
        takeaways: ['Thặng dư calo hợp lý', 'Ăn nhiều bữa nhỏ', 'Kết hợp tập sức mạnh'],
        quiz: [
          { id: 'q1-weight-gain', questionText: 'Lượng calo thặng dư để tăng cân lành mạnh?', options: ['100-200', '300-500', '700-900', '1000-1500'], correctAnswerIndex: 1, explanation: '300-500 kcal/ngày giúp tăng cân từ từ và lành mạnh.' },
          { id: 'q2-weight-gain', questionText: 'Tốc độ tăng cân lành mạnh/tuần?', options: ['0.25kg', '0.5kg', '1kg', '1.5kg'], correctAnswerIndex: 1, explanation: 'Tăng ~0.5kg/tuần là tốc độ lý tưởng.' },
          { id: 'q3-weight-gain', questionText: 'Nên tập loại hình nào để tăng cơ?', options: ['Chạy bộ', 'Tập tạ/sức mạnh', 'Yoga', 'Bơi lội'], correctAnswerIndex: 1, explanation: 'Tập tạ giúp kích thích tăng trưởng cơ bắp.' },
          { id: 'q4-weight-gain', questionText: 'Nên ăn bao nhiêu bữa/ngày khi tăng cân?', options: ['1-2', '3', '5-6 bữa nhỏ', '10'], correctAnswerIndex: 2, explanation: 'Ăn nhiều bữa nhỏ giúp dễ tiêu thụ đủ calo.' },
          { id: 'q5-weight-gain', questionText: 'Thực phẩm nào giàu calo lành mạnh?', options: ['Kẹo ngọt', 'Hạt, bơ, dầu ô liu, cá hồi', 'Nước ngọt', 'Snack chiên'], correctAnswerIndex: 1, explanation: 'Hạt, bơ, dầu ô liu, cá giàu calo và chất dinh dưỡng.' },
          { id: 'q6-weight-gain', questionText: 'Protein cần bao nhiêu g/kg khi tập luyện tăng cơ?', options: ['0.8-1g', '1.6-2.2g', '3-4g', '5g'], correctAnswerIndex: 1, explanation: 'Người tập luyện cần 1.6-2.2g protein/kg để tối ưu hóa việc xây dựng và phục hồi cơ bắp.' },
          { id: 'q7-weight-gain', questionText: 'Nên ăn gì trước khi ngủ?', options: ['Không ăn gì', 'Bữa ăn nhẹ giàu protein', 'Đồ ngọt', 'Đồ chiên'], correctAnswerIndex: 1, explanation: 'Protein trước ngủ hỗ trợ phục hồi và tăng trưởng cơ ban đêm.' },
          { id: 'q8-weight-gain', questionText: 'Tăng cân nhanh có tốt không?', options: ['Rất tốt', 'Không, dễ tích mỡ thay vì cơ', 'Càng nhanh càng tốt', 'Không ảnh hưởng'], correctAnswerIndex: 1, explanation: 'Tăng cân quá nhanh dẫn đến tích mỡ nhiều hơn cơ.' },
          { id: 'q9-weight-gain', questionText: 'Smoothie có tốt cho tăng cân không?', options: ['Không', 'Có, giúp tăng calo dễ dàng', 'Chỉ làm tăng mỡ', 'Không liên quan'], correctAnswerIndex: 1, explanation: 'Smoothie giàu calo, dễ tiêu hóa, phù hợp cho tăng cân.' },
          { id: 'q10-weight-gain', questionText: 'Nên nghỉ ngơi bao lâu giữa các buổi tập?', options: ['Không cần nghỉ', 'Ít nhất 1 ngày cho mỗi nhóm cơ', 'Nghỉ 1 tuần', 'Nghỉ 1 tháng'], correctAnswerIndex: 1, explanation: 'Cơ cần thời gian nghỉ ngơi để phục hồi và phát triển.' }
        ],
        metadata: { views: 0, likes: 0 }
      }
    ]
  },
  {
    id: 'sports-nutrition',
    name: 'Dinh dưỡng thể thao',
    icon: 'Activity',
    color: 'orange',
    expanded: false,
    lessons: [
      {
        id: 'pre-workout-nutrition',
        title: 'Dinh dưỡng trước tập',
        category: 'sports-nutrition',
        difficulty: 'Intermediate',
        duration: 20,
        xp: 120,
        heroImage: '/images/lessons/pre-workout.jpg',
        summary: 'Tối ưu năng lượng và hiệu suất tập luyện qua việc nạp dinh dưỡng đúng cách trước khi tập.',
        objectives: ['Hiểu tầm quan trọng bữa ăn trước tập', 'Chọn thực phẩm cung cấp năng lượng', 'Thời gian lý tưởng'],
        content: [
          { type: 'heading', content: 'Tại sao cần ăn trước tập?' },
          { type: 'text', content: 'Cung cấp glycogen cho cơ, ngăn phân giải protein, duy trì năng lượng cao. Đối với buổi tập sáng, một bữa ăn nhẹ (chuối, yến mạch) là lý tưởng.', markdown: true },
          { type: 'list', content: ['**2-3h trước**: Bữa đầy đủ carb phức tạp + protein, và uống 300-500ml nước', '**30-60 phút**: Bữa nhẹ carb đơn (hấp thụ nhanh) + ít protein', '**Tránh**: Nhiều chất béo và chất xơ sát giờ tập vì khó tiêu hóa'] }
        ],
        takeaways: ['Carb là chìa khóa năng lượng', 'Thời gian quyết định loại thực phẩm', 'Tránh béo và xơ sát giờ tập'],
        quiz: [
          { id: 'q1-preworkout', questionText: 'Tránh ăn gì sát giờ tập?', options: ['Chuối', 'Đồ nhiều béo và xơ', 'Bánh mì trắng', 'Sữa chua'], correctAnswerIndex: 1, explanation: 'Béo và xơ tiêu hóa chậm, gây khó chịu khi tập.' },
          { id: 'q2-preworkout', questionText: 'Bữa ăn 2-3h trước tập nên gồm?', options: ['Chỉ nước', 'Bữa đầy đủ carb phức + protein', 'Chỉ đường', 'Nhiều dầu mỡ'], correctAnswerIndex: 1, explanation: '2-3h đủ để tiêu hóa bữa đầy đủ, cung cấp năng lượng bền.' },
          { id: 'q3-preworkout', questionText: 'Glycogen là gì?', options: ['Loại protein', 'Dạng dự trữ carb trong cơ', 'Loại vitamin', 'Chất béo'], correctAnswerIndex: 1, explanation: 'Glycogen là dạng dự trữ carb, cung cấp năng lượng khi tập.' },
          { id: 'q4-preworkout', questionText: 'Nên ăn gì 30 phút trước tập?', options: ['Thịt nướng', 'Chuối, bánh mì trắng', 'Salad nhiều xơ', 'Đồ chiên'], correctAnswerIndex: 1, explanation: 'Carb đơn hấp thụ nhanh, cung cấp năng lượng tức thì.' },
          { id: 'q5-preworkout', questionText: 'Uống bao nhiêu nước trước tập?', options: ['Không cần', '300-500ml 2h trước', '3 lít ngay trước', '100ml'], correctAnswerIndex: 1, explanation: 'Uống 300-500ml nước 2h trước giúp cơ thể đủ nước khi tập.' },
          { id: 'q6-preworkout', questionText: 'Cà phê trước tập có lợi không?', options: ['Không', 'Có, caffeine tăng tập trung và sức bền', 'Gây hại', 'Không ảnh hưởng'], correctAnswerIndex: 1, explanation: 'Caffeine giúp tăng tập trung, giảm mệt mỏi, cải thiện hiệu suất.' },
          { id: 'q7-preworkout', questionText: 'Nên ăn protein trước tập không?', options: ['Không cần', 'Có, nhưng ít hơn carb', 'Chỉ ăn protein', 'Tránh hoàn toàn'], correctAnswerIndex: 1, explanation: 'Protein giúp ngăn phân giải cơ, nhưng carb là ưu tiên.' },
          { id: 'q8-preworkout', questionText: 'Tập bụng đói có tốt không?', options: ['Rất tốt', 'Không, giảm hiệu suất và dễ mất cơ', 'Tốt nhất', 'Không ảnh hưởng'], correctAnswerIndex: 1, explanation: 'Tập đói khiến cơ thể phân giải protein cơ để lấy năng lượng.' },
          { id: 'q9-preworkout', questionText: 'Nên ăn gì nếu tập sáng sớm?', options: ['Không ăn', 'Bữa nhẹ: chuối, yến mạch', 'Bữa no', 'Chỉ uống nước'], correctAnswerIndex: 1, explanation: 'Bữa nhẹ dễ tiêu cung cấp năng lượng nhanh cho buổi tập sáng.' },
          { id: 'q10-preworkout', questionText: 'Vai trò carb trước tập?', options: ['Không quan trọng', 'Cung cấp năng lượng tức thì cho cơ', 'Chỉ làm tăng mỡ', 'Gây mệt'], correctAnswerIndex: 1, explanation: 'Carb là nguồn năng lượng chính, giúp tập cường độ cao hiệu quả.' }
        ],
        metadata: { views: 0, likes: 0 }
      },
      {
        id: 'post-workout-recovery',
        title: 'Phục hồi sau tập',
        category: 'sports-nutrition',
        difficulty: 'Advanced',
        duration: 25,
        xp: 150,
        heroImage: '/images/lessons/post-workout.jpg',
        summary: 'Khám phá "cửa sổ đồng hóa" và cách cung cấp dinh dưỡng sau tập để tối đa phục hồi cơ bắp.',
        objectives: ['Hiểu cửa sổ đồng hóa', 'Vai trò protein và carb', 'Lựa chọn thực phẩm tối ưu'],
        content: [
          { type: 'heading', content: 'Phục hồi cơ và Glycogen' },
          { type: 'text', content: 'Sau tập, glycogen cạn kiệt, cơ bị tổn thương. Nạp dinh dưỡng ngay trong vòng 2h giúp bù glycogen và kích thích tổng hợp protein cơ (MPS). Việc bỏ qua bữa ăn này sẽ làm giảm đáng kể khả năng phục hồi.', markdown: true },
          { type: 'list', content: ['**20-40g Protein hấp thụ nhanh** (Whey, trứng) - Cung cấp dồi dào BCAA (đặc biệt là Leucine) giúp phục hồi cơ', '**Carb với tỷ lệ 3:1** so với protein để đẩy nhanh insulin', '**Cấp nước và điện giải**'] }
        ],
        takeaways: ['Protein sửa chữa cơ', 'Carb phục hồi năng lượng', 'Trong vòng 2h sau tập'],
        quiz: [
          { id: 'q1-postworkout', questionText: 'Tỷ lệ Carb:Protein sau tập?', options: ['1:3', '3:1', '1:1', 'Chỉ protein'], correctAnswerIndex: 1, explanation: '3 Carb : 1 Protein tối ưu phục hồi glycogen và cơ.' },
          { id: 'q2-postworkout', questionText: 'Mục đích carb sau tập?', options: ['Tăng mỡ', 'Giảm thèm ăn', 'Tăng insulin và phục hồi glycogen', 'Tiêu hóa chậm'], correctAnswerIndex: 2, explanation: 'Carb tăng insulin, đẩy nhanh bù glycogen và vận chuyển amino acid.' },
          { id: 'q3-postworkout', questionText: 'Nên ăn bao nhiêu protein sau tập?', options: ['5-10g', '20-40g', '100g', '200g'], correctAnswerIndex: 1, explanation: '20-40g protein đủ để kích hoạt MPS tối đa.' },
          { id: 'q4-postworkout', questionText: 'Thời gian vàng sau tập là?', options: ['Trong 2h', 'Sau 12h', 'Sau 24h', 'Không quan trọng'], correctAnswerIndex: 0, explanation: 'Trong 2h sau tập là thời điểm cơ thể hấp thụ dinh dưỡng tốt nhất.' },
          { id: 'q5-postworkout', questionText: 'Whey protein tốt cho sau tập vì?', options: ['Rẻ', 'Hấp thụ nhanh', 'Ngon', 'Nhiều calo'], correctAnswerIndex: 1, explanation: 'Whey hấp thụ nhanh, cung cấp amino acid tức thì cho cơ.' },
          { id: 'q6-postworkout', questionText: 'Cần uống gì sau tập?', options: ['Chỉ nước lọc', 'Nước + điện giải', 'Nước ngọt', 'Cà phê'], correctAnswerIndex: 1, explanation: 'Nước và điện giải bù lượng mất qua mồ hôi.' },
          { id: 'q7-postworkout', questionText: 'BCAA là gì?', options: ['Loại carb', 'Nhóm amino acid chuỗi nhánh', 'Loại vitamin', 'Chất béo'], correctAnswerIndex: 1, explanation: 'BCAA (Leucine, Isoleucine, Valine) giúp phục hồi và tăng trưởng cơ.' },
          { id: 'q8-postworkout', questionText: 'Bỏ qua bữa sau tập ảnh hưởng gì?', options: ['Không sao', 'Giảm phục hồi và tăng trưởng cơ', 'Tốt hơn', 'Giúp giảm cân nhanh'], correctAnswerIndex: 1, explanation: 'Bỏ bữa sau tập làm giảm khả năng phục hồi và phát triển cơ.' },
          { id: 'q9-postworkout', questionText: 'Nên ăn gì sau tập cardio?', options: ['Không cần ăn', 'Protein + Carb', 'Chỉ chất béo', 'Chỉ rau xanh'], correctAnswerIndex: 1, explanation: 'Cardio cũng cạn kiệt glycogen, cần carb và protein để phục hồi.' },
          { id: 'q10-postworkout', questionText: 'Chuối có tốt sau tập không?', options: ['Không', 'Có, giàu carb và kali', 'Gây tăng mỡ', 'Không liên quan'], correctAnswerIndex: 1, explanation: 'Chuối giàu carb nhanh và kali, lý tưởng cho phục hồi sau tập.' }
        ],
        metadata: { views: 0, likes: 0 }
      }
    ]
  }
];

/**
 * Get all lessons across all categories
 */
export function getAllLessons() {
  return categories.flatMap(category => category.lessons);
}

/**
 * Get lesson by ID
 */
export function getLessonById(lessonId) {
  const allLessons = getAllLessons();
  return allLessons.find(lesson => lesson.id === lessonId) || null;
}

/**
 * Get category by ID
 */
export function getCategoryById(categoryId) {
  return categories.find(category => category.id === categoryId) || null;
}

/**
 * Get lessons by category
 */
export function getLessonsByCategory(categoryId) {
  const category = getCategoryById(categoryId);
  return category ? category.lessons : [];
}

/**
 * Validate lesson data structure
 */
export function isValidLesson(lesson) {
  return (
    lesson && lesson.id && lesson.title && lesson.category &&
    lesson.difficulty && typeof lesson.duration === 'number' &&
    typeof lesson.xp === 'number' && Array.isArray(lesson.objectives) &&
    Array.isArray(lesson.content) && Array.isArray(lesson.takeaways) &&
    Array.isArray(lesson.quiz) && lesson.quiz.length >= 10
  );
}

export default categories;
