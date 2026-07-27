from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.career_management import Activity

router = APIRouter(tags=["Activity"])

@router.get("/")
def get_activity_timeline(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch chronological activity timeline"""
    activities = db.query(Activity).filter(
        Activity.user_id == current_user.id
    ).order_by(Activity.timestamp.desc()).limit(50).all()
    
    return activities
