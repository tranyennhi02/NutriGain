import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Import Roboto fonts for Vietnamese Unicode support
import { RobotoRegular, RobotoBold } from "../fonts/roboto-fonts.js";

// NutriGain brand color
const NUTRIGAIN_GREEN = [76, 175, 80]; // #4CAF50

/**
 * Sanitize số về giá trị an toàn
 */
function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

/**
 * Sanitize số dương
 */
function safePositiveNumber(value, fallback = 1) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

/**
 * Normalize rect style to valid jsPDF values
 */
function normalizeRectStyle(style) {
  if (style === undefined || style === null || style === "") return undefined;
  const normalized = String(style).toUpperCase();
  // jsPDF rect chỉ nhận: "S", "F", "DF", "FD"
  if (["S", "F", "DF", "FD"].includes(normalized)) {
    return normalized;
  }
  console.warn("[PDF RECT INVALID STYLE FALLBACK]", { style });
  return undefined;
}

/**
 * Wrapper an toàn cho jsPDF.rect
 */
function safeRect(doc, x, y, width, height, style) {
  const safeX = safeNumber(x, NaN);
  const safeY = safeNumber(y, NaN);
  const safeWidth = safePositiveNumber(width, NaN);
  const safeHeight = safePositiveNumber(height, NaN);
  const safeStyle = normalizeRectStyle(style);
  
  const isValid = 
    doc &&
    Number.isFinite(safeX) &&
    Number.isFinite(safeY) &&
    Number.isFinite(safeWidth) &&
    Number.isFinite(safeHeight) &&
    safeWidth > 0 &&
    safeHeight > 0;
  
  if (!isValid) {
    console.warn("[PDF RECT SKIPPED INVALID ARGS]", {
      raw: { x, y, width, height, style },
      safe: { safeX, safeY, safeWidth, safeHeight, safeStyle },
    });
    return false;
  }
  
  try {
    if (safeStyle) {
      doc.rect(safeX, safeY, safeWidth, safeHeight, safeStyle);
    } else {
      doc.rect(safeX, safeY, safeWidth, safeHeight);
    }
    return true;
  } catch (error) {
    console.warn("[PDF RECT FAILED BUT SKIPPED]", {
      error,
      raw: { x, y, width, height, style },
      safe: { safeX, safeY, safeWidth, safeHeight, safeStyle },
    });
    return false;
  }
}

/**
 * Wrapper an toàn cho jsPDF.roundedRect
 */
function safeRoundedRect(doc, x, y, width, height, rx = 2, ry = 2, style) {
  const safeX = safeNumber(x, NaN);
  const safeY = safeNumber(y, NaN);
  const safeWidth = safePositiveNumber(width, NaN);
  const safeHeight = safePositiveNumber(height, NaN);
  const safeRx = safePositiveNumber(rx, 1);
  const safeRy = safePositiveNumber(ry, 1);
  const safeStyle = normalizeRectStyle(style);
  
  const isValid = 
    doc &&
    Number.isFinite(safeX) &&
    Number.isFinite(safeY) &&
    Number.isFinite(safeWidth) &&
    Number.isFinite(safeHeight) &&
    Number.isFinite(safeRx) &&
    Number.isFinite(safeRy) &&
    safeWidth > 0 &&
    safeHeight > 0;
  
  if (!isValid) {
    console.warn("[PDF ROUNDED RECT SKIPPED INVALID ARGS]", {
      raw: { x, y, width, height, rx, ry, style },
      safe: { safeX, safeY, safeWidth, safeHeight, safeRx, safeRy, safeStyle },
    });
    return false;
  }
  
  try {
    if (safeStyle) {
      doc.roundedRect(safeX, safeY, safeWidth, safeHeight, safeRx, safeRy, safeStyle);
    } else {
      doc.roundedRect(safeX, safeY, safeWidth, safeHeight, safeRx, safeRy);
    }
    return true;
  } catch (error) {
    console.warn("[PDF ROUNDED RECT FAILED BUT SKIPPED]", {
      error,
      raw: { x, y, width, height, rx, ry, style },
      safe: { safeX, safeY, safeWidth, safeHeight, safeRx, safeRy, safeStyle },
    });
    return false;
  }
}

/**
 * Wrapper an toàn cho jsPDF.line
 */
function safeLine(doc, x1, y1, x2, y2) {
  const safeX1 = safeNumber(x1, NaN);
  const safeY1 = safeNumber(y1, NaN);
  const safeX2 = safeNumber(x2, NaN);
  const safeY2 = safeNumber(y2, NaN);
  
  const isValid = 
    doc &&
    Number.isFinite(safeX1) &&
    Number.isFinite(safeY1) &&
    Number.isFinite(safeX2) &&
    Number.isFinite(safeY2);
  
  if (!isValid) {
    console.warn("[PDF LINE SKIPPED INVALID ARGS]", { 
      raw: { x1, y1, x2, y2 },
      safe: { safeX1, safeY1, safeX2, safeY2 }
    });
    return false;
  }
  
  try {
    doc.line(safeX1, safeY1, safeX2, safeY2);
    return true;
  } catch (error) {
    console.warn("[PDF LINE FAILED BUT SKIPPED]", {
      error,
      raw: { x1, y1, x2, y2 },
      safe: { safeX1, safeY1, safeX2, safeY2 }
    });
    return false;
  }
}

/**
 * Wrapper an toàn cho jsPDF.text
 */
function safeText(doc, text, x, y, options = {}) {
  const safeX = safeNumber(x, NaN);
  const safeY = safeNumber(y, NaN);
  const safeTextValue = text === null || text === undefined || text === "" 
    ? "Chưa có dữ liệu" 
    : String(text);
  
  const isValid = 
    doc &&
    Number.isFinite(safeX) &&
    Number.isFinite(safeY);
  
  if (!isValid) {
    console.warn("[PDF TEXT SKIPPED INVALID ARGS]", { 
      text, 
      raw: { x, y },
      safe: { safeX, safeY },
      options 
    });
    return false;
  }
  
  try {
    doc.text(safeTextValue, safeX, safeY, options);
    return true;
  } catch (error) {
    console.warn("[PDF TEXT FAILED BUT SKIPPED]", {
      error,
      text,
      raw: { x, y },
      safe: { safeX, safeY },
      options
    });
    return false;
  }
}

/**
 * Format số với dấu phân cách và suffix
 */
function formatNumber(value, suffix = "") {
  if (value === null || value === undefined || isNaN(value)) {
    return "Chưa có dữ liệu";
  }
  const number = Number(value);
  if (!Number.isFinite(number)) return `0${suffix}`;
  return `${Math.round(number).toLocaleString("vi-VN")}${suffix}`;
}

/**
 * Format số thập phân với số chữ số xác định
 */
function formatDecimal(value, digits = 1) {
  if (value === null || value === undefined || isNaN(value)) {
    return "Chưa có dữ liệu";
  }
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return number.toFixed(digits);
}

/**
 * Format ngày tháng dd/mm/yyyy
 */
function formatDate(value) {
  const date = value ? new Date(value) : new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Normalize text for matching
 */
function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Get canonical meal type key
 */
function getCanonicalMealType(meal) {
  const mealKeysByLabel = {
    "Bữa sáng": "breakfast",
    "Bua sang": "breakfast",
    "bữa sáng": "breakfast",
    "bua sang": "breakfast",
    "Bữa trưa": "lunch",
    "Bua trua": "lunch",
    "bữa trưa": "lunch",
    "bua trua": "lunch",
    "Bữa tối": "dinner",
    "Bua toi": "dinner",
    "bữa tối": "dinner",
    "bua toi": "dinner",
    "Bữa phụ": "snacks",
    "Bua phu": "snacks",
    "bữa phụ": "snacks",
    "bua phu": "snacks",
  };

  if (typeof meal === "string") {
    return mealKeysByLabel[meal] || normalizeText(meal);
  }

  return (
    meal?.meal_type ||
    meal?.type ||
    meal?.key ||
    mealKeysByLabel?.[meal?.title] ||
    mealKeysByLabel?.[meal?.name] ||
    normalizeText(meal?.title || meal?.name || "meal")
  );
}

/**
 * Get canonical food ID
 */
function getCanonicalFoodId(itemOrLog) {
  return String(
    itemOrLog?.food_id ||
    itemOrLog?.foodId ||
    itemOrLog?.catalog_food_id ||
    itemOrLog?.catalogFoodId ||
    ""
  ).trim();
}

/**
 * Get meal log key
 */
function getCanonicalMealLogKey(meal, itemOrLog) {
  const mealType = getCanonicalMealType(meal);
  const foodId = getCanonicalFoodId(itemOrLog);
  if (!mealType || !foodId) return null;
  return `${mealType}-${foodId}`;
}

/**
 * Get meal log entry for an item
 */
function getMealLogEntry(mealLog, meal, item) {
  const entries = mealLog?.entries || {};
  const key = getCanonicalMealLogKey(meal, item);
  if (key && entries[key]) return entries[key];
  return null;
}

/**
 * Check if food is marked as eaten (matches Dashboard logic exactly)
 */
function isFoodMarkedEaten(item, entry) {
  return (
    entry?.status === "eaten" ||
    entry?.eaten === true ||
    entry?.is_eaten === true ||
    entry?.consumed === true
  );
}

/**
 * Tạo đánh giá dinh dưỡng dựa trên dữ liệu
 */
function generateNutritionAssessment(targetCal, eatenCal, progress, protein, carbs, fat, targetProtein = 0) {
  const assessments = [];
  
  // Đánh giá năng lượng
  const remainingCal = Math.max(0, targetCal - eatenCal);
  if (progress >= 95 && progress <= 105) {
    assessments.push(`✓ Đã hoàn thành ${progress}% mục tiêu năng lượng hôm nay - mức năng lượng rất tốt.`);
  } else if (progress >= 85 && progress < 95) {
    assessments.push(`→ Đã hoàn thành ${progress}% mục tiêu năng lượng. Còn thiếu ${remainingCal} kcal để đạt mục tiêu.`);
  } else if (progress < 85) {
    assessments.push(`⚠ Mức năng lượng còn thấp (${progress}%). Cần bổ sung thêm ${remainingCal} kcal để đạt mục tiêu.`);
  } else {
    assessments.push(`⚠ Đã vượt mục tiêu năng lượng (${progress}%). Nên theo dõi cẩn thận ở các bữa sau.`);
  }
  
  // Đánh giá protein
  if (targetProtein > 0) {
    const proteinPercent = Math.round((protein / targetProtein) * 100);
    if (proteinPercent >= 90) {
      assessments.push(`✓ Lượng protein đang ở mức tốt (${formatNumber(protein)}g).`);
    } else if (proteinPercent >= 70) {
      assessments.push(`→ Lượng protein ở mức trung bình. Nên bổ sung thêm thực phẩm giàu protein.`);
    } else {
      assessments.push(`⚠ Lượng protein còn thiếu. Cần tăng cường các món như thịt, cá, trứng, đậu.`);
    }
  } else {
    assessments.push(`→ Lượng protein hiện tại: ${formatNumber(protein)}g.`);
  }
  
  // Đánh giá cân bằng dinh dưỡng
  const total = protein * 4 + carbs * 4 + fat * 9;
  if (total > 0) {
    const proteinRatio = (protein * 4 / total * 100).toFixed(0);
    const carbsRatio = (carbs * 4 / total * 100).toFixed(0);
    const fatRatio = (fat * 9 / total * 100).toFixed(0);
    
    if (carbsRatio < 40) {
      assessments.push(`→ Nên bổ sung thêm carbohydrate (cơm, bánh mì, khoai) để cân bằng dinh dưỡng.`);
    }
    if (fatRatio > 35) {
      assessments.push(`⚠ Tỷ lệ chất béo hơi cao. Nên giảm thực phẩm chiên rán, dầu mỡ.`);
    }
  }
  
  // Khuyến nghị chung
  if (assessments.length === 1) {
    assessments.push(`✓ Chế độ ăn hôm nay đang được duy trì tốt. Hãy tiếp tục duy trì!`);
  }
  
  return assessments;
}

/**
 * Export nutrition report to PDF - NutriGain Modern Format
 * @param {Object} data - Report data
 * @param {Object} data.userEmail - Email người dùng
 * @param {Object} data.summary - Tóm tắt dinh dưỡng
 * @param {Object} data.profileSettings - Thông tin hồ sơ
 * @param {Array} data.meals - Danh sách bữa ăn
 * @param {Object} data.consumedNutrition - Dinh dưỡng đã tiêu thụ
 * @param {Object} data.validation - Validation data
 * @param {Object} data.nutritionTarget - Mục tiêu dinh dưỡng
 * @param {Object} data.mealLog - Meal log với eaten status
 */
export async function exportNutritionReportPdf(data) {
  const {
    userEmail = "",
    summary = {},
    profileSettings = {},
    meals = [],
    consumedNutrition = {},
    validation = {},
    nutritionTarget = {},
    mealLog = {},
  } = data || {};

  console.log("[PDF EXPORT] Starting with data:", {
    userEmail,
    hasSummary: !!summary,
    hasProfileSettings: !!profileSettings,
    mealsCount: Array.isArray(meals) ? meals.length : 0,
    hasConsumedNutrition: !!consumedNutrition,
    hasValidation: !!validation,
    hasNutritionTarget: !!nutritionTarget,
    hasMealLog: !!mealLog,
    mealLogEntriesCount: Object.keys(mealLog?.entries || {}).length,
  });

  try {
    // Initialize jsPDF with A4 portrait
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
      compress: true,
    });

    // Register Roboto fonts for Vietnamese Unicode support
    try {
      doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegular);
      doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
      
      doc.addFileToVFS("Roboto-Bold.ttf", RobotoBold);
      doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
      
      console.log("[PDF EXPORT] Roboto fonts registered successfully");
    } catch (error) {
      console.warn("[PDF EXPORT] Font registration warning:", error);
    }


    // A4 dimensions in points (1 pt = 1/72 inch)
    const pageWidth = safePositiveNumber(doc.internal.pageSize.getWidth(), 595);
    const pageHeight = safePositiveNumber(doc.internal.pageSize.getHeight(), 842);
    const margin = 40;
    const contentWidth = safePositiveNumber(pageWidth - 2 * margin, 515);
    let yPos = margin;

    console.log("[PDF EXPORT] Page dimensions:", { pageWidth, pageHeight, margin, contentWidth });

    // === HEADER - NUTRIGAIN BRANDING ===
    doc.setFillColor(...NUTRIGAIN_GREEN);
    safeRect(doc, 0, 0, pageWidth, 100, "F");
    
    // Logo area (left side)
    doc.setFontSize(28);
    doc.setFont("Roboto", "bold");
    doc.setTextColor(255, 255, 255);
    safeText(doc, "🥗 NUTRIGAIN", margin, 35);
    
    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    safeText(doc, "Hệ thống Dinh dưỡng Thông minh", margin, 55);
    
    // Report info (right side)
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    const reportDate = formatDate(new Date());
    const reportCode = `NG-${new Date().getTime().toString().slice(-8)}`;
    safeText(doc, `📅 Ngày: ${reportDate}`, pageWidth - margin, 30, { align: "right" });
    safeText(doc, `👤 Người dùng: ${userEmail || "N/A"}`, pageWidth - margin, 45, { align: "right" });
    safeText(doc, `#️⃣ Mã báo cáo: ${reportCode}`, pageWidth - margin, 60, { align: "right" });
    
    // Title
    doc.setFontSize(16);
    doc.setFont("Roboto", "bold");
    doc.setTextColor(255, 255, 255);
    safeText(doc, "BÁO CÁO DINH DƯỠNG HẰNG NGÀY", pageWidth / 2, 85, { align: "center" });

    yPos = 120;
    
    // === EXECUTIVE SUMMARY ===
    doc.setFillColor(240, 249, 255); // Light blue background
    safeRoundedRect(doc, margin, yPos, contentWidth, 70, 6, 6, "F");
    doc.setDrawColor(191, 219, 254);
    doc.setLineWidth(1);
    safeRoundedRect(doc, margin, yPos, contentWidth, 70, 6, 6, "S");
    
    doc.setFontSize(12);
    doc.setFont("Roboto", "bold");
    doc.setTextColor(59, 130, 246); // Blue
    safeText(doc, "📌 TÓM TẮT NHANH", margin + 10, yPos + 18);
    
    // Calculate summary data first
    const targetCal = summary?.targetCalories || nutritionTarget?.targetCalories || 0;
    const eatenCal = validation?.totalCalories || consumedNutrition?.calories || 0;
    const progress = targetCal > 0 ? Math.round((eatenCal / targetCal) * 100) : 0;
    
    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(0, 0, 0);
    
    let summaryText = `Hôm nay bạn đã tiêu thụ ${formatNumber(eatenCal)} kcal / ${formatNumber(targetCal)} kcal mục tiêu (${progress}%). `;
    if (progress >= 95 && progress <= 105) {
      summaryText += "✓ Chế độ ăn đạt chuẩn tốt!";
    } else if (progress < 85) {
      summaryText += `⚠️ Cần bổ sung thêm ${formatNumber(targetCal - eatenCal)} kcal.`;
    } else if (progress > 110) {
      summaryText += "⚠️ Đã vượt mức, cần điều chỉnh các bữa sau.";
    } else {
      summaryText += "→ Đang trên đà đạt mục tiêu!";
    }
    
    const summaryLines = doc.splitTextToSize(summaryText, contentWidth - 30);
    let summaryY = yPos + 38;
    summaryLines.forEach((line) => {
      safeText(doc, line, margin + 10, summaryY);
      summaryY += 14;
    });
    
    yPos += 90;

    // === PHẦN 1: THÔNG TIN NGƯỜI DÙNG ===
    doc.setFontSize(13);
    doc.setFont("Roboto", "bold");
    doc.setTextColor(...NUTRIGAIN_GREEN);
    safeText(doc, "PHẦN 1. THÔNG TIN NGƯỜI DÙNG 👤", margin, yPos);
    
    // Green underline
    doc.setDrawColor(...NUTRIGAIN_GREEN);
    doc.setLineWidth(2);
    safeLine(doc, margin, yPos + 3, margin + 240, yPos + 3);
    
    yPos += 20;

    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(0, 0, 0);

    const userName = profileSettings?.full_name || "Chưa có dữ liệu";
    const age = profileSettings?.age ? String(profileSettings.age) : "Chưa có dữ liệu";
    const gender = profileSettings?.sex === "male" ? "Nam" : profileSettings?.sex === "female" ? "Nữ" : "Khác";
    const height = profileSettings?.height || profileSettings?.height_cm ? formatNumber(profileSettings.height || profileSettings.height_cm) + " cm" : "Chưa có dữ liệu";
    const currentWeight = profileSettings?.weight || profileSettings?.weight_kg ? formatNumber(profileSettings.weight || profileSettings.weight_kg) + " kg" : "Chưa có dữ liệu";
    const targetWeight = profileSettings?.target_weight || profileSettings?.target_weight_kg ? formatNumber(profileSettings.target_weight || profileSettings.target_weight_kg) + " kg" : "Chưa có dữ liệu";
    const bmi = summary?.bmi ? formatDecimal(summary.bmi, 1) : "Chưa có dữ liệu";
    
    // BMI assessment with indicator
    let bmiStatus = "";
    let bmiIndicator = "";
    if (summary?.bmi) {
      if (summary.bmi < 18.5) {
        bmiStatus = "Thiếu cân";
        bmiIndicator = "⚠️";
      } else if (summary.bmi >= 18.5 && summary.bmi < 25) {
        bmiStatus = "Bình thường";
        bmiIndicator = "✓";
      } else if (summary.bmi >= 25 && summary.bmi < 30) {
        bmiStatus = "Thừa cân";
        bmiIndicator = "⚠️";
      } else {
        bmiStatus = "Béo phì";
        bmiIndicator = "⚠️";
      }
    }

    // User info card with 2-column layout
    const cardPadding = 12;
    const cardHeight = 110;
    
    // Draw rounded card background
    doc.setFillColor(248, 250, 252); // Light blue-gray
    safeRoundedRect(doc, margin, yPos, contentWidth, cardHeight, 6, 6, "F");
    
    // Draw border
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    safeRoundedRect(doc, margin, yPos, contentWidth, cardHeight, 6, 6, "S");
    
    // Column positions
    const col1X = margin + cardPadding;
    const col2X = margin + contentWidth / 2 + cardPadding;
    const labelWidth = 110;
    let cardY = yPos + cardPadding + 12;
    
    doc.setFontSize(10);
    
    // Left column
    const leftData = [
      ["👤 Họ tên", userName !== "Chưa có dữ liệu" ? userName : (userEmail || "Chưa có dữ liệu")],
      ["🎂 Tuổi", age],
      ["⚧ Giới tính", gender],
      ["📏 Chiều cao", height],
    ];
    
    leftData.forEach(([label, value]) => {
      doc.setFont("Roboto", "normal");
      doc.setTextColor(71, 85, 105);
      safeText(doc, label, col1X, cardY);
      doc.setFont("Roboto", "bold");
      doc.setTextColor(0, 0, 0);
      safeText(doc, value, col1X + labelWidth, cardY);
      cardY += 18;
    });
    
    // Right column
    cardY = yPos + cardPadding + 12;
    const rightData = [
      ["⚖️ Cân nặng hiện tại", currentWeight],
      ["🎯 Cân nặng mục tiêu", targetWeight],
      ["📊 BMI", bmi + (bmiStatus ? ` ${bmiIndicator} ${bmiStatus}` : "")],
    ];
    
    rightData.forEach(([label, value]) => {
      doc.setFont("Roboto", "normal");
      doc.setTextColor(71, 85, 105);
      safeText(doc, label, col2X, cardY);
      doc.setFont("Roboto", "bold");
      doc.setTextColor(0, 0, 0);
      safeText(doc, value, col2X + labelWidth, cardY);
      cardY += 18;
    });
    
    yPos += cardHeight + 20;

    // === PHẦN 2: TỔNG QUAN DINH DƯỠNG ===
    if (yPos + 100 > pageHeight - margin - 50) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(13);
    doc.setFont("Roboto", "bold");
    doc.setTextColor(...NUTRIGAIN_GREEN);
    safeText(doc, "PHẦN 2. TỔNG QUAN DINH DƯỠNG 📊", margin, yPos);
    
    doc.setDrawColor(...NUTRIGAIN_GREEN);
    doc.setLineWidth(2);
    safeLine(doc, margin, yPos + 3, margin + 250, yPos + 3);
    
    yPos += 20;

    const remainingCal = Math.max(0, targetCal - eatenCal);
    const bmr = summary?.bmr || 0;
    const tdee = summary?.tdee || 0;
    
    // Helper function to get color based on progress
    const getProgressColor = (current, target) => {
      if (!target || target === 0) return [100, 100, 100];
      const percent = (current / target) * 100;
      if (percent >= 95 && percent <= 105) return [76, 175, 80]; // Green - good
      if (percent < 85) return [245, 158, 11]; // Orange - warning
      if (percent > 110) return [239, 68, 68]; // Red - exceeded
      return [59, 130, 246]; // Blue - on track
    };
    
    const calColor = getProgressColor(eatenCal, targetCal);
    const progressColor = progress >= 95 && progress <= 105 ? "✓" : progress < 85 ? "⚠️" : progress > 110 ? "❌" : "→";

    // Use autoTable with custom cell coloring
    autoTable(doc, {
      startY: yPos,
      head: [["Chỉ số", "Giá trị", "Đơn vị", "Ghi chú"]],
      body: [
        ["📊 BMR", formatNumber(bmr), "kcal", "Năng lượng trao đổi cơ bản"],
        ["🔥 TDEE", formatNumber(tdee), "kcal", "Năng lượng duy trì ước tính"],
        ["🎯 Mục tiêu năng lượng", formatNumber(targetCal), "kcal/ngày", ""],
        ["🍽️ Đã tiêu thụ", formatNumber(eatenCal), "kcal", ""],
        ["⏳ Còn lại", formatNumber(remainingCal), "kcal", ""],
        [progressColor + " Tiến độ hoàn thành", String(progress) + "%", "", ""],
      ],
      styles: {
        font: "Roboto",
        fontSize: 9,
        cellPadding: 8,
        lineColor: [220, 220, 220],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: NUTRIGAIN_GREEN,
        textColor: [255, 255, 255],
        font: "Roboto",
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 130, fontStyle: "bold" },
        1: { cellWidth: 100, halign: "right", fontStyle: "bold" },
        2: { cellWidth: 80, halign: "center" },
        3: { cellWidth: 205 },
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      didParseCell: function(data) {
        // Color code the "Đã tiêu thụ" row
        if (data.row.index === 3 && data.column.index === 1) {
          data.cell.styles.textColor = calColor;
        }
        // Color code progress percentage
        if (data.row.index === 5 && data.column.index === 1) {
          if (progress >= 95 && progress <= 105) {
            data.cell.styles.textColor = [76, 175, 80]; // Green
          } else if (progress < 85) {
            data.cell.styles.textColor = [245, 158, 11]; // Orange
          } else if (progress > 110) {
            data.cell.styles.textColor = [239, 68, 68]; // Red
          } else {
            data.cell.styles.textColor = [59, 130, 246]; // Blue
          }
        }
      },
      margin: { left: margin },
    });

    yPos = doc.lastAutoTable.finalY + 20;

    // === PHẦN 3: PHÂN BỐ DINH DƯỠNG ===
    if (yPos + 80 > pageHeight - margin - 50) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(13);
    doc.setFont("Roboto", "bold");
    doc.setTextColor(...NUTRIGAIN_GREEN);
    safeText(doc, "PHẦN 3. PHÂN BỐ DINH DƯỠNG 🥗", margin, yPos);
    
    doc.setDrawColor(...NUTRIGAIN_GREEN);
    doc.setLineWidth(2);
    safeLine(doc, margin, yPos + 3, margin + 240, yPos + 3);
    
    yPos += 25;

    const protein = validation?.totalProtein || consumedNutrition?.protein || 0;
    const carbs = consumedNutrition?.carbs || validation?.totalCarbs || 0;
    const fat = consumedNutrition?.fat || validation?.totalFat || 0;

    const targetProtein = nutritionTarget?.protein || summary?.proteinTarget || 0;
    const targetCarbs = nutritionTarget?.carbs || summary?.carbsTarget || 0;
    const targetFat = nutritionTarget?.fat || summary?.fatTarget || 0;
    
    // Draw progress bars for each nutrient
    const drawProgressBar = (label, current, target, yPosition, color) => {
      const barWidth = contentWidth - 20;
      const barHeight = 12;
      const barX = margin + 10;
      
      // Label
      doc.setFontSize(10);
      doc.setFont("Roboto", "bold");
      doc.setTextColor(0, 0, 0);
      safeText(doc, label, barX, yPosition);
      
      // Values
      const valueText = `${formatNumber(current)}g / ${target > 0 ? formatNumber(target) + 'g' : '-'}`;
      safeText(doc, valueText, barX + barWidth - 10, yPosition, { align: "right" });
      
      yPosition += 6;
      
      // Background bar
      doc.setFillColor(240, 240, 240);
      safeRoundedRect(doc, barX, yPosition, barWidth, barHeight, 6, 6, "F");
      
      // Progress bar
      if (target > 0) {
        const progress = Math.min((current / target), 1);
        const progressWidth = barWidth * progress;
        doc.setFillColor(...color);
        if (progressWidth > 0) {
          safeRoundedRect(doc, barX, yPosition, progressWidth, barHeight, 6, 6, "F");
        }
        
        // Percentage text inside bar
        const percent = Math.round((current / target) * 100);
        doc.setFontSize(8);
        doc.setFont("Roboto", "bold");
        doc.setTextColor(255, 255, 255);
        if (progressWidth > 30) {
          safeText(doc, `${percent}%`, barX + progressWidth / 2, yPosition + 8.5, { align: "center" });
        }
      }
      
      return yPosition + barHeight + 18;
    };
    
    yPos = drawProgressBar("🥩 Protein", protein, targetProtein, yPos, [239, 68, 68]); // Red
    yPos = drawProgressBar("🍚 Carbohydrate", carbs, targetCarbs, yPos, [59, 130, 246]); // Blue
    yPos = drawProgressBar("🧈 Chất béo", fat, targetFat, yPos, [245, 158, 11]); // Orange
    
    yPos += 5;

    // === PHẦN 4: NHẬT KÝ BỮA ĂN ===
    if (yPos + 100 > pageHeight - margin - 50) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(13);
    doc.setFont("Roboto", "bold");
    doc.setTextColor(...NUTRIGAIN_GREEN);
    safeText(doc, "PHẦN 4. NHẬT KÝ BỮA ĂN 🍽️", margin, yPos);
    
    doc.setDrawColor(...NUTRIGAIN_GREEN);
    doc.setLineWidth(2);
    safeLine(doc, margin, yPos + 3, margin + 180, yPos + 3);
    
    yPos += 20;

    const mealLabels = {
      breakfast: "🌅 Bữa sáng",
      lunch: "☀️ Bữa trưa",
      dinner: "🌙 Bữa tối",
      snacks: "🍎 Bữa phụ",
    };
    
    // Summary approach: count eaten vs not eaten per meal
    const mealSummary = [];
    
    if (meals && meals.length > 0) {
      meals.forEach((meal) => {
        const mealName = mealLabels[meal.meal_type] || meal.title || "Bữa ăn";
        const items = meal.items || [];
        
        let totalItems = items.length;
        let eatenCount = 0;
        let totalKcal = 0;
        let totalProtein = 0;

        items.forEach((item) => {
          const entry = getMealLogEntry(mealLog, meal, item);
          const isEaten = isFoodMarkedEaten(item, entry);
          if (isEaten) {
            eatenCount++;
            totalKcal += item.calories || item.kcal || 0;
            totalProtein += item.protein || item.protein_g || 0;
          }
        });
        
        const statusText = `${eatenCount}/${totalItems} món`;
        const statusIndicator = eatenCount === totalItems ? "✓" : eatenCount > 0 ? "→" : "○";
        
        mealSummary.push([
          mealName,
          `${totalItems} món`,
          statusIndicator + " " + statusText,
          formatNumber(totalKcal),
          formatNumber(totalProtein),
        ]);
      });
    }

    if (mealSummary.length === 0) {
      mealSummary.push(["Chưa có dữ liệu", "-", "-", "-", "-"]);
    }

    autoTable(doc, {
      startY: yPos,
      head: [["Bữa ăn", "Tổng món", "Trạng thái", "Kcal đã ăn", "Protein (g)"]],
      body: mealSummary,
      styles: {
        font: "Roboto",
        fontSize: 9,
        cellPadding: 8,
        lineColor: [220, 220, 220],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: NUTRIGAIN_GREEN,
        textColor: [255, 255, 255],
        font: "Roboto",
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 110, fontStyle: "bold" },
        1: { cellWidth: 90, halign: "center" },
        2: { cellWidth: 115, halign: "center" },
        3: { cellWidth: 100, halign: "right", fontStyle: "bold" },
        4: { cellWidth: 100, halign: "right" },
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      didParseCell: function(data) {
        // Color code status column
        if (data.column.index === 2 && data.row.section === "body") {
          const statusText = data.cell.text[0] || "";
          if (statusText.includes("✓")) {
            data.cell.styles.textColor = [76, 175, 80]; // Green - all eaten
            data.cell.styles.fontStyle = "bold";
          } else if (statusText.includes("→")) {
            data.cell.styles.textColor = [245, 158, 11]; // Orange - partially eaten
          } else if (statusText.includes("○")) {
            data.cell.styles.textColor = [239, 68, 68]; // Red - not eaten
          }
        }
      },
      margin: { left: margin },
    });

    yPos = doc.lastAutoTable.finalY + 20;

    // === PHẦN 5: ĐÁNH GIÁ DINH DƯỠNG ===
    if (yPos + 120 > pageHeight - margin - 80) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(13);
    doc.setFont("Roboto", "bold");
    doc.setTextColor(...NUTRIGAIN_GREEN);
    safeText(doc, "PHẦN 5. ĐÁNH GIÁ & KHUYẾN NGHỊ 💡", margin, yPos);
    
    doc.setDrawColor(...NUTRIGAIN_GREEN);
    doc.setLineWidth(2);
    safeLine(doc, margin, yPos + 3, margin + 240, yPos + 3);
    
    yPos += 25;

    // Add info box background
    doc.setFillColor(254, 249, 240); // Light orange background
    const assessmentBoxHeight = 15;
    safeRoundedRect(doc, margin, yPos - 8, contentWidth, assessmentBoxHeight, 4, 4, "F");
    
    doc.setFontSize(9);
    doc.setFont("Roboto", "bold");
    doc.setTextColor(146, 64, 14); // Dark orange
    safeText(doc, "🤖 NutriGain AI Advisor - Phân tích chế độ ăn của bạn:", margin + 8, yPos);
    
    yPos += 18;

    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(0, 0, 0);

    // Generate assessment
    const assessments = generateNutritionAssessment(targetCal, eatenCal, progress, protein, carbs, fat, targetProtein);

    assessments.forEach((assessment, index) => {
      // Add bullet point styling
      const bulletSymbol = assessment.startsWith("✓") ? "✓" : 
                          assessment.startsWith("⚠") ? "⚠️" : 
                          assessment.startsWith("❌") ? "❌" : "→";
      
      // Remove emoji from text if present
      const cleanText = assessment.replace(/^[✓⚠️❌→]\s*/, "");
      
      // Set color based on type
      if (bulletSymbol === "✓") {
        doc.setTextColor(76, 175, 80); // Green
      } else if (bulletSymbol === "⚠️") {
        doc.setTextColor(245, 158, 11); // Orange
      } else if (bulletSymbol === "❌") {
        doc.setTextColor(239, 68, 68); // Red
      } else {
        doc.setTextColor(59, 130, 246); // Blue
      }
      
      doc.setFont("Roboto", "bold");
      safeText(doc, bulletSymbol, margin + 8, yPos);
      
      doc.setFont("Roboto", "normal");
      doc.setTextColor(0, 0, 0);
      
      const lines = doc.splitTextToSize(cleanText, contentWidth - 30);
      lines.forEach((line, lineIndex) => {
        if (yPos + 16 > pageHeight - margin - 80) {
          doc.addPage();
          yPos = margin;
        }
        safeText(doc, line, margin + 20, yPos);
        yPos += 14;
      });
      yPos += 4; // Extra space between assessments
    });

    yPos += 10;
    
    // Add signature box
    doc.setFillColor(248, 250, 252); // Light gray
    const signatureHeight = 35;
    safeRoundedRect(doc, margin, yPos, contentWidth, signatureHeight, 4, 4, "F");
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    safeRoundedRect(doc, margin, yPos, contentWidth, signatureHeight, 4, 4, "S");
    
    doc.setFontSize(9);
    doc.setFont("Roboto", "bold");
    doc.setTextColor(71, 85, 105);
    safeText(doc, "🏥 Hệ thống NutriGain", margin + 10, yPos + 15);
    
    doc.setFont("Roboto", "normal");
    doc.setTextColor(100, 116, 139);
    safeText(doc, `Báo cáo được tạo tự động vào ${formatDate(new Date())}`, margin + 10, yPos + 28);
    
    yPos += signatureHeight + 15;

    // Disclaimer
    doc.setFontSize(9);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(100, 100, 100);
    const disclaimer = "⚕️ Lưu ý: Báo cáo này chỉ mang tính chất tham khảo, không thay thế tư vấn y tế hoặc chỉ định của chuyên gia dinh dưỡng. Vui lòng tham khảo ý kiến bác sĩ nếu có vấn đề sức khỏe.";
    const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth - 10);
    disclaimerLines.forEach((line) => {
      if (yPos + 14 > pageHeight - margin - 40) {
        doc.addPage();
        yPos = margin;
      }
      safeText(doc, line, margin + 5, yPos);
      yPos += 12;
    });


    // === FOOTER ===
    const totalPages = doc.internal.pages.length - 1;
    const generatedDateTime = new Date();
    const generatedDateStr = `${formatDate(generatedDateTime)} ${generatedDateTime.getHours()}:${String(generatedDateTime.getMinutes()).padStart(2, '0')}`;
    
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Footer green line
      doc.setDrawColor(...NUTRIGAIN_GREEN);
      doc.setLineWidth(2);
      safeLine(doc, margin, pageHeight - 45, pageWidth - margin, pageHeight - 45);

      // Three-column footer layout
      doc.setFontSize(8);
      doc.setFont("Roboto", "normal");
      doc.setTextColor(100, 100, 100);
      
      // Left: System info
      safeText(doc, "🥗 NutriGain - Hệ thống Dinh dưỡng Thông minh", margin, pageHeight - 30);
      safeText(doc, "📧 support@nutrigain.vn | 🌐 www.nutrigain.vn", margin, pageHeight - 18);
      
      // Center: Confidential notice
      doc.setFont("Roboto", "bold");
      doc.setTextColor(239, 68, 68);
      safeText(doc, "🔒 BÁO CÁO MẬT", pageWidth / 2, pageHeight - 30, { align: "center" });
      doc.setFont("Roboto", "normal");
      doc.setTextColor(100, 100, 100);
      safeText(doc, "Chỉ dành cho người dùng", pageWidth / 2, pageHeight - 18, { align: "center" });
      
      // Right: Page number and date
      doc.setFont("Roboto", "bold");
      safeText(doc, `Trang ${i}/${totalPages}`, pageWidth - margin, pageHeight - 30, { align: "right" });
      doc.setFont("Roboto", "normal");
      safeText(doc, `Tạo lúc: ${generatedDateStr}`, pageWidth - margin, pageHeight - 18, { align: "right" });
    }

    // Save PDF
    const fileDate = new Date();
    const year = fileDate.getFullYear();
    const month = String(fileDate.getMonth() + 1).padStart(2, "0");
    const day = String(fileDate.getDate()).padStart(2, "0");
    const fileName = `nutrigain-bao-cao-dinh-duong-${year}-${month}-${day}.pdf`;
    doc.save(fileName);

    console.log(`[PDF Export] Successfully exported to ${fileName}`);
  } catch (error) {
    console.error("[PDF Export] Failed to generate PDF:", error);
    throw new Error("Không thể tạo PDF. Vui lòng thử lại.");
  }
}

