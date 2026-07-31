from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, timezone
from typing import List

from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.analytics import DashboardStats, AnalyticsSnapshot
from app.models.career_management import Activity
from app.models.analysis import Analysis
from app.models.saved_job import SavedJob
from app.models.interview import InterviewSession

from app.services.analytics_service import analytics_service

router = APIRouter(tags=["Analytics"])

@router.get("/")
def get_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns analytics data for charts (Resume Score, ATS Score, etc.)"""
    # Create or update DashboardStats
    stats = db.query(DashboardStats).filter(DashboardStats.user_id == current_user.id).first()
    if not stats:
        stats = DashboardStats(id=f"stat_{current_user.id}", user_id=current_user.id)
        db.add(stats)
        db.commit()

    # Calculate real data
    total_apps = db.query(SavedJob).filter(SavedJob.user_id == current_user.id, SavedJob.status != 'Saved').count()
    total_interviews = db.query(InterviewSession).filter(InterviewSession.user_id == current_user.id).count()
    
    avg_resume = db.query(func.avg(Analysis.overall_score)).filter(Analysis.user_id == current_user.id).scalar() or 0.0
    avg_ats = db.query(func.avg(Analysis.ats_score)).filter(Analysis.user_id == current_user.id).scalar() or 0.0

    stats.total_applications = total_apps
    stats.total_interviews = total_interviews
    stats.average_resume_score = avg_resume
    stats.average_ats_score = avg_ats
    db.commit()

    history_data = []
    base_date = datetime.utcnow() - timedelta(days=29)
    
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).order_by(Analysis.created_at.asc()).all()
    jobs = db.query(SavedJob).filter(SavedJob.user_id == current_user.id, SavedJob.status != 'Saved').all()

    last_resume_score = 0
    last_ats_score = 0

    for i in range(30):
        current_date = base_date + timedelta(days=i)
        next_date = current_date + timedelta(days=1)
        
        day_analyses = [a for a in analyses if a.created_at and current_date.date() == a.created_at.date()]
        if day_analyses:
            last_resume_score = sum(a.overall_score for a in day_analyses) / len(day_analyses)
            last_ats_score = sum(a.ats_score for a in day_analyses) / len(day_analyses)
            
        day_apps = [j for j in jobs if j.created_at and current_date.date() == j.created_at.date()]
        
        history_data.append({
            "date": current_date.strftime("%b %d"),
            "resume_score": round(last_resume_score, 1),
            "ats_score": round(last_ats_score, 1),
            "applications": len(day_apps)
        })

    return {
        "stats": {
            "total_applications": total_apps,
            "total_interviews": total_interviews,
            "average_resume_score": round(avg_resume, 1),
            "average_ats_score": round(avg_ats, 1),
            "application_success_rate": round((total_interviews / max(1, total_apps)) * 100, 1)
        },
        "history": history_data
    }

@router.get("/insights")
async def get_weekly_insights(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Generate AI Weekly Insights based on user activity."""
    # Get recent activities
    recent_activities = db.query(Activity).filter(
        Activity.user_id == current_user.id
    ).order_by(Activity.timestamp.desc()).limit(20).all()
    
    insights = await analytics_service.generate_insights(current_user, recent_activities)
    return {"insights": insights}
