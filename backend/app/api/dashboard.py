from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.models.parsed_resume import ParsedResume
from app.models.analysis import Analysis
from sqlalchemy import func

router = APIRouter(tags=["Dashboard"])

@router.get("/")
def get_dashboard_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Aggregates data for the frontend dashboard."""
    
    # 1. Total Resumes Uploaded
    total_uploaded_resumes = db.query(Resume).filter(Resume.user_id == current_user.id).count()
    
    # 2. Recent Activity (Latest Resumes)
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.uploaded_at.desc()).limit(5).all()
    
    recent_activity = []
    for r in resumes:
        # Check if analyzed
        analysis = db.query(Analysis).filter(Analysis.resume_id == r.id).first()
        status = "Analyzed" if analysis else "Pending"
        
        recent_activity.append({
            "id": r.id,
            "filename": r.original_name,
            "uploaded_at": r.uploaded_at.isoformat() if r.uploaded_at else None,
            "status": status,
            "overall_score": analysis.overall_score if analysis else None,
            "ats_score": analysis.ats_score if analysis else None
        })
        
    latest_analysis = {}
    if recent_activity and recent_activity[0]["status"] == "Analyzed":
        latest = recent_activity[0]
        db_analysis = db.query(Analysis).filter(Analysis.resume_id == latest["id"]).first()
        latest_analysis = {
            "status": latest["status"],
            "filename": latest["filename"],
            "ats_score": db_analysis.ats_score if db_analysis else None,
            "suggestions": db_analysis.improvements if db_analysis else []
        }
    elif recent_activity:
        latest = recent_activity[0]
        latest_analysis = {
            "status": latest["status"],
            "filename": latest["filename"],
            "ats_score": None,
            "suggestions": []
        }
        
    avg_score = db.query(func.avg(Analysis.overall_score)).filter(Analysis.user_id == current_user.id).scalar()
    highest_score = db.query(func.max(Analysis.overall_score)).filter(Analysis.user_id == current_user.id).scalar()
    
    from app.models.resume_draft import ResumeDraft
    saved_drafts = db.query(ResumeDraft).filter(ResumeDraft.user_id == current_user.id).count()
    
    return {
        "total_uploaded_resumes": total_uploaded_resumes,
        "average_score": avg_score if avg_score else 0,
        "highest_score": highest_score if highest_score else 0,
        "saved_drafts": saved_drafts,
        "latest_analysis": latest_analysis,
        "recent_activity": recent_activity
    }
