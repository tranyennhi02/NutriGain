from __future__ import annotations

import json
import logging
import os
import unicodedata
import urllib.error
import urllib.request
from datetime import date
from typing import Any
from uuid import uuid4

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.entities import (
    Food,
    FoodLog,
    MealConsumptionLog,
    MealPlan,
    User,
    UserProfileEntity,
    WeightLog,
)


logger = logging.getLogger(__name__)

# Conversation history storage (in-memory, by conversation_id)
_conversation_history: dict[str, list[dict[str, str]]] = {}
MAX_HISTORY_MESSAGES = 10

DEFAULT_SUGGESTED_QUESTIONS = [
    "Hôm nay tôi nên ăn thêm gì?",
    "Protein là gì?",
    "Tại sao ngủ quan trọng?",
    "Tăng cân lành mạnh là gì?",
]


def generate_chat_response(
    db: Session,
    current_user: User,
    message: str,
    conversation_id: str | None = None,
    page: str | None = None,
) -> dict[str, Any]:
    try:
        context = build_user_context(db, current_user)
    except Exception as exc:
        logger.warning("Failed to build AI chat context, using empty context: %s", exc)
        context = {"profile": {}, "meal_plan_today": None, "weight_trend": None}
    context["page"] = page

    # Get or create conversation ID
    conv_id = conversation_id or str(uuid4())
    
    # Get conversation history
    history = _conversation_history.get(conv_id, [])

    answer = ""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if api_key:
        try:
            prompt = build_gemini_prompt(message, context, history)
            answer = call_gemini(prompt)
        except Exception as exc:
            logger.warning("Gemini chat failed, using fallback: %s", exc)

    if not answer:
        answer = fallback_chat_response(message, context)

    # Update conversation history
    history.append({"role": "user", "message": message})
    history.append({"role": "assistant", "message": answer})
    _conversation_history[conv_id] = history[-MAX_HISTORY_MESSAGES:]

    return {
        "answer": answer,
        "conversation_id": conv_id,
        "suggested_questions": suggested_questions_for(message, context),
    }


def call_gemini(prompt: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured")

    # Use valid Gemini models - tested and working
    configured_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip() or "gemini-2.5-flash"
    models = unique_models([
        configured_model,
        "gemini-2.5-flash",      # Stable, fast, good for chat
        "gemini-flash-latest",   # Always uses latest flash model
        "gemini-2.0-flash"       # Fallback option
    ])
    last_error: Exception | None = None
    for model in models:
        try:
            return call_gemini_model(prompt, api_key, model)
        except Exception as exc:
            last_error = exc
            logger.warning("Gemini model %s failed: %s", model, exc)
    
    # If all models fail, log the error and raise
    logger.error("All Gemini models failed. Please check your API key and model availability.")
    raise RuntimeError(f"All Gemini model attempts failed: {last_error}") from last_error


def call_gemini_model(prompt: str, api_key: str, model: str) -> str:
    # Use v1beta API with full model path
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}],
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 600,
            "topP": 0.9,
            "topK": 40,
        },
        "safetySettings": [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            }
        ],
    }

    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        error_body = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"Gemini HTTP {exc.code}: {error_body[:240]}") from exc

    try:
        text = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError) as exc:
        raise RuntimeError("Gemini response did not include answer text") from exc

    answer = str(text).strip()
    if not answer:
        raise RuntimeError("Gemini returned an empty answer")
    return answer


def unique_models(models: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for model in models:
        normalized = str(model or "").strip()
        if normalized and normalized not in seen:
            seen.add(normalized)
            result.append(normalized)
    return result


def build_user_context(db: Session, current_user: User) -> dict[str, Any]:
    context: dict[str, Any] = {
        "profile": {},
        "meal_plan_today": None,
        "weight_trend": None,
    }

    profile = (
        db.query(UserProfileEntity)
        .filter(UserProfileEntity.user_id == current_user.id)
        .first()
    )
    if profile:
        context["profile"] = {
            "weight_kg": profile.weight_kg,
            "target_weight_kg": profile.target_weight_kg,
            "height_cm": profile.height_cm,
            "age": profile.age,
            "sex": profile.sex,
            "gender": profile.gender,
            "activity_level": profile.activity_level,
            "weight_gain_speed": profile.weight_gain_speed,
            "diet_type": profile.diet_type,
            "budget_level": profile.budget_level,
            "items_per_meal": profile.items_per_meal,
        }

    today = date.today()
    meal_plan = (
        db.query(MealPlan)
        .filter(MealPlan.user_id == current_user.id, MealPlan.plan_date == today)
        .order_by(MealPlan.id.desc())
        .first()
    )
    if meal_plan is None:
        meal_plan = (
            db.query(MealPlan)
            .filter(MealPlan.user_id == current_user.id)
            .order_by(MealPlan.plan_date.desc().nullslast(), MealPlan.id.desc())
            .first()
        )

    if meal_plan:
        actual_kcal, actual_protein = get_actual_nutrition(db, current_user.id, today)
        meal_names = meal_item_names(db, meal_plan)
        target_kcal = meal_plan.target_kcal or None
        target_protein = meal_plan.target_protein or None
        context["meal_plan_today"] = {
            "id": meal_plan.id,
            "date": meal_plan.plan_date.isoformat() if meal_plan.plan_date else None,
            "target_kcal": round_float(target_kcal),
            "target_protein": round_float(target_protein, 1),
            "total_kcal": round_float(meal_plan.total_kcal),
            "total_protein": round_float(meal_plan.total_protein, 1),
            "actual_kcal": round_float(actual_kcal),
            "actual_protein": round_float(actual_protein, 1),
            "missing_kcal": round_float(target_kcal - actual_kcal) if target_kcal is not None else None,
            "missing_protein": round_float(target_protein - actual_protein, 1) if target_protein is not None else None,
            "score": round_float(meal_plan.score, 1),
            "status": meal_plan.status,
            "breakfast": meal_names.get("breakfast", []),
            "lunch": meal_names.get("lunch", []),
            "dinner": meal_names.get("dinner", []),
            "snack": meal_names.get("snack", []),
        }

    logs = (
        db.query(WeightLog)
        .filter(WeightLog.user_id == current_user.id)
        .order_by(WeightLog.log_date.desc(), WeightLog.id.desc())
        .limit(5)
        .all()
    )
    if logs:
        latest = logs[0]
        oldest = logs[-1]
        context["weight_trend"] = {
            "latest_weight_kg": latest.weight_kg,
            "latest_log_date": latest.log_date.isoformat() if latest.log_date else None,
            "recent_change_kg": round_float(latest.weight_kg - oldest.weight_kg, 1) if len(logs) > 1 else None,
        }

    return context


def get_actual_nutrition(db: Session, user_id: int, target_date: date) -> tuple[float, float]:
    food_log = (
        db.query(FoodLog)
        .filter(FoodLog.user_id == user_id, FoodLog.log_date == target_date)
        .order_by(FoodLog.id.desc())
        .first()
    )
    if food_log:
        return float(food_log.consumed_kcal or 0), float(food_log.consumed_protein or 0)

    logs = (
        db.query(MealConsumptionLog)
        .filter(MealConsumptionLog.user_id == user_id)
        .filter(func.date(MealConsumptionLog.consumed_at) == target_date)
        .all()
    )
    return (
        sum(float(log.kcal or 0) for log in logs),
        sum(float(log.protein or 0) for log in logs),
    )


def meal_item_names(db: Session, meal_plan: MealPlan) -> dict[str, list[str]]:
    result: dict[str, list[str]] = {}
    for meal in meal_plan.meals or []:
        key = str(meal.meal_type or "").lower()
        names: list[str] = []
        for item in meal.items or []:
            food = db.query(Food).filter(Food.food_id == str(item.food_id)).first()
            name = (
                getattr(food, "display_name", None)
                or getattr(food, "dish_name_vi", None)
                or getattr(food, "name_vi", None)
                or getattr(food, "name", None)
                if food
                else None
            )
            names.append(str(name or item.food_id))
        result[key] = names
    return result


def build_gemini_prompt(message: str, context: dict[str, Any], history: list[dict[str, str]] | None = None) -> str:
    # Build conversation history text
    history_text = ""
    if history and len(history) > 0:
        history_lines = []
        for turn in history[-6:]:  # Last 3 exchanges (6 messages)
            role = turn.get("role", "")
            msg = turn.get("message", "")
            if role == "user":
                history_lines.append(f"Người dùng: {msg}")
            elif role == "assistant":
                history_lines.append(f"Trợ lý: {msg}")
        if history_lines:
            history_text = "\n\nLịch sử hội thoại gần đây:\n" + "\n".join(history_lines)
    
    # Enhanced context with better structure
    profile = context.get("profile", {})
    meal_plan = context.get("meal_plan_today", {})
    weight_trend = context.get("weight_trend", {})
    
    # Build personalized context summary
    personal_summary = []
    if profile.get("weight_kg") and profile.get("target_weight_kg"):
        current = profile["weight_kg"]
        target = profile["target_weight_kg"]
        diff = round(target - current, 1)
        personal_summary.append(f"- Cân nặng hiện tại: {current}kg, mục tiêu: {target}kg (cần tăng {diff}kg)")
    
    if meal_plan.get("missing_kcal") is not None:
        missing_kcal = meal_plan["missing_kcal"]
        if missing_kcal > 0:
            personal_summary.append(f"- Hôm nay còn thiếu {round(missing_kcal)} kcal")
        else:
            personal_summary.append(f"- Hôm nay đã đạt mục tiêu năng lượng")
    
    if meal_plan.get("missing_protein") is not None:
        missing_protein = meal_plan["missing_protein"]
        if missing_protein > 0:
            personal_summary.append(f"- Hôm nay còn thiếu {round(missing_protein, 1)}g protein")
        else:
            personal_summary.append(f"- Hôm nay đã đạt mục tiêu protein")
    
    if weight_trend.get("recent_change_kg") is not None:
        change = weight_trend["recent_change_kg"]
        if change > 0:
            personal_summary.append(f"- Xu hướng cân nặng: tăng {change}kg gần đây")
        elif change < 0:
            personal_summary.append(f"- Xu hướng cân nặng: giảm {abs(change)}kg gần đây")
        else:
            personal_summary.append(f"- Cân nặng đang ổn định")
    
    # Add meal details if available
    if meal_plan.get("breakfast") or meal_plan.get("lunch") or meal_plan.get("dinner"):
        meal_details = []
        if meal_plan.get("breakfast"):
            meal_details.append(f"  + Sáng: {', '.join(meal_plan['breakfast'][:3])}")
        if meal_plan.get("lunch"):
            meal_details.append(f"  + Trưa: {', '.join(meal_plan['lunch'][:3])}")
        if meal_plan.get("dinner"):
            meal_details.append(f"  + Tối: {', '.join(meal_plan['dinner'][:3])}")
        if meal_details:
            personal_summary.append("- Thực đơn hôm nay:")
            personal_summary.extend(meal_details)
    
    personal_summary_text = "\n".join(personal_summary) if personal_summary else "- Chưa có đủ dữ liệu"
    
    return f"""Bạn là Trợ lý NutriGain, một trợ lý AI thông minh hỗ trợ tăng cân lành mạnh.

THÔNG TIN NGƯỜI DÙNG:
{personal_summary_text}

QUAN TRỌNG - ĐỌC KỸ CÂU HỎI:
Người dùng đang hỏi: "{message}"
→ Hãy trả lời CHÍNH XÁC câu hỏi này, đừng trả lời chung chung!

CÁCH TRẢ LỜI:
1. ĐỌC KỸ câu hỏi người dùng
2. Trả lời ĐÚNG câu hỏi đó, không nói chuyện khác
3. Trả lời NGẮN GỌN (2-4 câu)
4. Nếu cần, giải thích thêm 1-2 câu

VÍ DỤ:
- Hỏi "tôi cần uống nước không?" → Trả lời về việc uống nước
- Hỏi "protein là gì?" → Giải thích protein
- Hỏi "hôm nay tôi ăn gì?" → Xem thực đơn và trả lời
- Hỏi "tôi còn thiếu gì?" → Xem kcal/protein còn thiếu

QUY TẮC:
✓ Trả lời bằng tiếng Việt thân thiện
✓ Dùng "mình" thay "tôi", xưng hô "bạn"
✓ Có thể thêm emoji nhẹ (💧 😊 🥛)
✓ KHÔNG chẩn đoán bệnh
✓ KHÔNG body shaming
✓ KHÔNG bịa số liệu{history_text}

Bây giờ hãy trả lời ĐÚNG câu hỏi: {message}"""


def fallback_chat_response(message: str, context: dict[str, Any]) -> str:
    text = normalize_text(message)
    meal_plan = context.get("meal_plan_today") or {}
    missing_kcal = meal_plan.get("missing_kcal")
    missing_protein = meal_plan.get("missing_protein")

    if has_any(text, ["dau", "chong mat", "non", "tieu chay keo dai", "ngat", "benh", "thuoc", "roi loan an uong", "sut can nhanh"]):
        return "Mình không thể chẩn đoán tình trạng sức khỏe. Nếu bạn có triệu chứng bất thường hoặc lo lắng về cân nặng, bạn nên tham khảo bác sĩ hoặc chuyên gia dinh dưỡng."

    if has_any(text, ["uong nuoc", "nuoc", "hydrate", "khat nuoc"]):
        return "Có nha! Uống nước rất quan trọng khi tăng cân 💧\n\nKhi tăng cân, bạn nên uống đủ 2-2.5 lít nước mỗi ngày. Nước giúp:\n✓ Cơ thể hấp thu dinh dưỡng tốt hơn\n✓ Tiêu hóa thức ăn dễ dàng hơn\n✓ Tránh táo bón khi ăn nhiều protein\n\nMẹo: Uống nước trước và sau mỗi bữa ăn khoảng 30 phút."

    if has_any(text, ["protein", "dam"]):
        answer = "Protein là chất giúp cơ thể xây dựng cơ bắp và phục hồi. Bạn có thể tìm thấy protein trong trứng, sữa, thịt, cá, đậu phụ hoặc đậu nành. Khi tăng cân, bạn nên chú ý cả năng lượng và protein."
        if missing_protein is not None:
            if float(missing_protein) > 0:
                answer += f" Hôm nay bạn còn thiếu khoảng {format_number(missing_protein, 1)}g protein."
            else:
                answer += " Protein hôm nay của bạn đã gần đạt hoặc đạt mục tiêu."
        return answer

    if has_any(text, ["kcal", "calo", "thieu", "an them", "bua phu", "con thieu gi"]):
        if missing_kcal is None:
            return "Mình chưa có đủ dữ liệu kcal hôm nay. Bạn có thể tạo hoặc cập nhật thực đơn để mình gợi ý chính xác hơn."
        missing = float(missing_kcal)
        if missing <= 0:
            return "Hôm nay bạn đã gần đạt hoặc đạt mục tiêu năng lượng rồi. Nếu vẫn đói, bạn có thể thêm một món nhẹ như sữa hoặc trái cây."
        if missing <= 200:
            return f"Bạn đang thiếu nhẹ khoảng {format_number(missing)} kcal. Có thể thêm 1 ly sữa, 1 quả chuối hoặc một phần yến mạch nhỏ."
        if missing <= 400:
            return f"Bạn còn thiếu khoảng {format_number(missing)} kcal. Có thể thêm bữa phụ như sữa + chuối, bánh mì + trứng hoặc yến mạch + sữa."
        return "Bạn còn thiếu khá nhiều năng lượng. Nên thêm một bữa phụ đầy đủ hơn và kiểm tra lại khẩu phần các bữa chính."

    if "ngu" in text:
        return "Ngủ đủ giúp cơ thể hồi phục, bớt mệt và ăn uống đều hơn. Khi tăng cân, ngủ đủ cũng quan trọng như ăn đủ vì cơ thể cần thời gian phục hồi."

    if "tang can lanh manh" in text:
        return "Tăng cân lành mạnh là tăng từ từ và đều đặn bằng cách ăn đủ bữa, thêm bữa phụ phù hợp, ngủ đủ và theo dõi cân nặng. Không cần ép bản thân ăn quá nhiều trong một bữa."

    if has_any(text, ["hieu lam", "sai lam", "myth"]):
        return "Một hiểu lầm thường gặp là muốn tăng cân thì chỉ cần ăn thật nhiều đồ ngọt hoặc đồ chiên. Cách an toàn hơn là tăng năng lượng từ bữa chính, thêm bữa phụ vừa sức, đủ protein và ngủ đều. Mục tiêu là tăng từ từ, không ép cơ thể quá mức."

    if has_any(text, ["huong dan", "su dung app", "dung app", "cach dung"]):
        return "Bạn có thể bắt đầu bằng cách cập nhật hồ sơ dinh dưỡng, tạo thực đơn hôm nay rồi đánh dấu món đã ăn. Sau đó xem phần kcal, protein còn thiếu và theo dõi cân nặng theo thời gian. Nếu thực đơn chưa hợp, bạn có thể điều chỉnh hồ sơ hoặc tạo lại thực đơn."

    if has_any(text, ["thuc don co phu hop khong", "thuc don on khong", "thuc don hom nay co phu hop"]):
        score = meal_plan.get("score")
        if score is None:
            return "Mình chưa có đủ dữ liệu đánh giá thực đơn, nhưng bạn có thể kiểm tra tổng kcal và protein so với mục tiêu."
        score_value = float(score)
        if score_value >= 90:
            return "Thực đơn hôm nay khá phù hợp. Nếu còn thiếu nhẹ kcal, bạn chỉ cần thêm một món phụ nhỏ."
        if score_value >= 85:
            return "Thực đơn gần ổn, nhưng có thể điều chỉnh nhẹ để sát mục tiêu hơn."
        return "Thực đơn hôm nay nên được điều chỉnh thêm để phù hợp hơn với mục tiêu."

    return "Mình có thể hỗ trợ bạn về thực đơn, bữa phụ, protein, giấc ngủ và cách tăng cân lành mạnh. Bạn muốn mình xem thực đơn hôm nay hay giải thích một chủ đề nào trước?"


def suggested_questions_for(message: str, context: dict[str, Any]) -> list[str]:
    text = normalize_text(message)
    meal_plan = context.get("meal_plan_today") or {}
    
    if has_any(text, ["protein", "dam"]):
        return [
            "Tôi nên ăn món nào giàu protein?",
            "Protein hôm nay của tôi đủ chưa?",
            "Tôi nên thêm gì vào bữa phụ?",
        ]
    
    if has_any(text, ["kcal", "calo", "thieu", "an them", "bua phu", "con thieu gi"]):
        suggestions = ["Tôi nên thêm bữa phụ gì?"]
        
        if meal_plan.get("missing_protein") and meal_plan["missing_protein"] > 0:
            suggestions.append("Protein hôm nay đã đủ chưa?")
        
        suggestions.append("Thực đơn hôm nay có phù hợp không?")
        return suggestions
    
    if has_any(text, ["thuc don", "sáng", "trua", "toi", "mon an"]):
        return [
            "Tôi còn thiếu gì hôm nay?",
            "Tôi nên ăn thêm gì?",
            "Làm sao để đạt mục tiêu protein?",
        ]
    
    return DEFAULT_SUGGESTED_QUESTIONS


def normalize_text(value: str) -> str:
    text = unicodedata.normalize("NFD", str(value or ""))
    text = "".join(char for char in text if unicodedata.category(char) != "Mn")
    return text.replace("đ", "d").replace("Đ", "D").lower()


def has_any(text: str, keywords: list[str]) -> bool:
    return any(keyword in text for keyword in keywords)


def round_float(value: Any, digits: int = 0) -> float | None:
    if value is None:
        return None
    try:
        return round(float(value), digits)
    except (TypeError, ValueError):
        return None


def format_number(value: Any, digits: int = 0) -> str:
    number = round_float(value, digits)
    if number is None:
        return ""
    if float(number).is_integer():
        return str(int(number))
    return str(number)
