from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(tags=["Settings"])

@router.get("/")
def get_settings(current_user: User = Depends(get_current_user)):
    # Mock settings response for Phase 10 demo
    return {
        "theme": "dark",
        "language": "en",
        "notifications": {
            "email_alerts": True,
            "push_notifications": True,
            "interview_reminders": True,
            "marketing": False
        },
        "privacy": {
            "profile_visibility": "private"
        }
    }

@router.put("/")
def update_settings(settings: dict, current_user: User = Depends(get_current_user)):
    # Mock successful update
    return {"success": True, "settings": settings}
