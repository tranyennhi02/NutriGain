"""
Learning API Routes - Lesson progress, quiz, and statistics
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db
from app.models.entities import User
from app.services.learning_service import LearningService
from app.views.schemas import (
    LessonProgressResponse,
    LearningStatsResponse,
    ScrollProgressInput,
    QuizSubmitInput,
)

router = APIRouter(prefix="/learning", tags=["learning"])


@router.get("/progress", response_model=list[LessonProgressResponse])
def get_all_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all lesson progress for current user"""
    progress_list = LearningService.get_user_progress(db, current_user.id)
    return [
        LessonProgressResponse(
            lesson_id=p.lesson_id,
            status=p.status,
            scroll_progress=p.scroll_progress,
            time_spent_seconds=p.time_spent_seconds,
            quiz_unlocked=p.quiz_unlocked,
            quiz_attempts=p.quiz_attempts,
            quiz_best_score=p.quiz_best_score,
            quiz_passed=p.quiz_passed,
            quiz_locked_until=p.quiz_locked_until,
            xp_earned=p.xp_earned,
            completed_at=p.completed_at,
            started_at=p.started_at,
            last_accessed_at=p.last_accessed_at,
        )
        for p in progress_list
    ]


@router.get("/progress/{lesson_id}", response_model=LessonProgressResponse | None)
def get_lesson_progress(
    lesson_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get progress for a specific lesson"""
    progress = LearningService.get_user_progress(db, current_user.id, lesson_id)
    if not progress:
        return None

    return LessonProgressResponse(
        lesson_id=progress.lesson_id,
        status=progress.status,
        scroll_progress=progress.scroll_progress,
        time_spent_seconds=progress.time_spent_seconds,
        quiz_unlocked=progress.quiz_unlocked,
        quiz_attempts=progress.quiz_attempts,
        quiz_best_score=progress.quiz_best_score,
        quiz_passed=progress.quiz_passed,
        quiz_locked_until=progress.quiz_locked_until,
        xp_earned=progress.xp_earned,
        completed_at=progress.completed_at,
        started_at=progress.started_at,
        last_accessed_at=progress.last_accessed_at,
    )


@router.post("/progress/{lesson_id}/scroll", response_model=LessonProgressResponse)
def update_scroll_progress(
    lesson_id: str,
    data: ScrollProgressInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update scroll progress for a lesson"""
    progress = LearningService.update_scroll_progress(
        db=db,
        user_id=current_user.id,
        lesson_id=lesson_id,
        scroll_progress=data.scroll_progress,
        time_spent=data.time_spent,
    )
    
    return LessonProgressResponse(
        lesson_id=progress.lesson_id,
        status=progress.status,
        scroll_progress=progress.scroll_progress,
        time_spent_seconds=progress.time_spent_seconds,
        quiz_unlocked=progress.quiz_unlocked,
        quiz_attempts=progress.quiz_attempts,
        quiz_best_score=progress.quiz_best_score,
        quiz_passed=progress.quiz_passed,
        quiz_locked_until=progress.quiz_locked_until,
        xp_earned=progress.xp_earned,
        completed_at=progress.completed_at,
        started_at=progress.started_at,
        last_accessed_at=progress.last_accessed_at,
    )


@router.post("/quiz/{lesson_id}/submit", response_model=LessonProgressResponse)
def submit_quiz(
    lesson_id: str,
    data: QuizSubmitInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit quiz answers for a lesson"""
    answers = [
        {
            'question_id': ans.question_id,
            'selected_answer': ans.selected_answer,
            'is_correct': ans.is_correct,
            'time_spent': ans.time_spent,
        }
        for ans in data.answers
    ]
    
    progress = LearningService.submit_quiz(
        db=db,
        user_id=current_user.id,
        lesson_id=lesson_id,
        answers=answers,
        xp_reward=data.xp_reward,
    )
    
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson progress not found"
        )
    
    return LessonProgressResponse(
        lesson_id=progress.lesson_id,
        status=progress.status,
        scroll_progress=progress.scroll_progress,
        time_spent_seconds=progress.time_spent_seconds,
        quiz_unlocked=progress.quiz_unlocked,
        quiz_attempts=progress.quiz_attempts,
        quiz_best_score=progress.quiz_best_score,
        quiz_passed=progress.quiz_passed,
        quiz_locked_until=progress.quiz_locked_until,
        xp_earned=progress.xp_earned,
        completed_at=progress.completed_at,
        started_at=progress.started_at,
        last_accessed_at=progress.last_accessed_at,
    )


@router.get("/stats", response_model=LearningStatsResponse)
def get_learning_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get learning statistics for current user"""
    stats = LearningService.get_learning_stats(db, current_user.id)
    
    return LearningStatsResponse(
        total_xp=stats.total_xp,
        total_lessons_completed=stats.total_lessons_completed,
        total_lessons_in_progress=stats.total_lessons_in_progress,
        total_time_spent_seconds=stats.total_time_spent_seconds,
        current_streak_days=stats.current_streak_days,
        longest_streak_days=stats.longest_streak_days,
        last_activity_date=stats.last_activity_date,
        total_quiz_attempts=stats.total_quiz_attempts,
        total_quiz_passed=stats.total_quiz_passed,
        average_quiz_score=stats.average_quiz_score,
    )
