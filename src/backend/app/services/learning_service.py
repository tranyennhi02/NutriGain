"""
Learning Service - Manages lesson progress, quiz tracking, and XP
"""
from datetime import date, datetime, timedelta
from typing import Dict, List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.entities import LessonProgress, QuizAnswer, UserLearningStats


class LearningService:
    """Service for managing learning progress and statistics"""

    @staticmethod
    def get_user_progress(db: Session, user_id: int, lesson_id: Optional[str] = None):
        """Get user's lesson progress"""
        query = db.query(LessonProgress).filter(LessonProgress.user_id == user_id)
        if lesson_id:
            return query.filter(LessonProgress.lesson_id == lesson_id).first()
        return query.all()

    @staticmethod
    def update_scroll_progress(
        db: Session,
        user_id: int,
        lesson_id: str,
        scroll_progress: float,
        time_spent: int = 0
    ):
        """Update lesson scroll progress"""
        progress = (
            db.query(LessonProgress)
            .filter(LessonProgress.user_id == user_id, LessonProgress.lesson_id == lesson_id)
            .first()
        )

        if not progress:
            progress = LessonProgress(
                user_id=user_id,
                lesson_id=lesson_id,
                status="in_progress",
                started_at=datetime.utcnow()
            )
            db.add(progress)

        progress.scroll_progress = max(progress.scroll_progress, scroll_progress)
        progress.time_spent_seconds += time_spent
        
        if scroll_progress >= 80 and not progress.quiz_unlocked:
            progress.quiz_unlocked = True
        
        if progress.status == "not_started":
            progress.status = "in_progress"

        db.commit()
        db.refresh(progress)
        return progress

    @staticmethod
    def submit_quiz(
        db: Session,
        user_id: int,
        lesson_id: str,
        answers: List[Dict],
        xp_reward: int
    ):
        """Submit quiz answers and update progress"""
        progress = (
            db.query(LessonProgress)
            .filter(LessonProgress.user_id == user_id, LessonProgress.lesson_id == lesson_id)
            .first()
        )

        if not progress:
            return None

        # Calculate score
        correct_count = sum(1 for ans in answers if ans.get('is_correct'))
        score = (correct_count / len(answers)) * 100 if answers else 0

        # Save individual answers
        attempt_number = progress.quiz_attempts + 1
        for ans in answers:
            quiz_answer = QuizAnswer(
                lesson_progress_id=progress.id,
                question_id=ans['question_id'],
                attempt_number=attempt_number,
                selected_answer_index=ans['selected_answer'],
                is_correct=ans['is_correct'],
                time_spent_seconds=ans.get('time_spent', 0)
            )
            db.add(quiz_answer)

        # Update progress
        progress.quiz_attempts += 1
        progress.quiz_best_score = max(progress.quiz_best_score or 0, score)

        # Check if passed (80% threshold)
        if score >= 80:
            progress.quiz_passed = True
            progress.status = "completed"
            progress.xp_earned = xp_reward
            progress.completed_at = datetime.utcnow()
            
            # Update learning stats
            LearningService._update_learning_stats(db, user_id, xp_reward)
        else:
            # Failed - set lock timer if too many attempts
            if progress.quiz_attempts >= 3:
                progress.quiz_locked_until = datetime.utcnow() + timedelta(hours=1)

        db.commit()
        db.refresh(progress)
        return progress

    @staticmethod
    def _update_learning_stats(db: Session, user_id: int, xp_gained: int = 0):
        """Update user's learning statistics"""
        stats = db.query(UserLearningStats).filter(UserLearningStats.user_id == user_id).first()

        if not stats:
            stats = UserLearningStats(user_id=user_id)
            db.add(stats)

        # Update XP and counts
        stats.total_xp += xp_gained
        stats.total_lessons_completed = (
            db.query(func.count(LessonProgress.id))
            .filter(LessonProgress.user_id == user_id, LessonProgress.status == "completed")
            .scalar()
        )
        stats.total_lessons_in_progress = (
            db.query(func.count(LessonProgress.id))
            .filter(LessonProgress.user_id == user_id, LessonProgress.status == "in_progress")
            .scalar()
        )

        # Update streak
        today = date.today()
        if stats.last_activity_date:
            days_diff = (today - stats.last_activity_date).days
            if days_diff == 1:
                stats.current_streak_days += 1
                stats.longest_streak_days = max(stats.longest_streak_days, stats.current_streak_days)
            elif days_diff > 1:
                stats.current_streak_days = 1
        else:
            stats.current_streak_days = 1
            stats.longest_streak_days = 1

        stats.last_activity_date = today
        db.commit()
        db.refresh(stats)
        return stats

    @staticmethod
    def get_learning_stats(db: Session, user_id: int):
        """Get user's learning statistics"""
        stats = db.query(UserLearningStats).filter(UserLearningStats.user_id == user_id).first()
        if not stats:
            stats = UserLearningStats(user_id=user_id)
            db.add(stats)
            db.commit()
            db.refresh(stats)
        return stats
