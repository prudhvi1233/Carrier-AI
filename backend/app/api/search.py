from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.saved_job import SavedJob
from app.models.resume import Resume

router = APIRouter(tags=["Search"])

@router.get("/")
def global_search(q: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if len(q) < 2:
        return {"results": []}
        
    results = []
    
    # Search Jobs/Applications
    jobs = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id,
        or_(
            SavedJob.title.ilike(f"%{q}%"),
            SavedJob.company.ilike(f"%{q}%")
        )
    ).limit(5).all()
    for j in jobs:
        results.append({
            "type": "Application",
            "title": f"{j.title} at {j.company}",
            "detail": j.status
        })
        
    # Search Resumes
    resumes = db.query(Resume).filter(
        Resume.user_id == current_user.id,
        Resume.original_name.ilike(f"%{q}%")
    ).limit(5).all()
    for r in resumes:
        results.append({
            "type": "Resume",
            "title": r.original_name,
            "detail": "Uploaded Document"
        })
        
    return {"results": results}
